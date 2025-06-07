"use client";

import { useEffect, useState } from "react";
import useAuthStore from "@/stores/authStore";
import useUserStore from "@/stores/userStore";
import useAccountStore from "@/stores/accountStore";
import { sendPhoneTransfer } from "@/services/externalTransferService";
import { getSinpeSubscription } from "@/services/sinpeSubscriptionService";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { SinpeTransactionFormSkeleton } from "./SinpeTransactionFormSkeleton";

export const SinpeTransactionForm = () => {
  // Seleccionamos cada propiedad individualmente
  const identification = useAuthStore((state) => state.identification);
  const token = useAuthStore((state) => state.token);

  const fetchUser = useUserStore((state) => state.fetchUser);
  const selectedUser = useUserStore((state) => state.selectedUser);
  const userLoading = useUserStore((state) => state.loading);

  const fetchAccount = useAccountStore((state) => state.fetchAccount);
  const selectedAccount = useAccountStore((state) => state.selectedAccount);
  const accountLoading = useAccountStore((state) => state.loading);

  const [destPhone, setDestPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);

  const [destSubscription, setDestSubscription] = useState<{
    sinpe_number: string;
    sinpe_client_name: string;
    sinpe_bank_code: string;
  } | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [validatingPhone, setValidatingPhone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoadingPage(false), 500);
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
  }, [selectedUser, selectedAccount, fetchAccount]);

  // Extrae código de banco del IBAN (posiciones 5 a 8)
  const extractBankCodeFromIban = (iban: string) => {
    return iban.slice(5, 8);
  };

  // Validar suscripción SINPE cada vez que cambia destPhone
  useEffect(() => {
    const phone = destPhone.trim();
    if (!phone) {
      setDestSubscription(null);
      setPhoneError(null);
      return;
    }

    // Validación básica de 8 dígitos costarricense
    if (!/^[0-9]\d{7}$/.test(phone)) {
      setDestSubscription(null);
      setPhoneError("Formato de teléfono inválido.");
      return;
    }

    setValidatingPhone(true);
    setPhoneError(null);
    getSinpeSubscription(phone)
      .then((sub) => {
        setDestSubscription(sub);
        setPhoneError(null);
      })
      .catch(() => {
        setDestSubscription(null);
        setPhoneError("Número no suscrito a SINPE Móvil.");
      })
      .finally(() => {
        setValidatingPhone(false);
      });
  }, [destPhone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser || !selectedAccount) {
      toast.error("Tu cuenta no está cargada aún.");
      return;
    }
    if (!destPhone || !amount) {
      toast.error("Número de celular destino y monto son obligatorios.");
      return;
    }
    if (!destSubscription) {
      toast.error("El número de destino no está suscrito a SINPE Móvil.");
      return;
    }

    const montoNum = parseFloat(amount);
    if (isNaN(montoNum) || montoNum <= 0) {
      toast.error("El monto debe ser un número válido mayor a 0.");
      return;
    }

    const senderPhone = selectedUser.phone;
    const senderBankCode = extractBankCodeFromIban(selectedAccount.iban);
    const senderName = `${selectedUser.name} ${selectedUser.lastName}`;
    const receiverPhone = destPhone.trim();
    const receiverBankCode = destSubscription.sinpe_bank_code;
    const receiverName = destSubscription.sinpe_client_name;

    setSubmitting(true);
    try {
      await sendPhoneTransfer(
        senderPhone,
        senderBankCode,
        senderName,
        receiverPhone,
        receiverBankCode,
        receiverName,
        montoNum,
        "CRC",
        reason.trim() || ""
      );

      toast.success("Transferencia SINPE realizada con éxito.");
      setDestPhone("");
      setAmount("");
      setReason("");
      setDestSubscription(null);
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.message || "Error inesperado al realizar la transferencia SINPE."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingPage || userLoading || accountLoading) {
    return <SinpeTransactionFormSkeleton />;
  }
  if (!selectedUser || !selectedAccount) {
    return (
      <p className="text-center text-red-500">No se encontró tu cuenta.</p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-screen max-w-3xl mx-auto bg-white p-6 rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold mb-4 text-center text-neutral-950">
        Transferencia SINPE Móvil
      </h2>

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
          label="Celular Origen (SINPE)"
          value={selectedUser.phone}
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
        {validatingPhone && (
          <p className="text-sm text-gray-500 mt-1">Validando número...</p>
        )}
        {phoneError && (
          <p className="text-sm text-red-500 mt-1">{phoneError}</p>
        )}
        {destSubscription && (
          <p className="text-sm text-green-600 mt-1">
            Suscrito: {destSubscription.sinpe_client_name} (Banco {destSubscription.sinpe_bank_code})
          </p>
        )}
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
        disabled={!destSubscription || Boolean(phoneError)}
        className="w-full"
      >
        {submitting ? "Enviando..." : "Enviar SINPE Móvil"}
      </Button>
    </form>
  );
};
