/**
 * @file SaleReceipt.tsx - Componente de preview de cupom fiscal
 *
 * Simula a aparência de um cupom de impressora térmica
 * Usado para preview antes de imprimir
 */

import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface ReceiptItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  unit: string;
}

interface SaleReceiptProps {
  companyName?: string;
  companyAddress?: string;
  employeeName?: string;
  items: ReceiptItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  amountPaid: number;
  change: number;
  date?: Date;
  saleId?: string;
  className?: string;
}

export function SaleReceipt({
  companyName = 'Mercearia Exemplo',
  companyAddress,
  employeeName,
  items,
  subtotal,
  discount,
  total,
  paymentMethod,
  amountPaid,
  change,
  date = new Date(),
  saleId,
  className,
}: SaleReceiptProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatDate = (d: Date) =>
    d.toLocaleDateString('pt-BR') +
    ' ' +
    d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const paymentMethodLabel: Record<string, string> = {
    CASH: 'Dinheiro',
    PIX: 'PIX',
    CREDIT: 'Cartão de Crédito',
    DEBIT: 'Cartão de Débito',
    OTHER: 'Outro',
  };

  return (
    <div
      className={cn(
        'bg-white text-black font-mono text-xs p-4 max-w-[300px] mx-auto',
        'border border-dashed border-neutral-300 rounded',
        'shadow-sm',
        className
      )}
      style={{ fontFamily: "'Courier New', Courier, monospace" }}
    >
      {/* Header */}
      <div className="text-center mb-3">
        <h2 className="font-bold text-sm uppercase">{companyName}</h2>
        {companyAddress && <p className="text-[10px] text-neutral-600">{companyAddress}</p>}
        <p className="text-[10px] text-neutral-600 mt-1">{formatDate(date)}</p>
        {saleId && <p className="text-[10px] text-neutral-600">Venda #{saleId}</p>}
      </div>

      <Separator className="my-2 border-dashed" />

      {/* Items */}
      <div className="space-y-1">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col">
            <div className="flex justify-between">
              <span className="truncate max-w-[180px]">{item.name}</span>
            </div>
            <div className="flex justify-between text-[10px] text-neutral-600">
              <span>
                {item.quantity.toFixed(3)} {item.unit} x {formatCurrency(item.unitPrice)}
              </span>
              <span className="font-medium text-black">{formatCurrency(item.total)}</span>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-2 border-dashed" />

      {/* Totals */}
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-700">
            <span>Desconto</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-sm">
          <span>TOTAL</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <Separator className="my-2 border-dashed" />

      {/* Payment */}
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Forma de Pagamento</span>
          <span>{paymentMethodLabel[paymentMethod] || paymentMethod}</span>
        </div>
        <div className="flex justify-between">
          <span>Valor Pago</span>
          <span>{formatCurrency(amountPaid)}</span>
        </div>
        {change > 0 && (
          <div className="flex justify-between font-bold">
            <span>Troco</span>
            <span>{formatCurrency(change)}</span>
          </div>
        )}
      </div>

      <Separator className="my-2 border-dashed" />

      {/* Footer */}
      <div className="text-center text-[10px] text-neutral-600">
        {employeeName && <p>Operador: {employeeName}</p>}
        <p className="mt-2">Obrigado pela preferência!</p>
        <p>Volte sempre</p>
      </div>

      {/* Decorative bottom tear */}
      <div className="mt-3 h-2 bg-[linear-gradient(135deg,#fff_25%,transparent_25%),linear-gradient(225deg,#fff_25%,transparent_25%)] bg-[length:8px_8px] bg-repeat-x opacity-50" />
    </div>
  );
}

export default SaleReceipt;
