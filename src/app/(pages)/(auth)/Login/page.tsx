import { LoginForm } from "@/components/forms/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Iniciar Sesión | MoraBank`,
};

export default function LoginPage() {
  return (
    <div className="p-4 md:p-0 min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-neutral-800 text-white">
      <LoginForm />
    </div>
  );
}
