import { TransactionsMenu } from "@/components/common/TransactionsMenu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Transacciones | MoraBank`,
};

export default function TransactionsPage() {
  return (
    <div >
      <h1 className="text-3xl font-bold text-center mb-14">Transacciones</h1>
      <TransactionsMenu />
    </div>
  );
}
