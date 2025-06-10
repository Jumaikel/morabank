import { PullExternalFundsForm } from "@/components/forms/PullExternalFundsForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Pull | MoraBank`,
};

export default function PullPage() {
  return (
    <div >
      <h1 className="text-3xl font-bold text-center mb-14">Pull de Fondos</h1>
      <PullExternalFundsForm />
    </div>
  );
}
