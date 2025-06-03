"use client";

import React from "react";

interface AccountCardProps {
  iban: string;
  bankCode: string;
  accountHolder: string;
  balance: number;
  state: "ACTIVE" | "BLOCKED" | "CLOSED";
  onClick?: () => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  iban,
  bankCode,
  accountHolder,
  balance,
  state,
  onClick,
}) => {
  const maskedIban = iban.slice(-4).padStart(iban.length, "•");

  const stateColor =
    state === "ACTIVE"
      ? "bg-green-500"
      : state === "BLOCKED"
      ? "bg-red-500"
      : "bg-gray-500";

  return (
    <button
      onClick={onClick}
      className="group relative w-full max-w-sm p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg hover:shadow-2xl transition-shadow focus:outline-none"
    >
      <div className="flex flex-col space-y-4 text-white">
        <div className="flex justify-between items-center">
          <span className="text-sm uppercase tracking-widest">{bankCode}</span>
          <span
            className={`px-2 py-0.5 text-xs rounded-full ${stateColor} bg-opacity-90`}
          >
            {state}
          </span>
        </div>

        <div>
          <p className="text-xs opacity-80">Account Holder</p>
          <p className="text-lg font-semibold">{accountHolder}</p>
        </div>

        <div>
          <p className="text-xs opacity-80">IBAN</p>
          <p className="text-sm tracking-wider">{maskedIban}</p>
        </div>

        <div>
          <p className="text-xs opacity-80">Balance</p>
          <p className="text-xl font-semibold">${balance.toFixed(2)}</p>
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-colors"></div>
    </button>
  );
};
