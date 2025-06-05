"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { transactionService } from "@/services/transactionService";
import { Transaction } from "@/models/entities";

interface AccountHistoryModalProps {
  iban: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AccountHistoryModal: React.FC<AccountHistoryModalProps> = ({
  iban,
  isOpen,
  onClose,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let isCancelled = false;
    async function fetchTxs() {
      setLoading(true);
      setError(null);
      try {
        const all = await transactionService.getAll();
        if (!isCancelled && Array.isArray(all)) {
          setTransactions(all);
        }
      } catch (err: any) {
        if (!isCancelled) {
          setError(err.message || "Error al cargar transacciones");
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }
    fetchTxs();
    return () => { isCancelled = true; };
  }, [isOpen]);

  const filtered = transactions.filter(
    (tx) => tx.originIban === iban || tx.destinationIban === iban
  );

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative w-11/12 max-w-2xl bg-white border border-neutral-950 rounded-xl shadow-xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-neutral-950 bg-neutral-100">
          <h2 className="text-xl font-semibold text-neutral-950">Historial de Transacciones</h2>
          <button
            onClick={onClose}
            className="text-neutral-600 hover:text-neutral-950 focus:outline-none cursor-pointer"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {loading && <p className="text-center text-neutral-950">Cargando...</p>}
          {error && <p className="text-center text-red-600">Error: {error}</p>}

          {!loading && !error && filtered.length === 0 && (
            <p className="text-center text-neutral-500">
              No hay transacciones para esta cuenta.
            </p>
          )}

          {!loading && !error && filtered.length > 0 && (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-neutral-200">
                  <th className="px-3 py-2 text-left text-sm font-medium text-neutral-950 border-b border-neutral-950">Fecha</th>
                  <th className="px-3 py-2 text-left text-sm font-medium text-neutral-950 border-b border-neutral-950">Tipo</th>
                  <th className="px-3 py-2 text-left text-sm font-medium text-neutral-950 border-b border-neutral-950">Contraparte</th>
                  <th className="px-3 py-2 text-right text-sm font-medium text-neutral-950 border-b border-neutral-950">Monto</th>
                  <th className="px-3 py-2 text-left text-sm font-medium text-neutral-950 border-b border-neutral-950">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx) => {
                  const isSent = tx.originIban === iban;
                  const otherParty = isSent ? tx.destinationIban : tx.originIban;
                  const typeLabel = isSent ? "Enviado" : "Recibido";
                  return (
                    <tr
                      key={tx.transactionId}
                      className="border-b border-neutral-200 hover:bg-neutral-200 transition-colors"
                    >
                      <td className="px-3 py-2 text-sm text-neutral-950">
                        {new Date(tx.createdAt).toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-sm text-neutral-950">{typeLabel}</td>
                      <td className="px-3 py-2 text-sm text-neutral-700">{otherParty}</td>
                      <td
                        className={`px-3 py-2 text-sm text-right font-bold ${
                          isSent ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {isSent ? "-" : "+"}
                        {Number(tx.amount).toFixed(2)} {tx.currency}
                      </td>
                      <td className="px-3 py-2 text-sm text-neutral-950">{tx.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
