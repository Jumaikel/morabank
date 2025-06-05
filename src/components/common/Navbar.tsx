"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/authStore";

export const Navbar = () => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const userType = useAuthStore((state) => state.userType);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="bg-white text-black font-bold border border-neutral-950 rounded-md transition-colors ring-neutral-950 outline-none ring-2 ring-offset-2 px-4 py-3 flex justify-between items-center m-2">
      <div className="flex space-x-6">
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
        className="hover:text-red-500 focus:outline-none "
      >
        Cerrar Sesión
      </button>
    </nav>
  );
};
