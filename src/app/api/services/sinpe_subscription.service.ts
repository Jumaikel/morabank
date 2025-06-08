

export interface SinpeSubscription {
  sinpe_number: string;
  sinpe_client_name: string;
  sinpe_bank_code: string;
}

/**
 * Consulta la suscripción SINPE de un número de teléfono,
 * usando el endpoint definido en /api/sinpe-subscriptions-v2/[phone]/route.ts
 */
export async function getSinpeSubscription(
  phone: string
): Promise<SinpeSubscription> {
  const base = process.env.NEXT_PUBLIC_SINPE_SUBSCRIPTIONS_API || "/api/sinpe-subscriptions";
  // Si está corriendo en serverless Next.js, una URL vacía hará la petición relativa
  const url = `${base}/${encodeURIComponent(
    phone
  )}`;

  console.log(`[SINPE_SUB] Fetching subscription for ${phone} from ${url}`);
  const res = await fetch(url, { cache: "no-store" });

  if (res.status === 404) {
    console.warn(`[SINPE_SUB] No subscription found for ${phone}`);
    throw new Error(`No existe suscripción SINPE para el número: ${phone}`);
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(
      `[SINPE_SUB] Error ${res.status} fetching subscription: ${text}`
    );
    throw new Error(
      `Error ${res.status} al consultar suscripción SINPE: ${text}`
    );
  }

  const data = (await res.json()) as SinpeSubscription;
  console.log(`[SINPE_SUB] Subscription data:`, data);
  return data;
}
