import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  authService,
  LoginCredentials,
  SendOtpRequest,
  ChangePasswordRequest,
  VerifyMfaResponse,
} from "@/services/authService";

interface AuthStore {
  identification: string | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  awaitingMfa: boolean;

  login: (credentials: LoginCredentials) => Promise<void>;
  sendOtp: (identification: string) => Promise<void>;
  verifyMfa: (mfaCode: string) => Promise<void>;
  changePassword: (payload: ChangePasswordRequest) => Promise<void>;
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
          // On successful login request, store identification and prompt MFA
          set({
            identification: credentials.identification,
            awaitingMfa: true,
            loading: false,
          });
        }
      },

      sendOtp: async (identification) => {
        set({ loading: true, error: null });
        const response = await authService.sendOtp({ identification });
        if (typeof response === "string") {
          set({
            error: response,
            loading: false,
          });
        } else {
          // OTP sent successfully; keep awaitingMfa true to allow verification
          set({
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

      changePassword: async (payload) => {
        set({ loading: true, error: null });
        const response = await authService.changePassword(payload);
        if (typeof response === "string") {
          set({
            error: response,
            loading: false,
          });
        } else {
          // Password changed successfully, clear store (force re-login)
          set({
            identification: null,
            token: null,
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
