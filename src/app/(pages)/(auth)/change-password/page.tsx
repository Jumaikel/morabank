import { ChangePasswordForm } from "@/components/forms/ChangePasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Cambio de Contraseña | MoraBank`,
};

export default function ChangePasswordPage() {
  return (
    <div>
      <ChangePasswordForm />
    </div>
  );
}
