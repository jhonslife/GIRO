/**
 * @file NumPad.tsx - Componente de teclado numérico para PDV
 *
 * Touch-friendly numeric keypad for quantity/price input
 * Minimum touch target: 44x44px (WCAG 2.1)
 */

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, Delete } from 'lucide-react';
import { useCallback } from 'react';

interface NumPadProps {
  value: string;
  onChange: (value: string) => void;
  onConfirm?: (value: number) => void;
  label?: string;
  maxLength?: number;
  allowDecimal?: boolean;
  decimalPlaces?: number;
  className?: string;
}

export function NumPad({
  value,
  onChange,
  onConfirm,
  label = 'Valor',
  maxLength = 10,
  allowDecimal = true,
  decimalPlaces = 3,
  className,
}: NumPadProps) {
  const handleNumber = useCallback(
    (num: string) => {
      if (value.length >= maxLength) return;

      // Prevent multiple decimals
      if (num === '.' && value.includes('.')) return;

      // Prevent starting with decimal
      if (num === '.' && value === '') {
        onChange('0.');
        return;
      }

      // Limit decimal places
      if (value.includes('.')) {
        const decimals = value.split('.')[1];
        if (decimals && decimals.length >= decimalPlaces) return;
      }

      onChange(value + num);
    },
    [value, onChange, maxLength, decimalPlaces]
  );

  const handleBackspace = useCallback(() => {
    onChange(value.slice(0, -1));
  }, [value, onChange]);

  const handleClear = useCallback(() => {
    onChange('');
  }, [onChange]);

  const handleConfirm = useCallback(() => {
    const numValue = parseFloat(value) || 0;
    onConfirm?.(numValue);
  }, [value, onConfirm]);

  const displayValue = value || '0';

  return (
    <div className={cn('flex flex-col gap-4 p-4 bg-card rounded-xl', className)}>
      {/* Display */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <div className="bg-muted rounded-lg px-4 py-3">
          <span className="text-3xl font-bold font-mono tabular-nums">{displayValue}</span>
        </div>
      </div>

      {/* Keypad Grid */}
      <div className="grid grid-cols-3 gap-2">
        {/* Row 1 */}
        <NumKey value="7" onClick={handleNumber} />
        <NumKey value="8" onClick={handleNumber} />
        <NumKey value="9" onClick={handleNumber} />

        {/* Row 2 */}
        <NumKey value="4" onClick={handleNumber} />
        <NumKey value="5" onClick={handleNumber} />
        <NumKey value="6" onClick={handleNumber} />

        {/* Row 3 */}
        <NumKey value="1" onClick={handleNumber} />
        <NumKey value="2" onClick={handleNumber} />
        <NumKey value="3" onClick={handleNumber} />

        {/* Row 4 */}
        <NumKey value="0" onClick={handleNumber} />
        {allowDecimal ? (
          <NumKey value="." onClick={handleNumber} />
        ) : (
          <NumKey value="00" onClick={() => handleNumber('00')} />
        )}
        <Button
          variant="outline"
          size="lg"
          className="h-14 text-xl"
          onClick={handleBackspace}
          aria-label="Apagar"
        >
          <Delete className="w-6 h-6" />
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="lg" className="h-12" onClick={handleClear}>
          Limpar
        </Button>
        <Button
          variant="default"
          size="lg"
          className="h-12 bg-primary hover:bg-primary/90"
          onClick={handleConfirm}
          disabled={!value}
        >
          <Check className="w-5 h-5 mr-2" />
          Confirmar
        </Button>
      </div>
    </div>
  );
}

interface NumKeyProps {
  value: string;
  onClick: (value: string) => void;
}

function NumKey({ value, onClick }: NumKeyProps) {
  return (
    <Button
      variant="secondary"
      size="lg"
      className="h-14 text-xl font-semibold hover:bg-secondary/80 active:scale-95 transition-transform"
      onClick={() => onClick(value)}
    >
      {value}
    </Button>
  );
}

export default NumPad;
