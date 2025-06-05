import { RegisterForm } from "@/components/forms/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Registro | MoraBank`,
};

export default function RegisterPage() {
  return (
    <div className="p-4 md:px-0 min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-neutral-800 text-white">
      <RegisterForm />
    </div>
  );
}
