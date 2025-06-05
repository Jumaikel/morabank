import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

function generateSixDigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { identification } = await req.json();

    if (!identification || typeof identification !== "string") {
      return NextResponse.json(
        { error: "La identificación es obligatoria y debe ser una cadena." },
        { status: 400 }
      );
    }

    // 1) Verificar que el usuario exista
    const user = await prisma.users.findUnique({
      where: { identification },
      select: { email: true },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado." },
        { status: 404 }
      );
    }

    // 2) Generar código OTP de 6 dígitos y fecha de expiración (5 minutos)
    const otpCode = generateSixDigitCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // 3) Guardar en mfa_codes
    await prisma.mfa_codes.create({
      data: {
        user_id: identification,
        mfa_code: otpCode,
        expires_at: expiresAt,
        used: false,
      },
    });

    // 4) Enviar OTP por correo si están configuradas las credenciales
    if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
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
        subject: "Código OTP para cambiar contraseña",
        text: `
Hola,

Tu código OTP para cambiar la contraseña es: ${otpCode}

Este código expira el ${expiresAt.toLocaleString()}. No compartas este código con nadie.

Si no solicitaste este código, ignora este correo.

Saludos,
Equipo de soporte.
        `,
        html: `
<p>Hola,</p>
<p>Tu código OTP para cambiar la contraseña es:</p>
<h2 style="font-size: 24px;">${otpCode}</h2>
<p>Este código expira el <strong>${expiresAt.toLocaleString()}</strong>. No compartas este código con nadie.</p>
<p>Si no solicitaste este código, ignora este correo.</p>
<br/>
<p>Saludos,<br/>Equipo de soporte.</p>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (mailErr) {
        console.error("Error al enviar el OTP por correo:", mailErr);
        // No abortamos: el OTP ya está en la DB; devolvemos 200 para que el front muestre mensaje.
      }
    } else {
      console.warn(
        "GMAIL_USER o GMAIL_PASS no están definidos; no se enviará correo OTP."
      );
    }

    return NextResponse.json(
      { message: "OTP generado y enviado si el correo está configurado." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en POST /api/auth/send-otp:", error);
    return NextResponse.json(
      { error: "Error interno al generar OTP." },
      { status: 500 }
    );
  }
}
