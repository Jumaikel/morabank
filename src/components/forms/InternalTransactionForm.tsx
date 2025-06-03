"use client";

import { useEffect, useState } from "react";
import useAuthStore from "@/stores/authStore";
import useUserStore from "@/stores/userStore";
import useAccountStore from "@/stores/accountStore";
import { createTransaction, NewTransaction } from "@/services/transactionService";

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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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
    setError(null);
    setSuccess(null);

    if (!selectedAccount) {
      setError("Tu cuenta no está cargada aún.");
      return;
    }
    if (!destinationIban || !amount) {
      setError("Destino y monto son obligatorios.");
      return;
    }
    const montoNum = parseFloat(amount);
    if (isNaN(montoNum) || montoNum <= 0) {
      setError("El monto debe ser un número válido mayor a 0.");
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
        hmacMd5: "",
      };
      await createTransaction(payload);
      setSuccess("Transacción realizada con éxito.");
      setDestinationIban("");
      setAmount("");
      setReason("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al realizar la transacción.");
    } finally {
      setSubmitting(false);
    }
  };

  if (userLoading || accountLoading) {
    return <p className="text-center">Cargando datos de la cuenta...</p>;
  }
  if (!selectedAccount) {
    return (
      <p className="text-center text-gray-500">No se encontró tu cuenta.</p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">
        Transferencia Interna
      </h2>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Cuenta Origen (IBAN)
        </label>
        <input
          type="text"
          value={selectedAccount.iban}
          disabled
          className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-700"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Cuenta Destino (IBAN)
        </label>
        <input
          type="text"
          value={destinationIban}
          onChange={(e) => setDestinationIban(e.target.value)}
          placeholder="p.ej. CR00XXXX00000000000001"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Monto (CRC)
        </label>
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
        <label className="block text-sm font-medium text-gray-700">
          Razón (opcional)
        </label>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="p.ej. Pago de servicios"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
      >
        {submitting ? "Enviando..." : "Enviar Transferencia"}
      </button>
    </form>
  );
};
