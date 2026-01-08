/**
 * @file NumericKeypad - Teclado numérico virtual
 * @description Para entrada de valores e quantidades no PDV
 */

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CornerDownLeft, Delete } from 'lucide-react';
import { type FC } from 'react';

interface NumericKeypadProps {
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  className?: string;
  showDecimal?: boolean;
}

export const NumericKeypad: FC<NumericKeypadProps> = ({
  value,
  onChange,
  onEnter,
  className,
  showDecimal = true,
}) => {
  const handleDigit = (digit: string) => {
    onChange(value + digit);
  };

  const handleDecimal = () => {
    if (!value.includes(',') && !value.includes('.')) {
      onChange(value + ',');
    }
  };

  const handleBackspace = () => {
    onChange(value.slice(0, -1));
  };

  const handleClear = () => {
    onChange('');
  };

  const buttonClass = 'h-14 text-xl font-medium';

  return (
    <div className={cn('grid grid-cols-3 gap-2', className)}>
      {/* Linha 1 */}
      <Button variant="outline" className={buttonClass} onClick={() => handleDigit('7')}>
        7
      </Button>
      <Button variant="outline" className={buttonClass} onClick={() => handleDigit('8')}>
        8
      </Button>
      <Button variant="outline" className={buttonClass} onClick={() => handleDigit('9')}>
        9
      </Button>

      {/* Linha 2 */}
      <Button variant="outline" className={buttonClass} onClick={() => handleDigit('4')}>
        4
      </Button>
      <Button variant="outline" className={buttonClass} onClick={() => handleDigit('5')}>
        5
      </Button>
      <Button variant="outline" className={buttonClass} onClick={() => handleDigit('6')}>
        6
      </Button>

      {/* Linha 3 */}
      <Button variant="outline" className={buttonClass} onClick={() => handleDigit('1')}>
        1
      </Button>
      <Button variant="outline" className={buttonClass} onClick={() => handleDigit('2')}>
        2
      </Button>
      <Button variant="outline" className={buttonClass} onClick={() => handleDigit('3')}>
        3
      </Button>

      {/* Linha 4 */}
      {showDecimal ? (
        <Button variant="outline" className={buttonClass} onClick={handleDecimal}>
          ,
        </Button>
      ) : (
        <Button variant="outline" className={buttonClass} onClick={handleClear}>
          C
        </Button>
      )}
      <Button variant="outline" className={buttonClass} onClick={() => handleDigit('0')}>
        0
      </Button>
      <Button variant="outline" className={buttonClass} onClick={handleBackspace}>
        <Delete className="h-5 w-5" />
      </Button>

      {/* Linha 5 - Enter */}
      {onEnter && (
        <Button className={cn(buttonClass, 'col-span-3 bg-primary')} onClick={onEnter}>
          <CornerDownLeft className="mr-2 h-5 w-5" />
          Confirmar
        </Button>
      )}
    </div>
  );
};
