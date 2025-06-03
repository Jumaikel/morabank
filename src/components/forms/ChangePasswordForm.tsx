"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export const ChangePasswordForm = () => {
  const router = useRouter();

  const [identification, setIdentification] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const intervalRef = useRef<number | null>(null);

  const startCountdown = () => {
    setSecondsLeft(300);
    setOtpSent(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Limpiar interval al desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Función para solicitar el envío del OTP
  const handleSendOtp = async () => {
    setError(null);
    if (!identification.trim()) {
      setError("La identificación es obligatoria para enviar el código OTP.");
      return;
    }

    try {
      // Llamada al endpoint que envía el OTP (por ejemplo, /api/auth/send-otp)
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identification: identification.trim() }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Error al enviar OTP");
      }
      startCountdown();
      setSuccess("Código OTP enviado. Revisa tu correo.");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al solicitar OTP.");
    }
  };

  // Función para cambiar la contraseña
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!identification.trim() || !otpCode.trim() || !newPassword || !confirmPassword) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setSubmitting(true);
    try {
      // Llamada al endpoint que valida OTP y cambia contraseña
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identification: identification.trim(),
          otp: otpCode.trim(),
          newPassword,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Error al cambiar contraseña");
      }
      // Éxito: redirigir a /login
      router.push("/login");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al cambiar contraseña.");
    } finally {
      setSubmitting(false);
    }
  };

  // Formatea el tiempo en MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-8">
      <h2 className="text-2xl font-bold text-center text-neutral-950 mb-6">
        Cambiar Contraseña
      </h2>

      {error && <p className="text-sm text-red-500 text-center mb-4">{error}</p>}
      {success && <p className="text-sm text-green-600 text-center mb-4">{success}</p>}

      <form onSubmit={handleChangePassword} className="space-y-6">
        {/* IDENTIFICACIÓN */}
        <div>
          <Input
            required
            label="Identificación"
            placeholder="ej. 1234567890"
            value={identification}
            onChange={(e) => setIdentification(e.target.value)}
          />
        </div>

        {/* BOTÓN ENVIAR OTP */}
        <div className="flex items-center space-x-4">
          <Button
            type="button"
            onClick={handleSendOtp}
            disabled={otpSent && secondsLeft > 0}
            className="flex-1"
          >
            {otpSent && secondsLeft > 0
              ? `Reenviar en ${formatTime(secondsLeft)}`
              : "Enviar OTP"}
          </Button>
        </div>

        {/* NUEVA CONTRASEÑA */}
        <div>
          <Input
            required
            label="Nueva Contraseña"
            type="password"
            placeholder="********"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        {/* CONFIRMAR CONTRASEÑA */}
        <div>
          <Input
            required
            label="Confirmar Contraseña"
            type="password"
            placeholder="********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* CÓDIGO OTP */}
        <div>
          <Input
            required
            label="Código OTP"
            placeholder="123456"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
          />
        </div>

        {/* BOTÓN CAMBIAR CONTRASEÑA */}
        <Button type="submit" isLoading={submitting} className="w-full">
          Cambiar Contraseña
        </Button>
      </form>
    </div>
  );
};
