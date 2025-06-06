import { ChangePasswordForm } from "@/components/forms/ChangePasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Cambio de Contraseña | MoraBank`,
};

export default function ChangePasswordPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <ChangePasswordForm />
    </div>
  );
}
