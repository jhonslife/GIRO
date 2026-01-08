/**
 * @file Sidebar - Navegação lateral
 * @description Menu de navegação principal com ícones
 */

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Bell,
  Boxes,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Users,
  Wallet,
} from 'lucide-react';
import { useState, type FC } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface NavItem {
  icon: typeof ShoppingCart;
  label: string;
  href: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: ShoppingCart, label: 'PDV', href: '/pdv' },
  { icon: Package, label: 'Produtos', href: '/products' },
  { icon: Boxes, label: 'Estoque', href: '/stock' },
  { icon: Users, label: 'Funcionários', href: '/employees' },
  { icon: Wallet, label: 'Caixa', href: '/cash' },
  { icon: BarChart3, label: 'Relatórios', href: '/reports' },
  { icon: Bell, label: 'Alertas', href: '/alerts' },
  { icon: Settings, label: 'Configurações', href: '/settings' },
];

export const Sidebar: FC = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'flex flex-col border-r bg-card transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-foreground">Mercearias</span>
          </div>
        )}
        {isCollapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground mx-auto">
            <ShoppingCart className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                isActive
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                  : 'text-muted-foreground',
                isCollapsed && 'justify-center px-2'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
              {!isCollapsed && item.badge && item.badge > 0 && (
                <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1.5 text-xs text-destructive-foreground">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn('w-full', isCollapsed && 'px-2')}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>Recolher</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
};
