
/**
 * Servicio para consultar la suscripción SINPE de un número de teléfono
 * y obtener el código de banco asociado.
 */

interface SinpeSubscription {
  sinpe_number: string;
  sinpe_client_name: string;
  sinpe_bank_code: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_SINPE_SUBSCRIPTIONS_API || "/api/sinpe-subscriptions";

export async function getSinpeSubscription(phone: string): Promise<SinpeSubscription> {
  // Ajustar la URL según cómo exponga la API el endpoint.
  // Asumimos que existe:
  //   GET /api/sinpe-subscriptions/{phone}
  const url = `${BASE_URL}/${encodeURIComponent(phone)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.status === 404) {
    throw new Error(`No existe suscripción SINPE para el número: ${phone}`);
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status} al consultar suscripciones SINPE: ${text}`);
  }

  const data = await res.json();
  // Se espera que la respuesta tenga la forma:
  // { sinpe_number: string, sinpe_client_name: string, sinpe_bank_code: string }
  return data as SinpeSubscription;
}

export async function getBankCodeByPhone(phone: string): Promise<string> {
  const sub = await getSinpeSubscription(phone);
  return sub.sinpe_bank_code;
}
