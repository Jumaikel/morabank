// components/forms/RegisterForm.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { RegisterFormSkeleton } from "@/components/forms/RegisterFormSkeleton";
import useUserStore from "@/stores/userStore";
import useAccountStore from "@/stores/accountStore";
import useBankStore from "@/stores/bankStore";

function generateCostaRicaIban(bankCode: string): string {
  // Aseguramos que el código tenga exactamente 4 dígitos (ceros a la izquierda si hace falta)
  const bankPart = bankCode.padStart(4, "0").slice(-4);
  // Generamos 14 dígitos aleatorios para el número de cuenta
  let accountPart = "";
  for (let i = 0; i < 14; i++) {
    accountPart += Math.floor(Math.random() * 10).toString();
  }
  // Para simplificar, ponemos "00" como dígitos de control (en producción habría que calcularlos)
  const controlPart = "00";
  return `CR${controlPart}${bankPart}${accountPart}`;
}

export const RegisterForm = () => {
  const router = useRouter();

  const [identification, setIdentification] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [iban, setIban] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountHolder, setAccountHolder] = useState("");

  const registerUser = useUserStore((state) => state.addUser);
  const registerAccount = useAccountStore((state) => state.addAccount);

  const getBank = useBankStore((state) => state.getBank);
  const selectedBank = useBankStore((state) => state.selectedBank);
  const bankLoading = useBankStore((state) => state.loading);
  const bankError = useBankStore((state) => state.error);

  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoadingPage(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    getBank();
  }, [getBank]);

  useEffect(() => {
    if (selectedBank) {
      const code4 = selectedBank.bankCode.padStart(4, "0").slice(-4);
      setBankCode(code4);

      const newIban = generateCostaRicaIban(code4);
      setIban(newIban);
    }
  }, [selectedBank]);

  useEffect(() => {
    const fullName = `${name.trim()} ${lastName.trim()}`.trim();
    setAccountHolder(fullName);
  }, [name, lastName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      !identification ||
      !name ||
      !lastName ||
      !phone ||
      !email ||
      !password
    ) {
      setError("All fields are required");
      return;
    }
    if (!selectedBank) {
      setError("Bank information is still loading");
      return;
    }
    if (!iban || !bankCode || !accountHolder) {
      setError("Account data is not ready");
      return;
    }

    setLoading(true);
    try {
      await registerAccount({
        iban,
        bankCode,
        accountHolder,
      });

      await registerUser({
        identification,
        name,
        lastName,
        phone,
        accountIban: iban,
        email,
        password,
      });

      router.push("/login");
    } catch (err: any) {
      console.error("Error during registration:", err);
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (loadingPage) {
    return <RegisterFormSkeleton />;
  }

  return (
    <div className="relative flex flex-col md:flex-row w-full max-w-4xl rounded-xl shadow-lg overflow-hidden bg-white">
      <div className="hidden my-12 md:block absolute top-0 bottom-0 left-1/2 w-px bg-neutral-400 z-10" />

      <div className="w-full md:w-1/2 flex items-center justify-center order-1 md:order-2 px-6 py-12">
        <div className="relative w-40 h-40 md:w-72 md:h-72">
          <Image
            src="/icon.png"
            alt="App Logo"
            fill
            className="object-contain"
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 px-6 md:px-12 py-12 md:py-32 space-y-5 order-2 md:order-1">
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="text-3xl font-bold text-center text-neutral-950">
            Create Account &amp; User
          </h2>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <Input
            required
            label="Identification"
            placeholder="e.g. 1234567890"
            value={identification}
            onChange={(e) => setIdentification(e.target.value)}
          />

          <Input
            required
            label="First Name"
            placeholder="e.g. John"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            required
            label="Last Name"
            placeholder="e.g. Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <Input
            required
            label="Phone"
            placeholder="e.g. +50671234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Input
            required
            label="Email"
            type="email"
            placeholder="e.g. john.doe@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            required
            label="Password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            required
            disabled
            label="Bank Code"
            value={bankCode}
            placeholder="Bank code (auto)"
          />
          {bankLoading && (
            <p className="text-sm text-gray-500">Loading bank data...</p>
          )}
          {!bankLoading && bankError && (
            <p className="text-sm text-red-500">{bankError}</p>
          )}

          <Input
            required
            disabled
            label="Account Holder"
            value={accountHolder}
            placeholder="Account holder (auto)"
          />

          <Input
            required
            disabled
            label="IBAN"
            value={iban}
            placeholder="IBAN (auto-generated)"
          />

          <Button type="submit" isLoading={loading} className="w-full">
            Register
          </Button>
        </form>
      </div>
    </div>
  );
};
