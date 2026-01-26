/**
 * Testes para componentes Enterprise
 * @vitest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock do Tauri
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

import { StatusBadge } from '../StatusBadge';

describe('StatusBadge', () => {
  it('should render PLANNING status with correct color', () => {
    render(<StatusBadge status="PLANNING" />);
    const badge = screen.getByText('Planejamento');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-slate-100');
  });

  it('should render ACTIVE status with correct color', () => {
    render(<StatusBadge status="ACTIVE" />);
    const badge = screen.getByText('Ativo');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-green-100');
  });

  it('should render COMPLETED status with correct color', () => {
    render(<StatusBadge status="COMPLETED" />);
    const badge = screen.getByText('Concluído');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-blue-100');
  });

  it('should render SUSPENDED status with correct color', () => {
    render(<StatusBadge status="SUSPENDED" />);
    const badge = screen.getByText('Suspenso');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-yellow-100');
  });

  it('should render CANCELLED status with correct color', () => {
    render(<StatusBadge status="CANCELLED" />);
    const badge = screen.getByText('Cancelado');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-red-100');
  });

  it('should apply custom className', () => {
    render(<StatusBadge status="ACTIVE" className="custom-class" />);
    const badge = screen.getByText('Ativo');
    expect(badge).toHaveClass('custom-class');
  });
});

describe('StatusBadge - Request Statuses', () => {
  it('should render DRAFT status', () => {
    render(<StatusBadge status="DRAFT" type="request" />);
    expect(screen.getByText('Rascunho')).toBeInTheDocument();
  });

  it('should render PENDING status', () => {
    render(<StatusBadge status="PENDING" type="request" />);
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });

  it('should render APPROVED status', () => {
    render(<StatusBadge status="APPROVED" type="request" />);
    expect(screen.getByText('Aprovado')).toBeInTheDocument();
  });

  it('should render SEPARATING status', () => {
    render(<StatusBadge status="SEPARATING" type="request" />);
    expect(screen.getByText('Separando')).toBeInTheDocument();
  });

  it('should render DELIVERED status', () => {
    render(<StatusBadge status="DELIVERED" type="request" />);
    expect(screen.getByText('Entregue')).toBeInTheDocument();
  });

  it('should render REJECTED status', () => {
    render(<StatusBadge status="REJECTED" type="request" />);
    expect(screen.getByText('Rejeitado')).toBeInTheDocument();
  });
});

describe('StatusBadge - Transfer Statuses', () => {
  it('should render IN_TRANSIT status', () => {
    render(<StatusBadge status="IN_TRANSIT" type="transfer" />);
    expect(screen.getByText('Em Trânsito')).toBeInTheDocument();
  });

  it('should render RECEIVED status', () => {
    render(<StatusBadge status="RECEIVED" type="transfer" />);
    expect(screen.getByText('Recebido')).toBeInTheDocument();
  });
});

describe('StatusBadge - Priority Levels', () => {
  it('should render LOW priority', () => {
    render(<StatusBadge status="LOW" type="priority" />);
    const badge = screen.getByText('Baixa');
    expect(badge).toHaveClass('bg-slate-100');
  });

  it('should render NORMAL priority', () => {
    render(<StatusBadge status="NORMAL" type="priority" />);
    const badge = screen.getByText('Normal');
    expect(badge).toHaveClass('bg-blue-100');
  });

  it('should render HIGH priority', () => {
    render(<StatusBadge status="HIGH" type="priority" />);
    const badge = screen.getByText('Alta');
    expect(badge).toHaveClass('bg-orange-100');
  });

  it('should render URGENT priority', () => {
    render(<StatusBadge status="URGENT" type="priority" />);
    const badge = screen.getByText('Urgente');
    expect(badge).toHaveClass('bg-red-100');
  });
});
