import { SinpeTransactionForm } from "@/components/forms/SinpeTransactionForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `SINPE Móvil | MoraBank`,
};

export default function SinpeMovilPage() {
  return (
    <div>
      <SinpeTransactionForm />
    </div>
  );
}
