"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/authStore";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const userType = useAuthStore((state) => state.userType);

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Opciones de menú reutilizables (solo para móvil/sidebar)
  const menuLinks = (
    <>
      <Link
        href="/internet-banking/account"
        className="hover:text-neutral-600 focus:text-neutral-950 block py-2 px-4"
        onClick={() => setOpen(false)}
      >
        Cuenta
      </Link>
      <Link
        href="/internet-banking/transactions"
        className="hover:text-neutral-600 focus:text-neutral-950 block py-2 px-4"
        onClick={() => setOpen(false)}
      >
        Transacciones
      </Link>
      {userType === "A" && (
        <Link
          href="/internet-banking/admin"
          className="hover:text-blue-600 focus:text-neutral-950 block py-2 px-4"
          onClick={() => setOpen(false)}
        >
          Administración
        </Link>
      )}
      <button
        onClick={() => {
          setOpen(false);
          handleLogout();
        }}
        className="hover:text-red-500 focus:outline-none block py-2 px-4 text-left w-full"
      >
        Cerrar Sesión
      </button>
    </>
  );

  return (
    <nav className="bg-white text-black font-bold border border-neutral-950 rounded-md ring-neutral-950 ring-2 ring-offset-2 px-4 py-3 flex justify-between items-center m-2 relative">
      <div className="hidden md:flex w-full justify-between items-center">
        <div className="flex space-x-6 items-center">
          <Link
            href="/internet-banking/account"
            className="hover:text-neutral-600 focus:text-neutral-950"
          >
            Cuenta
          </Link>
          <Link
            href="/internet-banking/transactions"
            className="hover:text-neutral-600 focus:text-neutral-950"
          >
            Transacciones
          </Link>
          {userType === "A" && (
            <Link
              href="/internet-banking/admin"
              className="hover:text-blue-600 focus:text-neutral-950"
            >
              Administración
            </Link>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="hover:text-red-500 focus:outline-none ml-4"
        >
          Cerrar Sesión
        </button>
      </div>
      <button
        className="md:hidden flex items-center"
        onClick={() => setOpen(!open)}
        aria-label="Abrir menú"
      >
        {open ? <X size={32} /> : <Menu size={32} />}
      </button>
      <div
        className={`
          fixed inset-0 bg-black bg-opacity-40 z-50 transition-opacity duration-200
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setOpen(false)}
      >
        <aside
          className={`
            absolute top-0 left-0 w-64 h-full bg-white shadow-lg rounded-r-xl p-6 flex flex-col gap-2
            transform transition-transform duration-300
            ${open ? "translate-x-0" : "-translate-x-full"}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4 text-xl font-bold text-neutral-900">Menú</div>
          {menuLinks}
        </aside>
      </div>
    </nav>
  );
};
