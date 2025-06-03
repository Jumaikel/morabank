import { InternalTransactionForm } from "@/components/forms/InternalTransactionForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Transacciones Internas | MoraBank`,
};

export default function ChangePasswordPage() {
  return (
    <div>
      <InternalTransactionForm />
    </div>
  );
}
