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
import { BANK_ENDPOINTS as BANK_NAMES } from "@/config/bankNames";

export const SinpeTransactionForm = () => {
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
  const [showModal, setShowModal] = useState(false);

  const [destSubscription, setDestSubscription] = useState<{
    sinpe_number: string;
    sinpe_client_name: string;
    sinpe_bank_code: string;
  } | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [validatingPhone, setValidatingPhone] = useState(false);

  useEffect(() => {
    if (identification && token && !selectedUser) fetchUser(identification);
  }, [identification, token, fetchUser, selectedUser]);

  useEffect(() => {
    if (selectedUser?.accountIban && !selectedAccount)
      fetchAccount(selectedUser.accountIban);
  }, [selectedUser, selectedAccount, fetchAccount]);

  const extractBankCodeFromIban = (iban: string) => iban.slice(5, 8);

  // Validación de suscripción SINPE Móvil
  useEffect(() => {
    const phone = destPhone.trim();
    if (!phone) {
      setDestSubscription(null);
      setPhoneError(null);
      return;
    }
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
      .finally(() => setValidatingPhone(false));
  }, [destPhone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedAccount) {
      toast.error("Tu cuenta no está cargada aún.");
      return;
    }
    if (!destPhone || !amount) {
      toast.error("Número destino y monto son obligatorios.");
      return;
    }
    if (destPhone === selectedUser.phone) {
      toast.error("No puedes enviarte dinero a ti mismo.");
      return;
    }
    if (!destSubscription) {
      toast.error("El número destino no está suscrito a SINPE Móvil.");
      return;
    }
    const montoNum = parseFloat(amount);
    if (isNaN(montoNum) || montoNum <= 0) {
      toast.error("El monto debe ser un número válido mayor a 0.");
      return;
    }

    setShowModal(true);
  };

  const confirmTransfer = async () => {
    setSubmitting(true);
    try {
      const senderPhone = selectedUser!.phone;
      const senderBankCode = extractBankCodeFromIban(
        selectedAccount!.iban
      );
      const senderName = `${selectedUser!.name} ${selectedUser!.lastName}`;
      const receiverPhone = destPhone.trim();
      const receiverBankCode = destSubscription!.sinpe_bank_code;
      const receiverName = destSubscription!.sinpe_client_name;
      const montoNum = parseFloat(amount);

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
      setShowModal(false);
    } catch (err: any) {
      console.error(err);
      toast.error("Error inesperado al realizar la transferencia SINPE.");
    } finally {
      setSubmitting(false);
    }
  };

  if (userLoading || accountLoading) return <SinpeTransactionFormSkeleton />;
  if (!selectedUser || !selectedAccount)
    return <p className="text-center text-red-500">No se encontró tu cuenta.</p>;

  const bankCode = destSubscription?.sinpe_bank_code || "";
  const bankName = bankCode ? BANK_NAMES[bankCode] : undefined;

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-screen max-w-3xl mx-auto bg-white p-6 rounded-lg shadow"
      >
        <h2 className="text-xl font-semibold mb-4 text-center text-neutral-950">
          Transferencia SINPE Móvil
        </h2>
        <p className="text-sm text-neutral-600 mb-4 text-center">
          Realiza transferencias por número de celular
        </p>

        <Input
          label="Cuenta Origen (IBAN)"
          value={selectedAccount.iban}
          disabled
          className="bg-gray-100 mb-4"
        />
        <Input
          label="Celular Origen (SINPE)"
          value={selectedUser.phone}
          disabled
          className="bg-gray-100 mb-4"
        />

        <Input
          required
          label="Celular Destino"
          value={destPhone}
          onChange={(e) => setDestPhone(e.target.value)}
          placeholder="71234567"
          className="mb-1"
        />
        {validatingPhone && (
          <p className="text-sm text-gray-500">Validando número...</p>
        )}
        {phoneError && <p className="text-sm text-red-500">{phoneError}</p>}
        {destSubscription && (
          <p className={`text-sm mb-4 ${bankName ? "text-green-600" : "text-red-500"}`}>
            Suscrito: {destSubscription.sinpe_client_name} ({bankCode}{bankName ? ` - ${bankName}` : ""})
          </p>
        )}

        <Input
          required
          label="Monto (CRC)"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="50.00"
          className="mb-4"
        />
        <Input
          label="Razón (opcional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Pago entre amigos"
          className="mb-6"
        />

        <Button
          type="submit"
          isLoading={submitting}
          disabled={!destSubscription || Boolean(phoneError)}
          className="w-full"
        >
          {submitting ? "Enviando..." : "Enviar SINPE Móvil"}
        </Button>
      </form>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-center mb-4">
              Confirma la transferencia SINPE
            </h3>
            <div className="border-b border-neutral-500 mb-4" />
            <ul className="mb-4 space-y-2">
              <li>
                <strong>Cuenta (IBAN):</strong> {selectedAccount.iban}
              </li>
              <li>
                <strong>Celular Origen:</strong> {selectedUser.phone}
              </li>
              <li>
                <strong>Celular Destino:</strong> {destPhone}
              </li>
              <li>
                <strong>Destinatario:</strong> {destSubscription?.sinpe_client_name}
              </li>
              <li>
                <strong>Banco:</strong> {bankCode}{bankName ? ` - ${bankName}` : " (Desconocido)"}
              </li>
              <li>
                <strong>Monto:</strong> {amount} CRC
              </li>
              {reason && (
                <li>
                  <strong>Razón:</strong> {reason}
                </li>
              )}
            </ul>
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button onClick={confirmTransfer} isLoading={submitting}>
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};