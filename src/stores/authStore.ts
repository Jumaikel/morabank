import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  authService,
  LoginCredentials,
  VerifyMfaResponse,
} from "@/services/authService";

interface AuthStore {
  identification: string | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  awaitingMfa: boolean;

  login: (credentials: LoginCredentials) => Promise<void>;
  verifyMfa: (mfaCode: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      identification: null,
      token: null,
      loading: false,
      error: null,
      awaitingMfa: false,

      login: async (credentials) => {
        set({ loading: true, error: null });
        const response = await authService.login(credentials);
        if (typeof response === "string") {
          set({
            error: response,
            loading: false,
            awaitingMfa: false,
          });
        } else {
          set({
            identification: credentials.identification,
            awaitingMfa: true,
            loading: false,
          });
        }
      },

      verifyMfa: async (mfaCode) => {
        set({ loading: true, error: null });
        const ident = get().identification;
        if (!ident) {
          set({
            error: "No hay identificación almacenada para verificar MFA",
            loading: false,
          });
          return;
        }
        const response = await authService.verifyMfa({
          identification: ident,
          mfaCode,
        });
        if (typeof response === "string") {
          set({
            error: response,
            loading: false,
          });
        } else {
          set({
            token: (response as VerifyMfaResponse).token,
            awaitingMfa: false,
            loading: false,
          });
        }
      },

      logout: () => {
        set({
          identification: null,
          token: null,
          loading: false,
          error: null,
          awaitingMfa: false,
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        identification: state.identification,
        token: state.token,
      }),
    }
  )
);

export default useAuthStore;
