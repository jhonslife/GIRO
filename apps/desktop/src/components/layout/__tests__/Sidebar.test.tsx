/**
 * @file Sidebar.test.tsx - Testes do componente Sidebar
 */

import { Sidebar } from '@/components/layout/Sidebar';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Wrapper com Router
const renderWithRouter = (ui: React.ReactElement, { route = '/dashboard' } = {}) => {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
};

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render sidebar', () => {
    renderWithRouter(<Sidebar />);

    expect(screen.getByRole('complementary')).toBeInTheDocument();
  });

  it('should render logo text', () => {
    renderWithRouter(<Sidebar />);

    expect(screen.getByText('GIRO')).toBeInTheDocument();
  });

  it('should render all navigation links', () => {
    renderWithRouter(<Sidebar />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('PDV')).toBeInTheDocument();
    expect(screen.getByText('Produtos')).toBeInTheDocument();
    expect(screen.getByText('Estoque')).toBeInTheDocument();
    expect(screen.getByText('Funcionários')).toBeInTheDocument();
    expect(screen.getByText('Caixa')).toBeInTheDocument();
    expect(screen.getByText('Relatórios')).toBeInTheDocument();
    expect(screen.getByText('Alertas')).toBeInTheDocument();
    expect(screen.getByText('Configurações')).toBeInTheDocument();
  });

  it('should highlight active link based on current route', () => {
    renderWithRouter(<Sidebar />, { route: '/products' });

    const produtosLink = screen.getByText('Produtos').closest('a');
    expect(produtosLink).toHaveClass('bg-primary');
  });

  it('should render collapse button', () => {
    renderWithRouter(<Sidebar />);

    expect(screen.getByText('Recolher')).toBeInTheDocument();
  });

  it('should collapse sidebar when button is clicked', () => {
    renderWithRouter(<Sidebar />);

    const collapseButton = screen.getByText('Recolher').closest('button');
    fireEvent.click(collapseButton!);

    // After collapse, "Recolher" text should not be visible
    expect(screen.queryByText('Recolher')).not.toBeInTheDocument();
  });

  it('should hide logo text when collapsed', () => {
    renderWithRouter(<Sidebar />);

    const collapseButton = screen.getByText('Recolher').closest('button');
    fireEvent.click(collapseButton!);

    expect(screen.queryByText('GIRO')).not.toBeInTheDocument();
  });

  it('should expand sidebar when expand button is clicked', () => {
    renderWithRouter(<Sidebar />);

    // Collapse first
    const collapseButton = screen.getByText('Recolher').closest('button');
    fireEvent.click(collapseButton!);

    // Find expand button (has ChevronRight icon)
    const expandButton = screen.getByRole('button', { name: '' });
    fireEvent.click(expandButton);

    // Should show logo text again
    expect(screen.getByText('GIRO')).toBeInTheDocument();
  });
});

describe('Sidebar Navigation', () => {
  it('should have correct href for each link', () => {
    renderWithRouter(<Sidebar />);

    const dashboardLink = screen.getByText('Dashboard').closest('a');
    const pdvLink = screen.getByText('PDV').closest('a');
    const settingsLink = screen.getByText('Configurações').closest('a');

    expect(dashboardLink).toHaveAttribute('href', '/dashboard');
    expect(pdvLink).toHaveAttribute('href', '/pdv');
    expect(settingsLink).toHaveAttribute('href', '/settings');
  });
});
