import { AppShell } from '@/components/layout';
/* force refresh */
import { useAuthStore } from '@/stores/auth-store';
import { type FC } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

// Pages - usando named exports
import { AlertsPage } from '@/pages/alerts';
import { LoginPage } from '@/pages/auth';
import { CashControlPage } from '@/pages/cash';
import { DashboardPage } from '@/pages/dashboard';
import { EmployeesPage } from '@/pages/employees';
import { PDVPage } from '@/pages/pdv';
import { CategoriesPage, ProductFormPage, ProductsPage } from '@/pages/products';
import { ReportsPage, SalesReportPage } from '@/pages/reports';
import { SettingsPage } from '@/pages/settings';
import { ExpirationPage, StockEntryPage, StockPage } from '@/pages/stock';

// Componente de rota protegida
interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRole?: string[];
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, employee } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && employee && !requiredRole.includes(employee.role)) {
    return <Navigate to="/pdv" replace />;
  }

  // Use children if provided, otherwise use Outlet for nested routes
  return <>{children ?? <Outlet />}</>;
};

const App: FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      {/* Rota de Login */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/pdv" replace /> : <LoginPage />}
      />

      {/* Layout com AppShell usando element wrapper */}
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route index element={<Navigate to="/pdv" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />

        {/* PDV */}
        <Route path="pdv" element={<PDVPage />} />

        {/* Produtos */}
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/new" element={<ProductFormPage />} />
        <Route path="products/:id" element={<ProductFormPage />} />
        <Route path="products/categories" element={<CategoriesPage />} />

        {/* Estoque */}
        <Route path="stock" element={<StockPage />} />
        <Route path="stock/entry" element={<StockEntryPage />} />
        <Route path="stock/expiration" element={<ExpirationPage />} />

        {/* Funcionários */}
        <Route
          path="employees"
          element={
            <ProtectedRoute requiredRole={['ADMIN']}>
              <EmployeesPage />
            </ProtectedRoute>
          }
        />

        {/* Caixa */}
        <Route path="cash" element={<CashControlPage />} />

        {/* Relatórios */}
        <Route
          path="reports"
          element={
            <ProtectedRoute requiredRole={['ADMIN', 'MANAGER', 'VIEWER']}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="reports/sales"
          element={
            <ProtectedRoute requiredRole={['ADMIN', 'MANAGER', 'VIEWER']}>
              <SalesReportPage />
            </ProtectedRoute>
          }
        />

        {/* Configurações */}
        <Route
          path="settings"
          element={
            <ProtectedRoute requiredRole={['ADMIN']}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Alertas */}
        <Route path="alerts" element={<AlertsPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/pdv" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
