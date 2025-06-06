import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { phone: string } }
) {
  const { phone } = await params;

  if (!phone || typeof phone !== "string") {
    return NextResponse.json(
      { error: "Se debe proporcionar un número de teléfono válido." },
      { status: 400 }
    );
  }

  try {
    const subscription = await prisma.sinpe_subscriptions.findUnique({
      where: { sinpe_number: phone },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: `No existe suscripción SINPE para el número: ${phone}` },
        { status: 404 }
      );
    }

    return NextResponse.json(subscription, { status: 200 });
  } catch (err: any) {
    console.error("Error al consultar SINPE_SUBSCRIPTIONS:", err);
    return NextResponse.json(
      { error: "Error interno al consultar suscripción SINPE." },
      { status: 500 }
    );
  }
}
