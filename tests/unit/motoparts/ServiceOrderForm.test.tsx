import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import ServiceOrderForm from '../../../apps/desktop/src/components/motoparts/ServiceOrderForm';

describe('ServiceOrderForm', () => {
  it('renders form and allows adding an item', () => {
    render(<ServiceOrderForm onSave={vi.fn as any} />);

    // Check basic fields
    expect(screen.getByLabelText(/Cliente/i)).toBeTruthy();
    expect(screen.getByLabelText(/Veículo/i)).toBeTruthy();
    expect(screen.getByText(/Itens/i)).toBeTruthy();

    // Add item button
    const addButton = screen.getByRole('button', { name: /Adicionar item/i });
    fireEvent.click(addButton);

    // After adding an item, the remove button should be present
    expect(screen.getByRole('button', { name: /Remover/i })).toBeTruthy();
  });
});
