"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { OTPFormSkeleton } from "@/components/forms/OTPFormSkeleton";
import useAuthStore from "@/stores/authStore";
import { useRouter } from "next/navigation";

export const OTPForm = () => {
  const router = useRouter();

  const [mfaCode, setMfaCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(300);

  const intervalRef = useRef<number | null>(null);

  const verifyMfa = useAuthStore((state) => state.verifyMfa);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await verifyMfa(mfaCode);
      router.push("/internet-banking/account");
    } catch (err) {
      console.error("Error verifying MFA code:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoadingPage(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loadingPage) return;
    if (secondsLeft <= 0) {
      router.replace("/login");
      return;
    }
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [loadingPage, secondsLeft, router]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (loadingPage) {
    return <OTPFormSkeleton />;
  }

  return (
    <div className="flex flex-col w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-3xl font-bold text-center text-neutral-950">
          Verificar OTP
        </h2>

        <p className="text-sm text-neutral-600 text-center">
          Ingresa el código de un solo uso enviado a tu correo electrónico.
        </p>
        <p className="text-center text-base font-semibold text-neutral-700 mb-2">
          Expira en: <span className="font-mono text-lg">{formatTime(secondsLeft)}</span>
        </p>

        <Input
          required
          label="Código OTP"
          placeholder="123456"
          value={mfaCode}
          onChange={(e) => setMfaCode(e.target.value)}
        />

        <Button type="submit" isLoading={loading} className="w-full">
          Verificar
        </Button>
      </form>
    </div>
  );
};
