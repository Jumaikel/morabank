import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
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
  isAuthenticated: boolean;
  userType?: string;

  login: (credentials: LoginCredentials) => Promise<boolean>;
  sendOtp: (identification: string) => Promise<boolean>;
  verifyMfa: (mfaCode: string) => Promise<boolean>;
  changePassword: (payload: ChangePasswordRequest) => Promise<boolean>;
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
      isAuthenticated: false,

      login: async (credentials) => {
        set({ loading: true, error: null, awaitingMfa: false });
        const response = await authService.login(credentials);
        if (typeof response === "string") {
          set({
            error: response,
            loading: false,
            awaitingMfa: false,
            isAuthenticated: false,
          });
          return false;
        } else {
          set({
            identification: credentials.identification,
            awaitingMfa: true,
            loading: false,
            isAuthenticated: false,
          });
          return true;
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
          return false;
        } else {
          set({
            awaitingMfa: true,
            loading: false,
          });
          return true;
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
          return false;
        }
        const response = await authService.verifyMfa({
          identification: ident,
          mfaCode,
        });
        if (typeof response === "string") {
          set({
            error: response,
            loading: false,
            isAuthenticated: false,
          });
          return false;
        } else {
          const token = (response as VerifyMfaResponse).token;
          const userType = (response as VerifyMfaResponse).userType;
          set({
            token,
            userType,
            awaitingMfa: false,
            loading: false,
            isAuthenticated: true,
          });
          Cookies.set("auth-token", token, { expires: 1 / 24 });
          return true;
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
          return false;
        } else {
          set({
            identification: null,
            token: null,
            awaitingMfa: false,
            loading: false,
            isAuthenticated: false,
          });
          Cookies.remove("auth-token");
          return true;
        }
      },

      logout: () => {
        set({
          identification: null,
          token: null,
          loading: false,
          error: null,
          awaitingMfa: false,
          isAuthenticated: false,
        });
        Cookies.remove("auth-token");
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        identification: state.identification,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        userType: state.userType,
      }),
    }
  )
);

export default useAuthStore;
