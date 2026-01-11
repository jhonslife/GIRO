/**
 * License Store
 *
 * Gerencia o estado da licença do software.
 * A licença DEVE ser validada antes de qualquer acesso ao sistema.
 */
import { LicenseInfo } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LicenseState = 'loading' | 'unlicensed' | 'valid' | 'expired' | 'suspended' | 'error';

interface LicenseStore {
  // Estado
  licenseKey: string | null;
  licenseInfo: LicenseInfo | null;
  state: LicenseState;
  error: string | null;
  lastValidation: string | null;

  // Ações
  setLicenseKey: (key: string) => void;
  setLicenseInfo: (info: LicenseInfo) => void;
  setState: (state: LicenseState) => void;
  setError: (error: string | null) => void;
  updateLastValidation: () => void;
  clearLicense: () => void;

  // Verificações
  isLicenseValid: () => boolean;
  needsValidation: () => boolean;
}

// Validade da cache de licença (1 hora)
const VALIDATION_CACHE_MS = 60 * 60 * 1000;

export const useLicenseStore = create<LicenseStore>()(
  persist(
    (set, get) => ({
      licenseKey: null,
      licenseInfo: null,
      state: 'loading',
      error: null,
      lastValidation: null,

      setLicenseKey: (key) => set({ licenseKey: key }),

      setLicenseInfo: (info) => {
        const newState: LicenseState =
          info.status === 'active'
            ? 'valid'
            : info.status === 'expired'
            ? 'expired'
            : info.status === 'suspended'
            ? 'suspended'
            : 'error';

        set({
          licenseInfo: info,
          state: newState,
          error: null,
        });
      },

      setState: (state) => set({ state }),

      setError: (error) => set({ error, state: error ? 'error' : get().state }),

      updateLastValidation: () => set({ lastValidation: new Date().toISOString() }),

      clearLicense: () =>
        set({
          licenseKey: null,
          licenseInfo: null,
          state: 'unlicensed',
          error: null,
          lastValidation: null,
        }),

      isLicenseValid: () => {
        const { state, licenseInfo } = get();
        if (state !== 'valid') return false;
        if (!licenseInfo) return false;

        // Verificar expiração local
        if (licenseInfo.expires_at) {
          const expiresAt = new Date(licenseInfo.expires_at);
          if (expiresAt < new Date()) return false;
        }

        return true;
      },

      needsValidation: () => {
        const { lastValidation, licenseKey } = get();
        if (!licenseKey) return false;
        if (!lastValidation) return true;

        const lastCheck = new Date(lastValidation).getTime();
        const now = Date.now();
        return now - lastCheck > VALIDATION_CACHE_MS;
      },
    }),
    {
      name: 'giro-license',
      partialize: (state) => ({
        licenseKey: state.licenseKey,
        licenseInfo: state.licenseInfo,
        lastValidation: state.lastValidation,
      }),
    }
  )
);
