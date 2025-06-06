import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, context: { params: { identification: string } }) {
  const { identification } = context.params;
  if (!identification) {
    return NextResponse.json(
      { error: "User identification is required" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.users.findUnique({
      where: { identification },
      include: {
        accounts: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (!user.accounts) {
      return NextResponse.json(
        { error: "Account not found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json(user.accounts, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/accounts/by-user/[identification]:", error);
    return NextResponse.json(
      { error: "Error retrieving account by user" },
      { status: 500 }
    );
  }
}
