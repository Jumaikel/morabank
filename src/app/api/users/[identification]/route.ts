import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

interface Params {
  params: { identification: string };
}

interface UpdateUserBody {
  name?: string;
  last_name?: string;
  phone?: string;
  account_iban?: string;
  email?: string;
  password?: string;
}

interface UserResponse {
  identification: string;
  name: string;
  last_name: string;
  phone: string;
  account_iban: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export async function GET(req: NextRequest, { params }: Params) {
  const { identification } = params;

  try {
    const user = await prisma.users.findUnique({
      where: { identification },
      select: {
        identification: true,
        name: true,
        last_name: true,
        phone: true,
        account_iban: true,
        email: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const response: UserResponse = {
      identification: user.identification,
      name: user.name,
      last_name: user.last_name,
      phone: user.phone,
      account_iban: user.account_iban,
      email: user.email,
      created_at: user.created_at.toISOString(),
      updated_at: user.updated_at.toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(`Error en GET /api/users/${identification}:`, error);
    return NextResponse.json(
      { error: 'Error al buscar el usuario' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { identification } = params;

  try {
    const body: UpdateUserBody = await req.json();
    const {
      name,
      last_name,
      phone,
      account_iban,
      email,
      password,
    } = body;

    if (
      name === undefined &&
      last_name === undefined &&
      phone === undefined &&
      account_iban === undefined &&
      email === undefined &&
      password === undefined
    ) {
      return NextResponse.json(
        {
          error:
            'Debes enviar al menos uno de estos campos: name, last_name, phone, account_iban, email, password',
        },
        { status: 400 }
      );
    }

    const dataToUpdate: any = {};

    if (name !== undefined) {
      if (typeof name !== 'string') {
        return NextResponse.json(
          { error: 'name debe ser un string' },
          { status: 400 }
        );
      }
      dataToUpdate.name = name;
    }
    if (last_name !== undefined) {
      if (typeof last_name !== 'string') {
        return NextResponse.json(
          { error: 'last_name debe ser un string' },
          { status: 400 }
        );
      }
      dataToUpdate.last_name = last_name;
    }
    if (phone !== undefined) {
      if (typeof phone !== 'string') {
        return NextResponse.json(
          { error: 'phone debe ser un string' },
          { status: 400 }
        );
      }
      const existingPhone = await prisma.users.findFirst({
        where: { phone },
      });
      if (existingPhone && existingPhone.identification !== identification) {
        return NextResponse.json(
          { error: 'El número de teléfono ya está en uso' },
          { status: 409 }
        );
      }
      dataToUpdate.phone = phone;
    }
    if (account_iban !== undefined) {
      if (typeof account_iban !== 'string') {
        return NextResponse.json(
          { error: 'account_iban debe ser un string' },
          { status: 400 }
        );
      }
      const cuenta = await prisma.accounts.findUnique({
        where: { iban: account_iban },
      });
      if (!cuenta) {
        return NextResponse.json(
          { error: `La cuenta con IBAN ${account_iban} no existe` },
          { status: 400 }
        );
      }
      dataToUpdate.account_iban = account_iban;
    }
    if (email !== undefined) {
      if (typeof email !== 'string') {
        return NextResponse.json(
          { error: 'email debe ser un string' },
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
          { error: 'El correo electrónico ya está en uso' },
          { status: 409 }
        );
      }
      dataToUpdate.email = email;
    }
    if (password !== undefined) {
      if (typeof password !== 'string') {
        return NextResponse.json(
          { error: 'password debe ser un string' },
          { status: 400 }
        );
      }
      const saltRounds = 10;
      const newHash = await bcrypt.hash(password, saltRounds);
      dataToUpdate.password_hash = newHash;
    }

    dataToUpdate.updated_at = new Date();

    const updatedUser = await prisma.users.update({
      where: { identification },
      data: dataToUpdate,
      select: {
        identification: true,
        name: true,
        last_name: true,
        phone: true,
        account_iban: true,
        email: true,
        created_at: true,
        updated_at: true,
      },
    });

    const response: UserResponse = {
      identification: updatedUser.identification,
      name: updatedUser.name,
      last_name: updatedUser.last_name,
      phone: updatedUser.phone,
      account_iban: updatedUser.account_iban,
      email: updatedUser.email,
      created_at: updatedUser.created_at.toISOString(),
      updated_at: updatedUser.updated_at.toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(`Error en PUT /api/users/${identification}:`, error);

    if (
      typeof (error as any).code === 'string' &&
      (error as any).code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Usuario no encontrado para actualizar' },
        { status: 404 }
      );
    }

    if (
      typeof (error as any).code === 'string' &&
      (error as any).code === 'P2003'
    ) {
      return NextResponse.json(
        { error: 'La cuenta asociada (account_iban) no existe' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'No se pudo actualizar el usuario' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { identification } = params;

  try {
    await prisma.users.delete({
      where: { identification },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Error en DELETE /api/users/${identification}:`, error);
    if (
      typeof (error as any).code === 'string' &&
      (error as any).code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Usuario no encontrado para eliminar' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'No se pudo eliminar el usuario' },
      { status: 500 }
    );
  }
}
