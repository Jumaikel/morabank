"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { OTPFormSkeleton } from "@/components/forms/OTPFormSkeleton";
import useAuthStore from "@/stores/authStore";

export const OTPForm = () => {
  const [mfaCode, setMfaCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);

  const verifyMfa = useAuthStore((state) => state.verifyMfa);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await verifyMfa(mfaCode);
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

  if (loadingPage) {
    return <OTPFormSkeleton />;
  }

  return (
    <div className="flex flex-col w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-3xl font-bold text-center text-neutral-950">
          Verify MFA Code
        </h2>

        <p className="text-sm text-neutral-600 text-center">
          Enter the one-time code sent to your email.
        </p>

        <Input
          required
          label="MFA Code"
          placeholder="123456"
          value={mfaCode}
          onChange={(e) => setMfaCode(e.target.value)}
        />

        <Button type="submit" isLoading={loading} className="w-full">
          Verify
        </Button>
      </form>
    </div>
  );
};
