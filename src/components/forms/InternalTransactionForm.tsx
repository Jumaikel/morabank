"use client";

import { useEffect, useState } from "react";
import useAuthStore from "@/stores/authStore";
import useUserStore from "@/stores/userStore";
import useAccountStore from "@/stores/accountStore";
import {
  NewTransaction,
  transactionService,
} from "@/services/transactionService";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { InternalTransactionFormSkeleton } from "./InternalTransactionFormSkeleton";

export const InternalTransactionForm = () => {
  const identification = useAuthStore((state) => state.identification);
  const token = useAuthStore((state) => state.token);

  const fetchUser = useUserStore((state) => state.fetchUser);
  const selectedUser = useUserStore((state) => state.selectedUser);
  const userLoading = useUserStore((state) => state.loading);

  const fetchAccount = useAccountStore((state) => state.fetchAccount);
  const selectedAccount = useAccountStore((state) => state.selectedAccount);
  const accountLoading = useAccountStore((state) => state.loading);

  const [destinationIban, setDestinationIban] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
    if (!destinationIban || !amount) {
      toast.error("Destino y monto son obligatorios.");
      return;
    }
    const montoNum = parseFloat(amount);
    if (isNaN(montoNum) || montoNum <= 0) {
      toast.error("El monto debe ser un número válido mayor a 0.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: NewTransaction = {
        originIban: selectedAccount.iban,
        destinationIban: destinationIban.trim(),
        amount: montoNum,
        currency: "CRC",
        reason: reason.trim() || undefined,
      };

      const response = await transactionService.create(payload);
      if (typeof response === "string") {
        toast.error(response || "Error al realizar la transacción.");
        return;
      }
      toast.success("Transacción realizada con éxito.");
      setDestinationIban("");
      setAmount("");
      setReason("");
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.message || "Error inesperado al realizar la transacción."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (userLoading || accountLoading) {
    return <InternalTransactionFormSkeleton />;
  }

  if (!selectedAccount) {
    return (
      <p className="text-center text-gray-500">No se encontró tu cuenta.</p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-screen max-w-3xl mx-auto bg-white p-6 rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold mb-4 text-center text-neutral-950">
        Transferencia Interna
      </h2>

      <p className="text-sm text-neutral-600 mb-4 text-center">
        Realiza transferencias a cuentas bancarias de este banco
      </p>

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
          label="Cuenta Destino (IBAN)"
          value={destinationIban}
          onChange={(e) => setDestinationIban(e.target.value)}
          placeholder="p.ej. CR00XXXX00000000000001"
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
          placeholder="p.ej. 100.00"
        />
      </div>

      <div className="mb-4">
        <Input
          label="Razón (opcional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="p.ej. Pago de servicios"
        />
      </div>

      <Button type="submit" isLoading={submitting} className="w-full">
        {submitting ? "Enviando..." : "Enviar Transferencia"}
      </Button>
    </form>
  );
};
