import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Ajuste o path conforme a estrutura do repo
import VehicleSelector from '../../../apps/desktop/src/components/motoparts/VehicleSelector';

describe('VehicleSelector', () => {
  it('renders placeholder and basic structure', () => {
    // Render apenas para garantir que o componente não quebre ao renderizar
    render((<VehicleSelector placeholder="Selecione o veículo" />) as any);
    // Procuramos por um elemento que represente o placeholder (ajuste conforme implementação)
    expect(screen.getByText(/Selecione o veículo/i)).toBeTruthy();
  });
});
