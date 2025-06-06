import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Params {
  params: { id: string };
}

interface MfaCodeUpdateRequest {
  mfa_code?: string;
  expires_at?: string;
  used?: boolean;
}

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const idNum = Number(id);
  if (isNaN(idNum)) {
    return NextResponse.json(
      { error: "Invalid ID; must be an integer." },
      { status: 400 }
    );
  }

  try {
    const record = await prisma.mfa_codes.findUnique({
      where: { id: idNum },
    });

    if (!record) {
      return NextResponse.json(
        { error: "MFA code not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        id: record.id,
        user_id: record.user_id,
        mfa_code: record.mfa_code,
        created_at: record.created_at.toISOString(),
        expires_at: record.expires_at.toISOString(),
        used: record.used,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error in GET /api/mfa-codes/${id}:`, error);
    return NextResponse.json(
      { error: "Unable to retrieve MFA code." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const idNum = Number(id);
  if (isNaN(idNum)) {
    return NextResponse.json(
      { error: "Invalid ID; must be an integer." },
      { status: 400 }
    );
  }

  try {
    const body: MfaCodeUpdateRequest = await req.json();
    const { mfa_code, expires_at, used } = body;

    if (
      mfa_code === undefined &&
      expires_at === undefined &&
      used === undefined
    ) {
      return NextResponse.json(
        { error: "Must provide at least one of: mfa_code, expires_at, or used." },
        { status: 400 }
      );
    }

    const dataToUpdate: any = {};

    if (mfa_code !== undefined) {
      if (typeof mfa_code !== "string") {
        return NextResponse.json(
          { error: "mfa_code must be a string." },
          { status: 400 }
        );
      }
      dataToUpdate.mfa_code = mfa_code;
    }

    if (expires_at !== undefined) {
      if (typeof expires_at !== "string") {
        return NextResponse.json(
          { error: "expires_at must be an ISO date string." },
          { status: 400 }
        );
      }
      const dateObj = new Date(expires_at);
      if (isNaN(dateObj.getTime())) {
        return NextResponse.json(
          { error: "expires_at must be a valid ISO date." },
          { status: 400 }
        );
      }
      dataToUpdate.expires_at = dateObj;
    }

    if (used !== undefined) {
      if (typeof used !== "boolean") {
        return NextResponse.json(
          { error: "used must be a boolean." },
          { status: 400 }
        );
      }
      dataToUpdate.used = used;
    }

    const updated = await prisma.mfa_codes.update({
      where: { id: idNum },
      data: dataToUpdate,
    });

    return NextResponse.json(
      {
        id: updated.id,
        user_id: updated.user_id,
        mfa_code: updated.mfa_code,
        created_at: updated.created_at.toISOString(),
        expires_at: updated.expires_at.toISOString(),
        used: updated.used,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Error in PUT /api/mfa-codes/${id}:`, error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "MFA code not found for update." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Unable to update MFA code." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const idNum = Number(id);
  if (isNaN(idNum)) {
    return NextResponse.json(
      { error: "Invalid ID; must be an integer." },
      { status: 400 }
    );
  }

  try {
    await prisma.mfa_codes.delete({
      where: { id: idNum },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error(`Error in DELETE /api/mfa-codes/${id}:`, error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "MFA code not found for deletion." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Unable to delete MFA code." },
      { status: 500 }
    );
  }
}
