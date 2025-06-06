import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Generates a unique IBAN following Costa Rica format: “CR” + 2 check digits + “0” + bankCode + branchCode + 12‐digit account number
async function generateIbanNumber(): Promise<string> {
  let iban: string;
  let exists = true;

  const countryCode = "CR";
  const checkDigits = "21"; // Could be calculated, but using fixed "21"
  const fixedZero = "0";
  const bankCode = "152"; // Change to your bank’s code if needed
  const branchCode = "0001"; // Fixed branch code

  do {
    // Generate 12 random digits for the customer account number
    const accountNumber12 = Math.floor(Math.random() * 1_000_000_000_000)
      .toString()
      .padStart(12, "0");
    iban = `${countryCode}${checkDigits}${fixedZero}${bankCode}${branchCode}${accountNumber12}`;

    const account = await prisma.accounts.findUnique({
      where: { iban },
    });
    exists = !!account;
  } while (exists);

  return iban;
}

// Generates a 16-digit local account number (e.g., Visa/Costa Rica format)
function generateLocalAccountNumber(): string {
  return Math.floor(Math.random() * 1_0000_0000_0000_0000)
    .toString()
    .padStart(16, "0");
}

interface CreateUserBody {
  identification: string; // VARCHAR(20)
  name: string; // VARCHAR(100)
  last_name: string; // VARCHAR(100)
  second_last_name?: string | null; // VARCHAR(100), optional
  phone: string; // VARCHAR(15)
  email: string; // VARCHAR(100)
  password: string; // plaintext to be hashed
  account_type: "CORRIENTE" | "AHORROS"; // type of account at registration
}

interface UserResponse {
  identification: string;
  name: string;
  last_name: string;
  second_last_name: string | null;
  phone: string;
  account_iban: string;
  account_number: string;
  account_type: string;
  email: string;
  created_at: string; // ISO string
  updated_at: string; // ISO string
}

export async function GET(req: NextRequest) {
  try {
    const allUsers = await prisma.users.findMany({
      orderBy: { created_at: "desc" },
      select: {
        identification: true,
        name: true,
        last_name: true,
        second_last_name: true,
        phone: true,
        account_iban: true,
        email: true,
        created_at: true,
        updated_at: true,
      },
    });

    const formatted: UserResponse[] = allUsers.map((u) => ({
      identification: u.identification,
      name: u.name,
      last_name: u.last_name,
      second_last_name: u.second_last_name,
      phone: u.phone,
      account_iban: u.account_iban,
      account_number: "", // Not returned here; can fetch separately if needed
      account_type: "", // Not returned here; can fetch separately if needed
      email: u.email,
      created_at: u.created_at.toISOString(),
      updated_at: u.updated_at.toISOString(),
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/users:", error);
    return NextResponse.json(
      { error: "Unable to list users." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: CreateUserBody = await req.json();
    const {
      identification,
      name,
      last_name,
      second_last_name,
      phone,
      email,
      password,
      account_type,
    } = body;

    // Validate required fields
    if (
      !identification ||
      !name ||
      !last_name ||
      !phone ||
      !email ||
      !password ||
      !account_type
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: identification, name, last_name, phone, email, password, account_type.",
        },
        { status: 400 }
      );
    }
    if (
      typeof identification !== "string" ||
      typeof name !== "string" ||
      typeof last_name !== "string" ||
      typeof phone !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      (account_type !== "CORRIENTE" && account_type !== "AHORROS")
    ) {
      return NextResponse.json(
        { error: "Invalid data types or invalid account_type." },
        { status: 400 }
      );
    }

    // Check uniqueness: identification, phone, email
    const existingById = await prisma.users.findUnique({
      where: { identification },
    });
    if (existingById) {
      return NextResponse.json(
        { error: "A user with that identification already exists." },
        { status: 409 }
      );
    }
    const existingByPhone = await prisma.users.findFirst({
      where: { phone },
    });
    if (existingByPhone) {
      return NextResponse.json(
        { error: "Phone number already in use." },
        { status: 409 }
      );
    }
    const existingByEmail = await prisma.users.findFirst({
      where: { email },
    });
    if (existingByEmail) {
      return NextResponse.json(
        { error: "Email already in use." },
        { status: 409 }
      );
    }

    // 1) Generate a new unique IBAN
    const newIban = await generateIbanNumber();

    // 2) Generate a 16‐digit local account number
    const newAccountNumber = generateLocalAccountNumber();

    // 3) Hash the user’s password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // 4) Create the account record
    const accountHolderName = `${name} ${last_name} ${second_last_name ?? ""}`; // Combine for account holder
    const newAccount = await prisma.accounts.create({
      data: {
        iban: newIban,
        account_number: newAccountNumber,
        account_type,
        account_holder: accountHolderName,
        balance: 0.0,
        status: "ACTIVO",
      },
    });

    // 5) Create the user and link to newly created account
    const newUser = await prisma.users.create({
      data: {
        identification,
        name,
        last_name,
        second_last_name: second_last_name ?? null,
        phone,
        account_iban: newAccount.iban,
        email,
        password_hash,
        user_type: "C", // Default to Customer; change if needed
      },
    });

    const response: UserResponse = {
      identification: newUser.identification,
      name: newUser.name,
      last_name: newUser.last_name,
      second_last_name: newUser.second_last_name,
      phone: newUser.phone,
      account_iban: newAccount.iban,
      account_number: newAccount.account_number,
      account_type: newAccount.account_type,
      email: newUser.email,
      created_at: newUser.created_at.toISOString(),
      updated_at: newUser.updated_at.toISOString(),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/users:", error);

    // Handle foreign key or constraint errors
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Failed to create associated account." },
        { status: 400 }
      );
    }
    if (error.code === "P2002") {
      // Unique constraint violation
      const meta = (error.meta as any)?.target;
      return NextResponse.json(
        { error: `Unique constraint failed on the field: ${meta}` },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Unable to create user." },
      { status: 500 }
    );
  }
}
