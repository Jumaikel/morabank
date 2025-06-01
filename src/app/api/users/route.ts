// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

interface CreateUserBody {
  identification: string;    // VARCHAR(20)
  name: string;              // VARCHAR(100)
  last_name: string;         // VARCHAR(100)
  phone: string;             // VARCHAR(15)
  account_iban: string;      // VARCHAR(24)
  email: string;             // VARCHAR(100)
  password: string;          // Texto plano que vamos a hashear
}

interface UserResponse {
  identification: string;
  name: string;
  last_name: string;
  phone: string;
  account_iban: string;
  email: string;
  created_at: string;        // ISO string
  updated_at: string;        // ISO string
}

export async function GET(req: NextRequest) {
  try {
    const allUsers = await prisma.users.findMany({
      orderBy: { created_at: 'desc' },
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

    interface DBUser {
        identification: string
        name: string
        last_name: string
        phone: string
        account_iban: string
        email: string
        created_at: Date
        updated_at: Date
    }

    const formatted: UserResponse[] = (allUsers as DBUser[]).map(
        (u: DBUser): UserResponse => ({
            identification: u.identification,
            name: u.name,
            last_name: u.last_name,
            phone: u.phone,
            account_iban: u.account_iban,
            email: u.email,
            created_at: u.created_at.toISOString(),
            updated_at: u.updated_at.toISOString(),
        })
    )

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error('Error en GET /api/users:', error);
    return NextResponse.json(
      { error: 'Error al listar usuarios' },
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
      phone,
      account_iban,
      email,
      password,
    } = body;

    if (
      !identification ||
      !name ||
      !last_name ||
      !phone ||
      !account_iban ||
      !email ||
      !password
    ) {
      return NextResponse.json(
        {
          error:
            'Faltan campos obligatorios: identification, name, last_name, phone, account_iban, email, password',
        },
        { status: 400 }
      );
    }
    if (
      typeof identification !== 'string' ||
      typeof name !== 'string' ||
      typeof last_name !== 'string' ||
      typeof phone !== 'string' ||
      typeof account_iban !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string'
    ) {
      return NextResponse.json(
        { error: 'Tipos de datos inválidos en algún campo' },
        { status: 400 }
      );
    }

    const existingById = await prisma.users.findUnique({
      where: { identification },
    });
    if (existingById) {
      return NextResponse.json(
        { error: 'Ya existe un usuario con esa identificación' },
        { status: 409 }
      );
    }
    const existingByPhone = await prisma.users.findFirst({
      where: { phone },
    });
    if (existingByPhone) {
      return NextResponse.json(
        { error: 'El número de teléfono ya está en uso' },
        { status: 409 }
      );
    }
    const existingByEmail = await prisma.users.findFirst({
      where: { email },
    });
    if (existingByEmail) {
      return NextResponse.json(
        { error: 'El correo electrónico ya está en uso' },
        { status: 409 }
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

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.users.create({
      data: {
        identification,
        name,
        last_name,
        phone,
        account_iban,
        email,
        password_hash,
      },
    });

    const response: UserResponse = {
      identification: newUser.identification,
      name: newUser.name,
      last_name: newUser.last_name,
      phone: newUser.phone,
      account_iban: newUser.account_iban,
      email: newUser.email,
      created_at: newUser.created_at.toISOString(),
      updated_at: newUser.updated_at.toISOString(),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error en POST /api/users:', error);
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
      { error: 'No se pudo crear el usuario' },
      { status: 500 }
    );
  }
}
