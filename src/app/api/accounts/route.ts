import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { encryptText, decryptText } from "@/lib/crypto";

export async function GET(req: NextRequest) {
  try {
    // Fetch all accounts from the database
    const accounts = await prisma.accounts.findMany();

    // Map and decrypt the account_holder before sending
    const decryptedAccounts = accounts.map((acct) => {
      let holderName: string;
      try {
        holderName = decryptText(acct.account_holder);
      } catch {
        // If decryption fails for any reason, fall back to stored value
        holderName = acct.account_holder;
      }

      return {
        iban: acct.iban,
        account_number: acct.account_number,
        account_type: acct.account_type, // "CORRIENTE" or "AHORROS"
        account_holder: holderName,
        balance: acct.balance,
        status: acct.status,
        created_at: acct.created_at,
        updated_at: acct.updated_at,
      };
    });

    return NextResponse.json(decryptedAccounts, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/accounts:", error);
    return NextResponse.json(
      { error: "Unable to fetch accounts" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Destructure expected fields from request body
    const {
      iban,
      account_number,
      account_type,
      account_holder,
      balance,
      status,
    } = body;

    // Validate required fields
    if (!iban || !account_number || !account_type || !account_holder) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: iban, account_number, account_type, account_holder",
        },
        { status: 400 }
      );
    }

    // Validate account_type enum
    const validTypes = ["CORRIENTE", "AHORROS"];
    if (!validTypes.includes(account_type)) {
      return NextResponse.json(
        { error: 'Invalid account_type. Must be "CORRIENTE" or "AHORROS".' },
        { status: 400 }
      );
    }

    // Encrypt the account_holder before saving
    let encryptedHolder: string;
    try {
      encryptedHolder = encryptText(String(account_holder));
    } catch (e) {
      console.error("Encryption error for account_holder:", e);
      return NextResponse.json(
        { error: "Failed to encrypt account_holder" },
        { status: 500 }
      );
    }

    // Build data object for Prisma
    const dataToCreate = {
      iban: String(iban),
      account_number: String(account_number),
      account_type: account_type as "CORRIENTE" | "AHORROS",
      account_holder: encryptedHolder,
      balance: typeof balance === "number" ? balance : 0.0,
      status: typeof status === "string" ? status : "ACTIVE",
      // created_at and updated_at will be set automatically by Prisma defaults
    };

    // Attempt to create the new account
    const newAccount = await prisma.accounts.create({
      data: dataToCreate,
    });

    // Prepare the response with decrypted account_holder
    let decryptedHolder: string;
    try {
      decryptedHolder = decryptText(newAccount.account_holder);
    } catch {
      decryptedHolder = newAccount.account_holder;
    }

    const responsePayload = {
      iban: newAccount.iban,
      account_number: newAccount.account_number,
      account_type: newAccount.account_type,
      account_holder: decryptedHolder,
      balance: newAccount.balance,
      status: newAccount.status,
      created_at: newAccount.created_at,
      updated_at: newAccount.updated_at,
    };

    return NextResponse.json(responsePayload, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/accounts:", error);

    // Handle unique constraint violations for iban or account_number
    if (error.code === "P2002") {
      const target = (error.meta as any)?.target;
      if (Array.isArray(target) && target.includes("iban")) {
        return NextResponse.json(
          { error: "An account with this IBAN already exists." },
          { status: 409 }
        );
      }
      if (Array.isArray(target) && target.includes("account_number")) {
        return NextResponse.json(
          { error: "An account with this account_number already exists." },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Unable to create account" },
      { status: 500 }
    );
  }
}
