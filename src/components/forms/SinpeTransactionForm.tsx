"use client";

import { useEffect, useState } from "react";
import useAuthStore from "@/stores/authStore";
import useAccountStore from "@/stores/accountStore";
import { NewSinpeTransfer, sinpeService } from "@/services/sinpeService";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export const SinpeTransactionForm = () => {
  const identification = useAuthStore((state) => state.identification);
  const token = useAuthStore((state) => state.token);

  const fetchAccount = useAccountStore((state) => state.fetchAccount);
  const selectedAccount = useAccountStore((state) => state.selectedAccount);
  const accountLoading = useAccountStore((state) => state.loading);
  const accountError = useAccountStore((state) => state.error);

  const [destPhone, setDestPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // No necesitas fetch extra si el store ya tiene la cuenta cargada.
    // Si necesitas cargarla, llama fetchAccount() aquí.
  }, [identification, token, fetchAccount, selectedAccount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedAccount) {
      setError("Tu cuenta no está cargada aún.");
      return;
    }
    if (!destPhone || !amount) {
      setError("Número de celular destino y monto son obligatorios.");
      return;
    }
    const montoNum = parseFloat(amount);
    if (isNaN(montoNum) || montoNum <= 0) {
      setError("El monto debe ser un número válido mayor a 0.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: NewSinpeTransfer = {
        originIban: selectedAccount.iban,
        destinationPhone: destPhone.trim(),
        amount: montoNum,
        currency: "CRC",
        reason: reason.trim() || undefined,
      };

      const response = await sinpeService.create(payload);
      if (typeof response === "string") {
        setError(response);
      } else {
        setSuccess("Transferencia SINPE realizada con éxito.");
        setDestPhone("");
        setAmount("");
        setReason("");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al realizar la transferencia SINPE.");
    } finally {
      setSubmitting(false);
    }
  };

  if (accountLoading) {
    return <p className="text-center">Cargando datos de la cuenta...</p>;
  }
  if (accountError) {
    return <p className="text-center text-red-500">Error: {accountError}</p>;
  }
  if (!selectedAccount) {
    return <p className="text-center text-gray-500">No se encontró tu cuenta.</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold mb-4 text-center text-neutral-950">
        Transferencia SINPE Móvil
      </h2>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

      <div className="mb-4">
        <Input
          label="Cuenta Origen (IBAN)"
          value={selectedAccount.iban}
          disabled
          className="bg-gray-100"
        />
      </div>

      <div className="mb-4">
        <Input
          required
          label="Celular Destino (SINPE)"
          value={destPhone}
          onChange={(e) => setDestPhone(e.target.value)}
          placeholder="p.ej. 71234567"
        />
      </div>

      <div className="mb-4">
        <Input
          required
          label="Monto (CRC)"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="p.ej. 50.00"
        />
      </div>

      <div className="mb-4">
        <Input
          label="Razón (opcional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="p.ej. Pago entre amigos"
        />
      </div>

      <Button
        type="submit"
        isLoading={submitting}
        className="w-full"
      >
        {submitting ? "Enviando..." : "Enviar SINPE Móvil"}
      </Button>
    </form>
  );
};
