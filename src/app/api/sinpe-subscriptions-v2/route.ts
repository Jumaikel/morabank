import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import pgsqlPrisma from "@/lib/pgsqlClient";

interface SubscriptionBody {
  sinpe_number: string;
  sinpe_client_name: string;
  sinpe_bank_code: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: SubscriptionBody = await req.json();
    const { sinpe_number, sinpe_client_name, sinpe_bank_code } = body;

    // Validaciones básicas
    if (
      !sinpe_number ||
      !sinpe_client_name ||
      !sinpe_bank_code ||
      typeof sinpe_number !== "string" ||
      typeof sinpe_client_name !== "string" ||
      typeof sinpe_bank_code !== "string"
    ) {
      return NextResponse.json(
        { error: "Se requieren sinpe_number, sinpe_client_name y sinpe_bank_code." },
        { status: 400 }
      );
    }

    // Intentar crear registro
    const created = await pgsqlPrisma.sinpe_subscriptions.create({
      data: {
        sinpe_number,
        sinpe_client_name,
        sinpe_bank_code,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error("Error al registrar suscripción SINPE:", err);

    // P2002 = Violación de unicidad
    if (err.code === "P2002" && err.meta?.target) {
      const target = (err.meta.target as string[]).join(", ");
      return NextResponse.json(
        { error: `Ya existe un registro con el mismo campo: ${target}` },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Error interno al registrar suscripción SINPE." },
      { status: 500 }
    );
  }
}
