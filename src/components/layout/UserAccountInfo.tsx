"use client";

import { useEffect, useState } from "react";
import { AccountCard } from "@/components/common/AccountCard";
import { AccountHistoryModal } from "@/components/layout/AccountHistoryModal";
import useAuthStore from "@/stores/authStore";
import useUserStore from "@/stores/userStore";
import useAccountStore from "@/stores/accountStore";
import { AccountCardSkeleton } from "../common/AccountCardSkeleton";

export const UserAccountInfo = () => {
  const identification = useAuthStore((state) => state.identification);
  const token = useAuthStore((state) => state.token);

  const fetchUser = useUserStore((state) => state.fetchUser);
  const selectedUser = useUserStore((state) => state.selectedUser);
  const userLoading = useUserStore((state) => state.loading);
  const userError = useUserStore((state) => state.error);

  const fetchAccount = useAccountStore((state) => state.fetchAccount);
  const selectedAccount = useAccountStore((state) => state.selectedAccount);
  const accountLoading = useAccountStore((state) => state.loading);
  const accountError = useAccountStore((state) => state.error);

  // Para transacciones
  const fetchAccountTransactions = useAccountStore(
    (s) => s.fetchAccountTransactions
  );
  const accountTransactions = useAccountStore((s) => s.accountTransactions);
  const txLoading = useAccountStore((s) => s.loading);
  const txError = useAccountStore((s) => s.error);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Siempre que cambia la identificación o token, cargamos el usuario
  useEffect(() => {
    if (identification && token) {
      fetchUser(identification);
    }
    // eslint-disable-next-line
  }, [identification, token]);

  // Siempre que cambia el usuario, carga la cuenta
  useEffect(() => {
    if (selectedUser && selectedUser.accountIban) {
      fetchAccount(selectedUser.accountIban);
    }
    // eslint-disable-next-line
  }, [selectedUser]);

  // Solo carga las transacciones cuando el modal se abre
  useEffect(() => {
    if (isModalOpen && selectedAccount) {
      fetchAccountTransactions(selectedAccount.iban);
    }
  }, [isModalOpen, selectedAccount, fetchAccountTransactions]);



  if ((userLoading || accountLoading) && !isModalOpen) {
    return <AccountCardSkeleton />;
  }
    if (!identification || !token) {
    return <p className="text-center text-red-500">No estás logueado redirigiendo al login...</p>
  }
  if (userError) {
    return (
      <p className="text-center text-red-500">
        Error al obtener usuario: {userError}
      </p>
    );
  }
  if (accountError) {
    return (
      <p className="text-center text-red-500">
        Error al obtener cuenta: {accountError}
      </p>
    );
  }

  if (selectedAccount) {
    // Convertir balance (string) a número
    const balanceNumber = Number((selectedAccount as any).balance);

    // Obtener resto de campos
    const iban = selectedAccount.iban;
    const accountNumber =
      (selectedAccount as any).accountNumber ??
      (selectedAccount as any).account_number ??
      "";
    const accountType =
      (selectedAccount as any).accountType ??
      (selectedAccount as any).account_type ??
      "";
    const accountHolder =
      (selectedAccount as any).accountHolder ??
      (selectedAccount as any).account_holder ??
      "";
    const status =
      (selectedAccount as any).status ?? (selectedAccount as any).state ?? "";

    return (
      <>
        <div className="flex justify-center px-2">
          <AccountCard
            iban={iban}
            accountNumber={accountNumber}
            accountType={accountType as "CORRIENTE" | "AHORROS"}
            accountHolder={accountHolder}
            balance={balanceNumber}
            status={status as "ACTIVO" | "BLOQUEADO" | "CERRADO"}
            onClick={() => setIsModalOpen(true)}
          />
        </div>
        <AccountHistoryModal
          iban={iban}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          accountTransactions={accountTransactions}
          loading={txLoading}
          error={txError}
        />
      </>
    );
  }

  return (
    <p className="text-center text-gray-500">
      No se encontró cuenta para el usuario.
    </p>
  );
};
