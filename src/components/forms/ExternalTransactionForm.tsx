"use client";

import { useEffect, useState } from "react";
import useAuthStore from "@/stores/authStore";
import useUserStore from "@/stores/userStore";
import useAccountStore from "@/stores/accountStore";
import { sendIbanTransfer } from "@/services/externalTransferService";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { ExternalTransactionFormSkeleton } from "./ExternalTransactionFormSkeleton";
import { BANK_ENDPOINTS as BANK_NAMES } from "@/config/bankNames";

export const ExternalTransactionForm = () => {
  const identification = useAuthStore((state) => state.identification);
  const token = useAuthStore((state) => state.token);

  const fetchUser = useUserStore((state) => state.fetchUser);
  const selectedUser = useUserStore((state) => state.selectedUser);
  const userLoading = useUserStore((state) => state.loading);

  const fetchAccount = useAccountStore((state) => state.fetchAccount);
  const selectedAccount = useAccountStore((state) => state.selectedAccount);
  const accountLoading = useAccountStore((state) => state.loading);

  const [destIban, setDestIban] = useState("");
  const [destName, setDestName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("CRC");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (identification && token && !selectedUser) {
      fetchUser(identification);
    }
  }, [identification, token, selectedUser, fetchUser]);

  useEffect(() => {
    if (selectedUser && selectedUser.accountIban && !selectedAccount) {
      fetchAccount(selectedUser.accountIban);
    }
  }, [selectedUser, selectedAccount, fetchAccount]);

  const extractBankCodeFromIban = (iban: string) => iban.slice(5, 8);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAccount || !selectedUser) {
      toast.error("Tu cuenta no está cargada aún.");
      return;
    }
    if (!destIban) {
      toast.error("IBAN destino es obligatorio.");
      return;
    }
    const receiverIban = destIban.trim();
    if (!/^[A-Z]{2}\d{2}0\d{3}\d{4}\d{12}$/.test(receiverIban)) {
      toast.error("El IBAN destino no tiene formato válido.");
      return;
    }
    const montoNum = parseFloat(amount);
    if (isNaN(montoNum) || montoNum <= 0) {
      toast.error("El monto debe ser un número válido mayor que 0.");
      return;
    }
    if (!/^[A-Z]{3}$/.test(currency)) {
      toast.error("El currency debe ser un código de 3 letras.");
      return;
    }

    const senderCode = extractBankCodeFromIban(selectedAccount.iban);
    const receiverCode = extractBankCodeFromIban(receiverIban);
    if (senderCode === receiverCode) {
      toast.error(
        "El IBAN destino pertenece al mismo banco. Por favor usa la Transferencia Interna."
      );
      return;
    }

    setShowModal(true);
  };

  const confirmTransaction = async () => {
    setSubmitting(true);
    try {
      const senderIban = selectedAccount!.iban;
      const senderCode = extractBankCodeFromIban(senderIban);
      const receiverIban = destIban.trim();
      const receiverCode = extractBankCodeFromIban(receiverIban);

      await sendIbanTransfer(
        senderIban,
        senderCode,
        `${selectedUser!.name} ${selectedUser!.lastName} ${selectedUser!.secondLastName || ""}`,
        receiverIban,
        receiverCode,
        destName.trim() || "",
        parseFloat(amount),
        currency.trim().toUpperCase(),
        description.trim() || ""
      );

      toast.success("Transferencia externa enviada con éxito.");
      setDestIban("");
      setDestName("");
      setAmount("");
      setCurrency("CRC");
      setDescription("");
      setShowModal(false);
    } catch (err: any) {
      console.error("Error al realizar la transferencia externa:", err);
      toast.error("Error al realizar la transferencia externa.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!selectedAccount || !selectedUser) return <p className="text-center text-red-500">No se encontró tu cuenta.</p>;
  if (userLoading || accountLoading) return <ExternalTransactionFormSkeleton />;

  const originCode = extractBankCodeFromIban(selectedAccount.iban);
  const originName = BANK_NAMES[originCode];
  const destCode = destIban ? extractBankCodeFromIban(destIban.trim()) : "";
  const destBankName = BANK_NAMES[destCode];

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-screen max-w-3xl mx-auto bg-white p-6 rounded-lg shadow"
      >
        <h2 className="text-xl text-neutral-950 font-semibold mb-4 text-center">
          Transferencia Externa (IBAN)
        </h2>
        <p className="text-sm text-neutral-600 mb-4 text-center">
          Realiza transferencias a cuentas bancarias de otros bancos
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
            label="Banco Origen"
            value={originCode}
            disabled
            className="bg-gray-100"
          />
          {originName ? (
            <p className="text-sm text-green-600 mb-4">{originName}</p>
          ) : (
            <p className="text-sm text-red-500 mb-4">Banco no encontrado</p>
          )}
        </div>

        <div className="mb-4">
          <Input
            label="IBAN Destino"
            value={destIban}
            onChange={(e) => setDestIban(e.target.value)}
            placeholder="p.ej. CR2101110001000000000001"
            required
          />
        </div>
        <div className="mb-4">
          <Input
            label="Banco Destino"
            value={destCode}
            disabled
            className="bg-gray-100"
            placeholder="Se extrae automáticamente del IBAN"
          />
          {destBankName ? (
            <p className="text-sm text-green-600 mb-4">{destBankName}</p>
          ) : (
            <p className="text-sm text-red-500 mb-4">Banco no encontrado</p>
          )}
        </div>

        <div className="mb-4">
          <Input
            label="Nombre Completo del Destinatario"
            value={destName}
            onChange={(e) => setDestName(e.target.value)}
            placeholder="p.ej. Ana Gómez"
          />
        </div>
        <div className="mb-4">
          <Input
            label="Monto"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="p.ej. 100.00"
            required
          />
        </div>
        <div className="mb-4">
          <Input
            label="Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <Input
            label="Descripción (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="p.ej. Pago de factura"
          />
        </div>

        <Button type="submit" isLoading={submitting} className="w-full">
          {submitting ? "Enviando..." : "Enviar Transferencia Externa"}
        </Button>
      </form>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-center mb-4">
              Confirma la transferencia
            </h3>
            <div className="border-b border-neutral-500 mb-4" />
            <ul className="mb-4 space-y-2">
              <li><strong>Origen (IBAN):</strong> {selectedAccount.iban}</li>
              <li><strong>Banco Origen:</strong> {originCode} - {originName || 'Desconocido'}</li>
              <li><strong>Destino (IBAN):</strong> {destIban}</li>
              <li><strong>Banco Destino:</strong> {destCode} - {destBankName || 'Desconocido'}</li>
              {destName && <li><strong>Destinatario:</strong> {destName}</li>}
              <li><strong>Monto:</strong> {amount} {currency}</li>
              {description && <li><strong>Descripción:</strong> {description}</li>}
            </ul>
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button onClick={confirmTransaction} isLoading={submitting}>
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
