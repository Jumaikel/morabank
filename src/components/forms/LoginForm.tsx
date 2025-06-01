"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { LoginFormSkeleton } from "./LoginFormSkeleton";

export const LoginForm = () => {
  const [identification, setIdentification] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      console.log("Enviando credenciales:", { identification, password });
      await new Promise((res) => setTimeout(res, 1500));
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoadingPage(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loadingPage) {
    return <LoginFormSkeleton />;
  }

  return (
    <div className="relative flex flex-col md:flex-row w-full max-w-4xl rounded-xl shadow-lg overflow-hidden bg-white">
      <div className="hidden my-12 md:block absolute top-0 bottom-0 left-1/2 w-px bg-neutral-400 z-10" />

      <div className="w-full md:w-1/2 flex items-center justify-center order-1 md:order-2 px-6 py-12">
        <div className="relative w-40 h-40 md:w-72 md:h-72">
          <Image
            src="/icon.png"
            alt="Logo de la aplicación"
            fill
            className="object-contain"
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 px-6 md:px-12 py-12 md:py-32 space-y-5 order-2 md:order-1">
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="text-3xl font-bold text-center text-neutral-950">
            Iniciar sesión
          </h2>

          <Input
            required
            label="Identificación"
            placeholder="Identificación"
            value={identification}
            onChange={(e) => setIdentification(e.target.value)}
          />

          <Input
            required
            label="Contraseña"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex justify-end text-sm">
            <Link
              href="/Change-Password"
              className="text-neutral-500 underline hover:text-neutral-950"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Button type="submit" isLoading={loading} className="w-40">
            Ingresar
          </Button>
        </form>
      </div>
    </div>
  );
};
