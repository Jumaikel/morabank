"use client";

import { useEffect, useState } from "react";
import useAuthStore from "@/stores/authStore";
import useAccountStore from "@/stores/accountStore";
import { NewSinpeTransfer, sinpeService } from "@/services/sinpeService";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { SinpeTransactionFormSkeleton } from "./SinpeTransactionFormSkeleton";
import useUserStore from "@/stores/userStore";

export const SinpeTransactionForm = () => {
  const identification = useAuthStore((state) => state.identification);
  const token = useAuthStore((state) => state.token);
  const fetchUser = useUserStore((state) => state.fetchUser);
  const selectedUser = useUserStore((state) => state.selectedUser);

  const fetchAccount = useAccountStore((state) => state.fetchAccount);
  const selectedAccount = useAccountStore((state) => state.selectedAccount);

  const [destPhone, setDestPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoadingPage(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (identification && token && !selectedUser) {
      fetchUser(identification);
    }
  }, [identification, token, fetchUser, selectedUser]);

  useEffect(() => {
    if (selectedUser && selectedUser.accountIban && !selectedAccount) {
      fetchAccount(selectedUser.accountIban);
    }
  }, [selectedUser, fetchAccount, selectedAccount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAccount) {
      toast.error("Tu cuenta no está cargada aún.");
      return;
    }
    if (!destPhone || !amount) {
      toast.error("Número de celular destino y monto son obligatorios.");
      return;
    }
    const montoNum = parseFloat(amount);
    if (isNaN(montoNum) || montoNum <= 0) {
      toast.error("El monto debe ser un número válido mayor a 0.");
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
        toast.error(response || "Error al realizar la transferencia SINPE.");
        return;
      }
      toast.success("Transferencia SINPE realizada con éxito.");
      setDestPhone("");
      setAmount("");
      setReason("");
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.message || "Error inesperado al realizar la transferencia SINPE."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingPage) {
    return <SinpeTransactionFormSkeleton />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-96 mx-auto bg-white p-6 rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold mb-4 text-center text-neutral-950">
        Transferencia SINPE Móvil
      </h2>

      <div className="mb-4">
        <Input
          label="Cuenta Origen (IBAN)"
          value={selectedAccount?.iban ?? ""}
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

      <Button type="submit" isLoading={submitting} className="w-full">
        {submitting ? "Enviando..." : "Enviar SINPE Móvil"}
      </Button>
    </form>
  );
};
