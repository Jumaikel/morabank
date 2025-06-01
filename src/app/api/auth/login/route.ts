import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

interface LoginRequestBody {
  identification: string;
  password: string;
}

function generateSixDigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const body: LoginRequestBody = await req.json();
    const { identification, password } = body;

    if (
      !identification ||
      !password ||
      typeof identification !== "string" ||
      typeof password !== "string"
    ) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios: identification y password" },
        { status: 400 }
      );
    }

    const user = await prisma.users.findUnique({
      where: { identification },
      select: {
        identification: true,
        password_hash: true,
        email: true,
      },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const mfaCode = generateSixDigitCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.mfa_codes.create({
      data: {
        user_id: identification,
        mfa_code: mfaCode,
        expires_at: expiresAt,
      },
    });

    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.warn(
        "GMAIL_USER o GMAIL_PASS no están definidos; no se enviará correo."
      );
    } else {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.GMAIL_USER,
        to: user.email,
        subject: "Tu código de verificación MFA para MoraBank",
        text: `
Tu código de verificación para iniciar sesión es: ${mfaCode}

Este código expira el ${expiresAt.toLocaleString()}. No lo compartas con nadie.

Si no solicitaste este código, ignora este correo.

Saludos,
Tu equipo de soporte.
        `,
        html: `
<p>Hola,</p>
<p>Tu código de verificación para iniciar sesión es:</p>
<h2 style="font-size: 24px;">${mfaCode}</h2>
<p>Este código expira el <strong>${expiresAt.toLocaleString()}</strong>. No lo compartas con nadie.</p>
<p>Si no solicitaste este código, ignora este correo.</p>
<br/>
<p>Saludos,<br/>Tu equipo de soporte.</p>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("Correo MFA enviado a:", user.email);
      } catch (err) {
        console.error("Error al enviar correo MFA con Nodemailer:", err);
      }
    }
    return NextResponse.json(
      { message: "Código MFA generado y enviado al correo." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en POST /api/auth/login:", error);
    return NextResponse.json(
      { error: "No se pudo procesar la autenticación" },
      { status: 500 }
    );
  }
}
