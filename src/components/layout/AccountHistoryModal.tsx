"use client";

import React from "react";
import { createPortal } from "react-dom";
import { Transaction } from "@/models/entities";

interface AccountHistoryModalProps {
  iban: string;
  isOpen: boolean;
  onClose: () => void;
  accountTransactions: Transaction[];
  loading: boolean;
  error: string | null;
}

function mapTx(tx: any) {
  return {
    transactionId: tx.transaction_id,
    createdAt: tx.created_at,
    originIban: tx.origin_iban,
    destinationIban: tx.destination_iban,
    amount: tx.amount,
    currency: tx.currency,
    status: tx.status,
    reason: tx.reason,
    hmacMd5: tx.hmac_md5,
    updatedAt: tx.updated_at,
  };
}


export const AccountHistoryModal: React.FC<AccountHistoryModalProps> = ({
  iban,
  isOpen,
  onClose,
  accountTransactions,
  loading,
  error,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 w-screen flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative w-11/12 max-w-5xl bg-white border border-neutral-950 rounded-xl shadow-xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-neutral-950 bg-neutral-100">
          <h2 className="text-xl font-semibold text-neutral-950">
            Historial de Transacciones
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-600 hover:text-neutral-950 focus:outline-none cursor-pointer"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {loading && (
            <p className="text-center text-neutral-950">Cargando...</p>
          )}
          {error && <p className="text-center text-red-600">Error: {error}</p>}

          {!loading && !error && accountTransactions.length === 0 && (
            <p className="text-center text-neutral-500">
              No hay transacciones para esta cuenta
            </p>
          )}

          {!loading && !error && accountTransactions.length > 0 && (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-neutral-200">
                  <th className="px-3 py-2 text-left text-sm font-medium text-neutral-950 border-b border-neutral-950">
                    Fecha
                  </th>
                  <th className="px-3 py-2 text-left text-sm font-medium text-neutral-950 border-b border-neutral-950">
                    Tipo
                  </th>
                  <th className="px-3 py-2 text-left text-sm font-medium text-neutral-950 border-b border-neutral-950">
                    Contraparte
                  </th>
                  <th className="px-3 py-2 text-right text-sm font-medium text-neutral-950 border-b border-neutral-950">
                    Monto
                  </th>
                  <th className="px-3 py-2 text-left text-sm font-medium text-neutral-950 border-b border-neutral-950">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {accountTransactions.map((tx: any, idx: number) => {
                  const mappedTx = mapTx(tx);
                  const isSent = mappedTx.originIban === iban;
                  const otherParty = isSent
                    ? mappedTx.destinationIban
                    : mappedTx.originIban;
                  const typeLabel = isSent ? "Enviado" : "Recibido";
                  const amountClass = isSent
                    ? "text-red-600"
                    : "text-green-600";
                  const sign = isSent ? "-" : "+";
                  const key =
                    mappedTx.transactionId || `${mappedTx.createdAt}-${idx}`;

                  return (
                    <tr
                      key={key}
                      className="border-b border-neutral-200 hover:bg-neutral-200 transition-colors"
                    >
                      <td className="px-3 py-2 text-sm text-neutral-950">
                        {new Date(mappedTx.createdAt).toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-sm text-neutral-950">
                        {typeLabel}
                      </td>
                      <td className="px-3 py-2 text-sm text-neutral-700">
                        {otherParty}
                      </td>
                      <td
                        className={`px-3 py-2 text-sm text-right font-bold ${amountClass}`}
                      >
                        {sign}
                        {Number(mappedTx.amount).toFixed(2)} {mappedTx.currency}
                      </td>
                      <td className="px-3 py-2 text-sm text-neutral-950">
                        {mappedTx.status}
                      </td>
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
