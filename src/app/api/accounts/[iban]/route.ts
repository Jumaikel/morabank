import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { encryptText, decryptText } from '@/lib/crypto';

interface Params {
  params: { iban: string };
}

export async function GET(req: NextRequest, { params }: Params) {
  const { iban } = await params;

  try {
    const account = await prisma.accounts.findUnique({
      where: { iban },
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    let decryptedHolder: string;
    try {
      decryptedHolder = decryptText(account.account_holder);
    } catch {
      decryptedHolder = account.account_holder;
    }

    return NextResponse.json(
      {
        iban: account.iban,
        account_number: account.account_number,
        account_type: account.account_type,   // "CORRIENTE" or "AHORROS"
        account_holder: decryptedHolder,
        balance: account.balance,
        status: account.status,
        created_at: account.created_at,
        updated_at: account.updated_at,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error in GET /api/accounts/${iban}:`, error);
    return NextResponse.json(
      { error: 'Unable to retrieve account' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { iban } = await params;

  try {
    const body = await req.json();
    const {
      account_holder,
      balance,
      status,
      account_type,
    } = body as Partial<{
      account_holder: string;
      balance: number;
      status: 'ACTIVE' | 'BLOCKED' | 'CLOSED';
      account_type: 'CORRIENTE' | 'AHORROS';
    }>;

    const dataToUpdate: any = {};

    if (account_holder !== undefined) {
      try {
        dataToUpdate.account_holder = encryptText(account_holder);
      } catch (e) {
        console.error('Encryption error in PUT /api/accounts:', e);
        return NextResponse.json(
          { error: 'Failed to encrypt account_holder' },
          { status: 500 }
        );
      }
    }

    if (balance !== undefined) {
      if (typeof balance !== 'number' || balance < 0) {
        return NextResponse.json(
          { error: 'Invalid balance value' },
          { status: 400 }
        );
      }
      dataToUpdate.balance = balance;
    }

    if (status !== undefined) {
      const validStatuses = ['ACTIVE', 'BLOCKED', 'CLOSED'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status. Must be ACTIVE, BLOCKED, or CLOSED.' },
          { status: 400 }
        );
      }
      dataToUpdate.status = status;
    }

    if (account_type !== undefined) {
      const validTypes = ['CORRIENTE', 'AHORROS'];
      if (!validTypes.includes(account_type)) {
        return NextResponse.json(
          { error: 'Invalid account_type. Must be CORRIENTE or AHORROS.' },
          { status: 400 }
        );
      }
      dataToUpdate.account_type = account_type;
    }

    // Prisma will update updated_at automatically with default NOW(6)
    const updatedAccount = await prisma.accounts.update({
      where: { iban },
      data: dataToUpdate,
    });

    let decryptedHolderAfter: string;
    try {
      decryptedHolderAfter = decryptText(updatedAccount.account_holder);
    } catch {
      decryptedHolderAfter = updatedAccount.account_holder;
    }

    return NextResponse.json(
      {
        iban: updatedAccount.iban,
        account_number: updatedAccount.account_number,
        account_type: updatedAccount.account_type,
        account_holder: decryptedHolderAfter,
        balance: updatedAccount.balance,
        status: updatedAccount.status,
        created_at: updatedAccount.created_at,
        updated_at: updatedAccount.updated_at,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Error in PUT /api/accounts/${iban}:`, error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Account not found for update' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Unable to update account' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { iban } = await params;

  try {
    await prisma.accounts.delete({
      where: { iban },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error(`Error in DELETE /api/accounts/${iban}:`, error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Account not found for deletion' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Unable to delete account' },
      { status: 500 }
    );
  }
}
