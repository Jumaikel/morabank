"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { RegisterFormSkeleton } from "@/components/forms/RegisterFormSkeleton";
import useUserStore from "@/stores/userStore";
import { toast } from "sonner";

export const RegisterForm = () => {
  const router = useRouter();

  const [identification, setIdentification] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [secondLastName, setSecondLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountType, setAccountType] = useState<"CORRIENTE" | "AHORROS">("CORRIENTE");

  const registerUser = useUserStore((state) => state.addUser);

  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoadingPage(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const ok = await registerUser({
        identification,
        name,
        lastName,
        secondLastName,
        phone,
        email,
        password,
        accountType,
      });

      if (!ok) {
        toast.error("No se pudo registrar el usuario. Verifica los datos.");
        return;
      }

      toast.success("Usuario registrado correctamente.");
      setTimeout(() => router.push("/internet-banking/admin"), 1200);
    } catch (err: any) {
      console.error("Error during registration:", err);
      toast.error("Error inesperado al registrar usuario.");
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
            Crear Usuario
          </h2>

          <Input
            required
            label="Identificación"
            placeholder="p.ej. 1234567890"
            value={identification}
            onChange={(e) => setIdentification(e.target.value)}
          />

          <Input
            required
            label="Nombre"
            placeholder="p.ej. Juan"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            required
            label="Primer Apellido"
            placeholder="p.ej. Mora"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <Input
            label="Segundo Apellido"
            placeholder="p.ej. Mora"
            value={secondLastName}
            onChange={(e) => setSecondLastName(e.target.value)}
          />

          <Input
            required
            label="Teléfono"
            placeholder="p.ej. 71234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Input
            required
            label="Email"
            type="email"
            placeholder="p.ej. john.doe@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="flex flex-col space-y-1 text-neutral-700">
            <label className="text-sm font-medium text-neutral-950">Tipo de Cuenta</label>
            <select
              required
              value={accountType}
              onChange={(e) =>
                setAccountType(e.target.value as "CORRIENTE" | "AHORROS")
              }
              className="bg-transparent border border-neutral-950 rounded-md transition-colors focus:ring-neutral-950 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-200"
            >
              <option value="CORRIENTE">Corriente</option>
              <option value="AHORROS">Ahorros</option>
            </select>
          </div>

          <Input
            required
            label="Contraseña"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            required
            label="Confirmar Contraseña"
            type="password"
            placeholder="********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button type="submit" isLoading={loading} className="w-full">
            Registrar
          </Button>
        </form>
      </div>
    </div>
  );
};
