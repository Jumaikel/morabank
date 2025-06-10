export interface PullFundsRequest {
  account_number_remote: string;
  monto: number;
  cedula: string;
  destinationIban: string;
}

export interface PullFundsResponse {
  success?: boolean;
  mensaje?: string;
  error?: string;
}

export async function pullExternalFunds(
  payload: PullFundsRequest
): Promise<PullFundsResponse> {
  try {
    const res = await fetch("/api/pull-external", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      return { error: data.error || "Error desconocido" };
    }

    return {
      success: true,
      mensaje: data.mensaje,
    };
  } catch (err: any) {
    return { error: err.message || "Fallo de red o error inesperado" };
  }
}
