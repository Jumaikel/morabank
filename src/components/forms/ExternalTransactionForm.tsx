"use client";

import { useState, useEffect } from "react";
import useAuthStore from "@/stores/authStore";
import useUserStore from "@/stores/userStore";
import useAccountStore from "@/stores/accountStore";
import { sendIbanTransfer } from "@/services/externalTransferService";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { ExternalTransactionFormSkeleton } from "./ExternalTransactionFormSkeleton";

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

  const extractBankCodeFromIban = (iban: string) => {
    // Formato: "CR" + 2 dígitos de control + "0" + 3 dígitos de código de banco + ...
    return iban.slice(5, 8);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAccount || !selectedUser) {
      toast.error("Tu cuenta no está cargada aún.");
      return;
    }
    if (!destIban) {
      toast.error("IBAN destino es obligatorio.");
      return;
    }
    if (!/^[A-Z]{2}\d{2}0\d{3}\d{4}\d{12}$/.test(destIban.trim())) {
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

    const senderIban = selectedAccount.iban;
    const senderBankCode = extractBankCodeFromIban(senderIban);
    const receiverIban = destIban.trim();
    const receiverBankCode = extractBankCodeFromIban(receiverIban);

    setSubmitting(true);
    try {
      await sendIbanTransfer(
        senderIban,
        senderBankCode,
        `${selectedUser.name} ${selectedUser.lastName}`,
        receiverIban,
        receiverBankCode,
        destName.trim() || "",
        montoNum,
        currency.trim().toUpperCase(),
        description.trim() || ""
      );

      toast.success("Transferencia externa enviada con éxito.");
      setDestIban("");
      setDestName("");
      setAmount("");
      setCurrency("CRC");
      setDescription("");
    } catch (err: any) {
      console.error(err);
      console.error("Error al realizar la transferencia externa:", err.message);
      toast.error("Error al realizar la transferencia externa.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!selectedAccount || !selectedUser) {
    return (
      <p className="text-center text-red-500">No se encontró tu cuenta.</p>
    );
  }

  if (userLoading || accountLoading) {
    return <ExternalTransactionFormSkeleton />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-screen max-w-3xl mx-auto bg-white p-6 rounded-lg shadow "
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
          value={extractBankCodeFromIban(selectedAccount.iban)}
          disabled
          className="bg-gray-100"
        />
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
          value={destIban ? extractBankCodeFromIban(destIban.trim()) : ""}
          disabled
          className="bg-gray-100"
          placeholder="Se extrae automáticamente del IBAN"
        />
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
  );
};
