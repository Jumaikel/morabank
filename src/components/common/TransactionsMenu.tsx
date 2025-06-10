"use client";

import Link from "next/link";
import { Button } from "../ui/Button";

export const TransactionsMenu = () => {
  return (
    <div className="flex flex-col justify-center items-center space-y-6">
      <Button
        asLink
        href="/internet-banking/transactions/internal"
        variant={"secondary"}
        className="px-5 py-2 transition w-80 md:w-2xl h-11"
      >
        Interna
      </Button>

      <Button
        asLink
        href="/internet-banking/transactions/external"
        variant={"secondary"}
        className="px-5 py-2 transition w-80 md:w-2xl h-11"
      >
        Externa
      </Button>

      <Button
        asLink
        href="/internet-banking/transactions/sinpe"
        className="px-5 py-2 transition w-80 md:w-2xl h-11"
        variant={"secondary"}
      >
        SINPE Móvil
      </Button>

            <Button
        asLink
        href="/internet-banking/transactions/pull"
        className="px-5 py-2 transition w-80 md:w-2xl h-11"
        variant={"secondary"}
      >
        Pull de Fondos
      </Button>
    </div>
  );
};
