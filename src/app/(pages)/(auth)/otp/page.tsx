import { OTPForm } from "@/components/forms/OTPForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `OTP Verificación | MoraBank`,
};

export default function OTPPage() {
  return (
    <div className="p-4 md:p-0 min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-neutral-800 text-white">
      <OTPForm />
    </div>
  );
}
