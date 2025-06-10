"use client";

import { useState } from "react";
import { toast } from "sonner";
import { pullExternalFunds } from "@/services/pullExternalFundsService";
import useUserStore from "@/stores/userStore";

export const PullExternalFundsForm = () => {
  const selectedUser = useUserStore((s) => s.selectedUser);
  const [cuentaRemota, setCuentaRemota] = useState("");
  const [monto, setMonto] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cuentaRemota || !monto) {
      toast.warning("Todos los campos son obligatorios.");
      return;
    }

    const montoNumber = Number(monto);
    if (isNaN(montoNumber) || montoNumber <= 0) {
      toast.error("El monto debe ser un número positivo.");
      return;
    }

    const cedula = selectedUser?.identification;
    const destinationIban = selectedUser?.accountIban;

    if (!cedula || !destinationIban) {
      toast.error("No se encontró la información del usuario.");
      return;
    }

    setLoading(true);
    const res = await pullExternalFunds({
      account_number_remote: cuentaRemota,
      monto: montoNumber,
      cedula,
      destinationIban,
    });

    setLoading(false);

    if (res.success) {
      toast.success(res.mensaje || "Fondos recibidos con éxito");
      setCuentaRemota("");
      setMonto("");
    } else {
      toast.error(res.error || "Error al solicitar fondos");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-xl border border-neutral-300 max-w-lg mx-auto space-y-4"
    >
      <h2 className="text-xl font-bold text-neutral-900">
        Solicitar Fondos desde otro Banco
      </h2>

      <div>
        <label className="block text-sm font-medium text-neutral-700">
          Número de cuenta remota
        </label>
        <input
          type="text"
          value={cuentaRemota}
          onChange={(e) => setCuentaRemota(e.target.value)}
          className="mt-1 block w-full px-4 py-2 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="CR22XXXX..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700">
          Monto a solicitar
        </label>
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          className="mt-1 block w-full px-4 py-2 border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="₡"
          min={0}
          step={0.01}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {loading ? "Solicitando..." : "Solicitar Fondos"}
      </button>
    </form>
  );
};
