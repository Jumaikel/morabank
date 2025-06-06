"use client";

import React from "react";
import { AccountCardSkeleton } from "./AccountCardSkeleton";

interface AccountCardProps {
  iban: string;
  accountNumber: string;
  accountType: "CORRIENTE" | "AHORROS";
  accountHolder: string;
  balance: number;
  status: "ACTIVO" | "BLOQUEADO" | "CERRADO";
  onClick?: () => void;
}

function formatCardNumber(num: string) {
  return num
    .replace(/\s+/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatIban(iban: string) {
  return iban
    .replace(/\s+/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

export const AccountCard: React.FC<AccountCardProps> = ({
  iban = "",
  accountNumber = "",
  accountType = "CORRIENTE",
  accountHolder = "Cuenta Cliente",
  balance = 0,
  status = "ACTIVO",
  onClick,
}) => {
  const formattedCardNumber = formatCardNumber(accountNumber);
  const formattedIban = formatIban(iban);
  const [loadingPage, setLoadingPage] = React.useState(true);
  const backgroundStyle =
    accountType === "CORRIENTE"
      ? {
          background:
            "radial-gradient(ellipse 100% 70% at 90% 0%, rgba(255,84,168,0.15) 20%, rgba(186,74,255,0.15) 70%, transparent 100%)," +
            "linear-gradient(135deg, #fff0fa 45%, #ffc8ff 80%, #bb76fa 120%)",
        }
      : {
          background:
            "radial-gradient(ellipse 100% 70% at 80% 10%, rgba(255,220,120,0.18) 20%, rgba(255,170,60,0.12) 60%, transparent 100%)," +
            "linear-gradient(135deg, #fffbe8 45%, #ffe0a3 80%, #ffb647 120%)",
        };

  React.useEffect(() => {
    const timer = setTimeout(() => setLoadingPage(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const statusColor =
    status === "ACTIVO"
      ? "bg-green-500"
      : status === "BLOQUEADO"
      ? "bg-red-500"
      : "bg-gray-500";

  if (loadingPage) {
    return <AccountCardSkeleton />;
  }

  return (
    <button
      onClick={onClick}
      className={`
        group relative w-full max-w-2xl min-w-[400px] min-h-[250px]
        p-8 rounded-3xl
        border-2 border-neutral-950 shadow-2xl
        flex flex-col justify-between
        overflow-hidden
        mx-auto
        transition-transform
        hover:scale-105
        cursor-pointer
      `}
      style={backgroundStyle}
    >
      {/* Row superior: chip y logo */}
      <div className="flex justify-between items-center w-full mb-4">
        {/* Chip */}
        <div className="w-14 h-9 bg-gradient-to-br from-neutral-300 to-neutral-100 rounded-md shadow-inner border border-neutral-400"></div>
        {/* Account Type */}
        <span
          className={`px-3 py-1 text-xs rounded-full ${statusColor} text-white font-bold uppercase tracking-wider`}
        >
          {accountType}
        </span>
      </div>

      {/* Número de tarjeta (cuenta) */}
      <div className="flex justify-center items-center my-3">
        <span className="text-2xl md:text-3xl font-mono font-bold tracking-widest text-neutral-900 drop-shadow-sm">
          {formattedCardNumber}
        </span>
      </div>

      {/* Línea info secundaria (balance + status) */}
      <div className="flex justify-between items-center mt-2 mb-4">
        <div className="flex flex-col">
          <span className="text-xs text-neutral-600">Balance</span>
          <span className={`font-bold ${statusColor} text-white rounded px-2`}>
            ₡{Number(balance).toFixed(2)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-neutral-600">Estado</span>
          <span className={`font-bold ${statusColor} text-white rounded px-2`}>
            {status}
          </span>
        </div>
      </div>

      {/* Línea inferior: IBAN, titular y logo */}
      <div className="flex justify-between items-end mt-2 w-full md:space-x-20">
        <div className="flex flex-col items-start">
          <span className="text-xs text-neutral-700 opacity-80">Titular</span>
          <span className="text-base font-semibold tracking-wide text-neutral-900 uppercase">
            {accountHolder}
          </span>
          <span className="text-xs text-neutral-700 opacity-80 mt-2">IBAN</span>
          <span className="text-sm font-mono tracking-wider text-neutral-800">
            {formattedIban}
          </span>
        </div>
        {/* Logo VISA */}
        <div className="flex flex-col items-end">
          <svg height={46} viewBox="0 0 75 28" fill="none">
            <text
              x="0"
              y="26"
              fontSize="32"
              fontWeight="bold"
              fill="#2346E8"
              fontFamily="Arial"
            >
              VISA
            </text>
          </svg>
        </div>
      </div>
    </button>
  );
};
