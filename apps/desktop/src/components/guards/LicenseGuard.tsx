/**
 * License Guard Component
 *
 * Componente que verifica se a licença está válida antes de permitir acesso.
 * Deve envolver toda a aplicação para garantir que nenhuma funcionalidade
 * seja acessível sem uma licença ativa.
 */
import { validateLicense } from '@/lib/tauri';
import { useLicenseStore, type LicenseState } from '@/stores/license-store';
import { Loader2 } from 'lucide-react';
import { useEffect, type FC, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface LicenseGuardProps {
  children: ReactNode;
}

export const LicenseGuard: FC<LicenseGuardProps> = ({ children }) => {
  // Test-only bypass: when running E2E we can set a global flag before app scripts
  // load to skip license enforcement. This avoids modifying production behavior.
  if (typeof globalThis !== 'undefined' && (globalThis as any).__E2E_BYPASS_LICENSE) {
    return <>{children}</>;
  }
  const {
    licenseKey,
    state,
    setState,
    setLicenseInfo,
    setError,
    updateLastValidation,
    needsValidation,
  } = useLicenseStore();

  useEffect(() => {
    const checkLicense = async () => {
      // No license key stored - need activation
      if (!licenseKey) {
        setState('unlicensed');
        return;
      }

      // Only revalidate if needed (cache expired or first check)
      if (!needsValidation()) {
        return;
      }

      // Validate with server
      try {
        setState('loading');
        const info = await validateLicense(licenseKey);
        setLicenseInfo(info);
        updateLastValidation();
      } catch (error) {
        console.error('License validation failed:', error);
        setError(typeof error === 'string' ? error : 'Falha ao validar licença');
      }
    };

    checkLicense();
  }, [licenseKey]);

  // Loading state
  if (state === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Verificando licença...</p>
        </div>
      </div>
    );
  }

  // No license or invalid - redirect to activation
  const invalidStates: LicenseState[] = ['unlicensed', 'expired', 'suspended', 'error'];
  if (invalidStates.includes(state)) {
    return <Navigate to="/license" replace />;
  }

  // License valid - render children
  return <>{children}</>;
};

export default LicenseGuard;
