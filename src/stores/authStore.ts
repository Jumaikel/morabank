import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  login as loginService,
  verifyMfa as verifyMfaService,
  LoginCredentials,
} from '../services/authService';

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
        try {
          await loginService({
            identification: credentials.identification,
            password: credentials.password,
          });
          set({
            identification: credentials.identification,
            awaitingMfa: true,
            loading: false,
          });
        } catch (err: any) {
          set({
            error: err.message || 'Error during login',
            loading: false,
            awaitingMfa: false,
          });
        }
      },

      verifyMfa: async (mfaCode) => {
        set({ loading: true, error: null });
        try {
          const ident = get().identification;
          if (!ident) {
            throw new Error('No identification stored for MFA verification');
          }
          const response = await verifyMfaService({
            identification: ident,
            mfaCode,
          });
          set({
            token: response.token,
            awaitingMfa: false,
            loading: false,
          });
        } catch (err: any) {
          set({
            error: err.message || 'Error verifying MFA code',
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
      name: 'auth-storage',
      partialize: (state) => ({
        identification: state.identification,
        token: state.token,
      }),
    }
  )
);
