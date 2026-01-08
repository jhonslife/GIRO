/**
 * @file AppShell - Layout principal da aplicação
 * @description Container principal com sidebar e header
 */

import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { type FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const AppShell: FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Page Content - Outlet para React Router */}
        <main className={cn('flex-1 overflow-auto p-6', 'bg-muted/30')}>
          <Outlet />
        </main>
      </div>

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};
