"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import useAuthStore from "@/stores/authStore";
import useUserStore from "@/stores/userStore";
import useAccountStore from "@/stores/accountStore";
import { sendExternalTransfer, ExternalTransferRequest } from "@/services/externalTransactionService";

export const ExternalIbanTransactionForm = () => {
  const { identification, token } = useAuthStore((state) => ({
    identification: state.identification,
    token: state.token,
  }));
  const fetchUser = useUserStore((state) => state.fetchUser);
  const selectedUser = useUserStore((state) => state.selectedUser);
  const userLoading = useUserStore((state) => state.loading);

  const fetchAccount = useAccountStore((state) => state.fetchAccount);
  const selectedAccount = useAccountStore((state) => state.selectedAccount);
  const accountLoading = useAccountStore((state) => state.loading);

  const [destIban, setDestIban] = useState("");
  const [destBankCode, setDestBankCode] = useState("");
  const [destName, setDestName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("CRC");
  const [description, setDescription] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (identification && token && !selectedUser) {
      fetchUser(identification);
    }
  }, [identification, token, fetchUser, selectedUser]);

  useEffect(() => {
    if (selectedUser && !selectedAccount) {
      fetchAccount(selectedUser.accountIban);
    }
  }, [selectedUser, fetchAccount, selectedAccount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedAccount || !selectedUser) {
      setError("Tu cuenta no está cargada aún.");
      return;
    }
    if (!destIban || !destBankCode || !amount) {
      setError("IBAN destino, código de banco y monto son obligatorios.");
      return;
    }
    const montoNum = parseFloat(amount);
    if (isNaN(montoNum) || montoNum <= 0) {
      setError("El monto debe ser un número válido mayor que 0.");
      return;
    }
    if (!/^[A-Z]{3}$/.test(currency)) {
      setError("El currency debe ser un código de 3 letras.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: ExternalTransferRequest = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        transaction_id: uuidv4(),
        sender: {
          account_number: selectedAccount.iban,
          bank_code: selectedAccount.bankCode,
          name: `${selectedUser.name} ${selectedUser.lastName}`,
        },
        receiver: {
          account_number: destIban.trim(),
          bank_code: destBankCode.trim().toUpperCase(),
          name: destName.trim() || "",
        },
        amount: {
          value: montoNum,
          currency: currency.trim().toUpperCase(),
        },
        description: description.trim() || "",
        hmac_md5: "",
      };
      await sendExternalTransfer(payload);
      setSuccess("Transferencia externa enviada con éxito.");
      setDestIban("");
      setDestBankCode("");
      setDestName("");
      setAmount("");
      setCurrency("CRC");
      setDescription("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al realizar la transferencia externa.");
    } finally {
      setSubmitting(false);
    }
  };

  if (userLoading || accountLoading) {
    return <p className="text-center">Cargando datos de usuario/ cuenta...</p>;
  }
  if (!selectedAccount || !selectedUser) {
    return <p className="text-center text-red-500">No se encontró tu cuenta.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">Transferencia Externa (IBAN)</h2>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {success && <p className="text-green-600 text-sm mb-2">{success}</p>}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Cuenta Origen (IBAN)</label>
        <input
          type="text"
          value={selectedAccount.iban}
          disabled
          className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-700"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Banco Origen</label>
        <input
          type="text"
          value={selectedAccount.bankCode}
          disabled
          className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-700"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">IBAN Destino</label>
        <input
          type="text"
          value={destIban}
          onChange={(e) => setDestIban(e.target.value)}
          placeholder="p.ej. CR00BBBB00000000000001"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Banco Destino</label>
        <input
          type="text"
          value={destBankCode}
          onChange={(e) => setDestBankCode(e.target.value)}
          placeholder="p.ej. BBVA"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Nombre Destinatario</label>
        <input
          type="text"
          value={destName}
          onChange={(e) => setDestName(e.target.value)}
          placeholder="p.ej. Ana Gómez"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Monto</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="p.ej. 100.00"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Currency</label>
        <input
          type="text"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Descripción (opcional)</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="p.ej. Pago de factura"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
      >
        {submitting ? "Enviando..." : "Enviar Transferencia Externa"}
      </button>
    </form>
  );
};
