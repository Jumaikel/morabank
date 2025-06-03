"use client";

import { useEffect, useState } from "react";
import { AccountCard } from "@/components/common/AccountCard";
import { AccountHistoryModal } from "@/components/layout/AccountHistoryModal";
import useAuthStore from "@/stores/authStore";
import useUserStore from "@/stores/userStore";
import useAccountStore from "@/stores/accountStore";

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

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (identification && token && !selectedUser) {
      fetchUser(identification);
    }
  }, [identification, token, fetchUser, selectedUser]);

  useEffect(() => {
    if (selectedUser && selectedUser.accountIban && !selectedAccount) {
      fetchAccount(selectedUser.accountIban);
    }
  }, [selectedUser, fetchAccount, selectedAccount]);

  if (!identification || !token) {
    return <p className="text-center text-red-500">No estás logueado.</p>;
  }

  if (userLoading || accountLoading) {
    return <p className="text-center">Cargando información...</p>;
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
    return (
      <>
        <div className="flex justify-center p-4">
          <AccountCard
            iban={selectedAccount.iban}
            bankCode={selectedAccount.bankCode}
            accountHolder={selectedAccount.accountHolder}
            balance={selectedAccount.balance}
            state={selectedAccount.state}
            onClick={() => setIsModalOpen(true)}
          />
        </div>
        <AccountHistoryModal
          iban={selectedAccount.iban}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
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
