// app/api/users/[identification]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

interface Params {
  params: { identification: string };
}

interface UpdateUserBody {
  name?: string;
  last_name?: string;
  second_last_name?: string | null;
  phone?: string;
  account_iban?: string;
  email?: string;
  password?: string;
}

interface UserResponse {
  identification: string;
  name: string;
  last_name: string;
  second_last_name: string | null;
  phone: string;
  account_iban: string;
  email: string;
  user_type: string;
  created_at: string;
  updated_at: string;
}

export async function GET(req: NextRequest, { params }: Params) {
  const { identification } = await params;

  try {
    const user = await prisma.users.findUnique({
      where: { identification },
      select: {
        identification: true,
        name: true,
        last_name: true,
        second_last_name: true,
        phone: true,
        account_iban: true,
        email: true,
        user_type: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    const response: UserResponse = {
      identification: user.identification,
      name: user.name,
      last_name: user.last_name,
      second_last_name: user.second_last_name,
      phone: user.phone,
      account_iban: user.account_iban,
      email: user.email,
      user_type: user.user_type,
      created_at: user.created_at.toISOString(),
      updated_at: user.updated_at.toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(`Error in GET /api/users/${identification}:`, error);
    return NextResponse.json(
      { error: "Unable to retrieve user." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { identification } = await params;

  try {
    const body: UpdateUserBody = await req.json();
    const {
      name,
      last_name,
      second_last_name,
      phone,
      account_iban,
      email,
      password,
    } = body;

    if (
      name === undefined &&
      last_name === undefined &&
      second_last_name === undefined &&
      phone === undefined &&
      account_iban === undefined &&
      email === undefined &&
      password === undefined
    ) {
      return NextResponse.json(
        {
          error:
            "You must provide at least one of these fields to update: name, last_name, second_last_name, phone, account_iban, email, or password.",
        },
        { status: 400 }
      );
    }

    const dataToUpdate: any = {};

    if (name !== undefined) {
      if (typeof name !== "string") {
        return NextResponse.json(
          { error: "name must be a string." },
          { status: 400 }
        );
      }
      dataToUpdate.name = name;
    }
    if (last_name !== undefined) {
      if (typeof last_name !== "string") {
        return NextResponse.json(
          { error: "last_name must be a string." },
          { status: 400 }
        );
      }
      dataToUpdate.last_name = last_name;
    }
    if (second_last_name !== undefined) {
      if (second_last_name !== null && typeof second_last_name !== "string") {
        return NextResponse.json(
          { error: "second_last_name must be a string or null." },
          { status: 400 }
        );
      }
      dataToUpdate.second_last_name = second_last_name;
    }
    if (phone !== undefined) {
      if (typeof phone !== "string") {
        return NextResponse.json(
          { error: "phone must be a string." },
          { status: 400 }
        );
      }
      const existingPhone = await prisma.users.findFirst({
        where: { phone },
      });
      if (existingPhone && existingPhone.identification !== identification) {
        return NextResponse.json(
          { error: "This phone number is already in use." },
          { status: 409 }
        );
      }
      dataToUpdate.phone = phone;
    }
    if (account_iban !== undefined) {
      if (typeof account_iban !== "string") {
        return NextResponse.json(
          { error: "account_iban must be a string." },
          { status: 400 }
        );
      }
      const account = await prisma.accounts.findUnique({
        where: { iban: account_iban },
      });
      if (!account) {
        return NextResponse.json(
          { error: `Account with IBAN ${account_iban} does not exist.` },
          { status: 400 }
        );
      }
      dataToUpdate.account_iban = account_iban;
    }
    if (email !== undefined) {
      if (typeof email !== "string") {
        return NextResponse.json(
          { error: "email must be a string." },
          { status: 400 }
        );
      }
      const existingEmail = await prisma.users.findFirst({
        where: { email },
      });
      if (
        existingEmail &&
        existingEmail.identification !== identification
      ) {
        return NextResponse.json(
          { error: "This email address is already in use." },
          { status: 409 }
        );
      }
      dataToUpdate.email = email;
    }
    if (password !== undefined) {
      if (typeof password !== "string") {
        return NextResponse.json(
          { error: "password must be a string." },
          { status: 400 }
        );
      }
      const saltRounds = 10;
      const hashed = await bcrypt.hash(password, saltRounds);
      dataToUpdate.password_hash = hashed;
    }

    // Let Prisma update updated_at automatically via default now(6)
    const updatedUser = await prisma.users.update({
      where: { identification },
      data: dataToUpdate,
      select: {
        identification: true,
        name: true,
        last_name: true,
        second_last_name: true,
        phone: true,
        account_iban: true,
        email: true,
        user_type: true,
        created_at: true,
        updated_at: true,
      },
    });

    const response: UserResponse = {
      identification: updatedUser.identification,
      name: updatedUser.name,
      last_name: updatedUser.last_name,
      second_last_name: updatedUser.second_last_name,
      phone: updatedUser.phone,
      account_iban: updatedUser.account_iban,
      email: updatedUser.email,
      user_type: updatedUser.user_type,
      created_at: updatedUser.created_at.toISOString(),
      updated_at: updatedUser.updated_at.toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error(`Error in PUT /api/users/${identification}:`, error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "User not found for update." },
        { status: 404 }
      );
    }

    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Associated account (account_iban) does not exist." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Unable to update user." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { identification } = await params;

  try {
    await prisma.users.delete({
      where: { identification },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error(`Error in DELETE /api/users/${identification}:`, error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "User not found for deletion." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Unable to delete user." },
      { status: 500 }
    );
  }
}
