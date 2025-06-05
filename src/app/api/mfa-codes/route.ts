import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface MfaCodeRequestBody {
  user_id: string;
  mfa_code: string;
  expires_at: string;
}

export async function GET(req: NextRequest) {
  try {
    // Fetch all MFA codes, most recent first
    const allCodes = await prisma.mfa_codes.findMany({
      orderBy: { created_at: "desc" },
    });

    // Format dates to ISO strings
    const formatted = allCodes.map((item) => ({
      id: item.id,
      user_id: item.user_id,
      mfa_code: item.mfa_code,
      created_at: item.created_at.toISOString(),
      expires_at: item.expires_at.toISOString(),
      used: item.used,
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/mfa-codes:", error);
    return NextResponse.json(
      { error: "Unable to list MFA codes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: MfaCodeRequestBody = await req.json();
    const { user_id, mfa_code, expires_at } = body;

    // Validate required fields and types
    if (
      !user_id ||
      !mfa_code ||
      !expires_at ||
      typeof user_id !== "string" ||
      typeof mfa_code !== "string" ||
      typeof expires_at !== "string"
    ) {
      return NextResponse.json(
        { error: "Missing or invalid fields: user_id, mfa_code, expires_at" },
        { status: 400 }
      );
    }

    // Validate expires_at is a valid ISO date
    const expiresDate = new Date(expires_at);
    if (isNaN(expiresDate.getTime())) {
      return NextResponse.json(
        { error: "expires_at must be a valid ISO date string" },
        { status: 400 }
      );
    }

    // Optionally verify that the user exists before creating the code
    const userExists = await prisma.users.findUnique({
      where: { identification: user_id },
    });
    if (!userExists) {
      return NextResponse.json(
        { error: "Specified user_id does not exist" },
        { status: 400 }
      );
    }

    // Create new MFA code record
    const newMfa = await prisma.mfa_codes.create({
      data: {
        user_id,
        mfa_code,
        expires_at: expiresDate,
        used: false,
      },
    });

    // Prepare response payload
    const responsePayload = {
      id: newMfa.id,
      user_id: newMfa.user_id,
      mfa_code: newMfa.mfa_code,
      created_at: newMfa.created_at.toISOString(),
      expires_at: newMfa.expires_at.toISOString(),
      used: newMfa.used,
    };

    return NextResponse.json(responsePayload, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/mfa-codes:", error);

    // Handle foreign key violation if user_id does not exist
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Foreign key constraint failed: user_id does not exist" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Unable to create MFA code" },
      { status: 500 }
    );
  }
}
