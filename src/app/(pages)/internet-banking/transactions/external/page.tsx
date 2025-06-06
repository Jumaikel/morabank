import { ExternalTransactionForm } from "@/components/forms/ExternalTransactionForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Transacciones Externas | MoraBank`,
};

export default function ExternalTransactionsPage() {
  return (
    <main>
      <ExternalTransactionForm />
    </main>
  );
}
