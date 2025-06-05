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

    // Validate required fields
    if (
      !identification ||
      !password ||
      typeof identification !== "string" ||
      typeof password !== "string"
    ) {
      return NextResponse.json(
        { error: "Missing required fields: identification and password." },
        { status: 400 }
      );
    }

    // Fetch user by identification
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
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    // Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    // Generate a 6-digit MFA code and expiration (5 minutes from now)
    const mfaCode = generateSixDigitCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Save the MFA code in the database
    await prisma.mfa_codes.create({
      data: {
        user_id: identification,
        mfa_code: mfaCode,
        expires_at: expiresAt,
      },
    });

    // Send the MFA code via email (if environment variables are set)
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
        subject: "Your MoraBank MFA Verification Code",
        text: `
Your MFA verification code is: ${mfaCode}

This code expires at: ${expiresAt.toLocaleString()}. Do not share it with anyone.

If you did not request this code, please ignore this message.

Regards,
Your Support Team
        `,
        html: `
<p>Hello,</p>
<p>Your MFA verification code is:</p>
<h2 style="font-size: 24px;">${mfaCode}</h2>
<p>This code expires at <strong>${expiresAt.toLocaleString()}</strong>. Do not share it with anyone.</p>
<p>If you did not request this code, please ignore this message.</p>
<br/>
<p>Regards,<br/>Your Support Team</p>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("MFA email sent to:", user.email);
      } catch (emailError) {
        console.error("Failed to send MFA email:", emailError);
      }
    } else {
      console.warn(
        "GMAIL_USER or GMAIL_PASS not defined; MFA email will not be sent."
      );
    }

    return NextResponse.json(
      { message: "MFA code generated and sent to email." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/auth/login:", error);
    return NextResponse.json(
      { error: "Unable to process authentication request." },
      { status: 500 }
    );
  }
}
