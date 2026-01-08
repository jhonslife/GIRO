/**
 * @file PaymentModal - Modal de finalização de venda
 * @description Permite selecionar forma de pagamento e informar valor
 */

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCreateSale } from '@/hooks/useSales';
import { cn, formatCurrency } from '@/lib/utils';
import { usePDVStore, type PaymentMethod } from '@/stores/pdv-store';
import { ArrowLeft, Banknote, Check, CreditCard, Loader2, QrCode } from 'lucide-react';
import { useEffect, useRef, useState, type FC } from 'react';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  total: number;
}

export const PaymentModal: FC<PaymentModalProps> = ({ open, onClose, total }) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [amountPaid, setAmountPaid] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { items, discount } = usePDVStore();
  const createSale = useCreateSale();

  const amountPaidNum = parseFloat(amountPaid.replace(',', '.')) || 0;
  const change = amountPaidNum - total;
  const canFinalize =
    paymentMethod !== null && (paymentMethod !== 'CASH' || amountPaidNum >= total);

  useEffect(() => {
    if (open && paymentMethod === 'CASH') {
      // Foca no input quando selecionar dinheiro
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, paymentMethod]);

  const handleQuickAmount = (amount: number) => {
    setAmountPaid(amount.toString());
  };

  const handleExactAmount = () => {
    setAmountPaid(total.toFixed(2));
  };

  const handleFinalize = async () => {
    if (!canFinalize) return;

    setIsProcessing(true);

    try {
      if (!paymentMethod) return;

      await createSale.mutateAsync({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
        })),
        paymentMethod,
        discount,
        amountPaid: amountPaidNum,
      });

      onClose();
    } catch (error) {
      console.error('Erro ao finalizar venda:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPaymentSelection = () => (
    <div className="grid gap-4">
      <Button
        variant="outline"
        className="h-20 text-lg justify-start gap-4"
        onClick={() => setPaymentMethod('CASH')}
      >
        <Banknote className="h-8 w-8 text-success" />
        <div className="text-left">
          <div className="font-semibold">Dinheiro</div>
          <div className="text-sm text-muted-foreground">Informe o valor recebido</div>
        </div>
      </Button>

      <Button
        variant="outline"
        className="h-20 text-lg justify-start gap-4"
        onClick={() => {
          setPaymentMethod('PIX');
          setAmountPaid(total.toFixed(2));
        }}
      >
        <QrCode className="h-8 w-8 text-info" />
        <div className="text-left">
          <div className="font-semibold">PIX</div>
          <div className="text-sm text-muted-foreground">Pagamento instantâneo</div>
        </div>
      </Button>

      <Button
        variant="outline"
        className="h-20 text-lg justify-start gap-4"
        onClick={() => {
          setPaymentMethod('CREDIT');
          setAmountPaid(total.toFixed(2));
        }}
      >
        <CreditCard className="h-8 w-8 text-primary" />
        <div className="text-left">
          <div className="font-semibold">Cartão de Crédito</div>
          <div className="text-sm text-muted-foreground">Parcelado ou à vista</div>
        </div>
      </Button>

      <Button
        variant="outline"
        className="h-20 text-lg justify-start gap-4"
        onClick={() => {
          setPaymentMethod('DEBIT');
          setAmountPaid(total.toFixed(2));
        }}
      >
        <CreditCard className="h-8 w-8 text-secondary-foreground" />
        <div className="text-left">
          <div className="font-semibold">Cartão de Débito</div>
          <div className="text-sm text-muted-foreground">Débito na hora</div>
        </div>
      </Button>
    </div>
  );

  const renderCashPayment = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => setPaymentMethod(null)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Banknote className="h-5 w-5 text-success" />
          <span className="font-semibold">Pagamento em Dinheiro</span>
        </div>
      </div>

      <div className="grid gap-4">
        <div>
          <Label htmlFor="amount">Valor Recebido</Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">
              R$
            </span>
            <Input
              ref={inputRef}
              id="amount"
              type="text"
              inputMode="decimal"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              className="h-14 pl-10 text-2xl text-money font-bold"
              placeholder="0,00"
            />
          </div>
        </div>

        {/* Botões de valor rápido */}
        <div className="grid grid-cols-4 gap-2">
          <Button variant="outline" onClick={() => handleQuickAmount(10)}>
            R$ 10
          </Button>
          <Button variant="outline" onClick={() => handleQuickAmount(20)}>
            R$ 20
          </Button>
          <Button variant="outline" onClick={() => handleQuickAmount(50)}>
            R$ 50
          </Button>
          <Button variant="outline" onClick={() => handleQuickAmount(100)}>
            R$ 100
          </Button>
        </div>

        <Button variant="secondary" className="w-full" onClick={handleExactAmount}>
          Valor Exato ({formatCurrency(total)})
        </Button>
      </div>

      <Separator />

      {/* Resumo */}
      <div className="space-y-2 rounded-lg bg-muted p-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total</span>
          <span className="text-money font-medium">{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Recebido</span>
          <span className="text-money font-medium">{formatCurrency(amountPaidNum)}</span>
        </div>
        <Separator />
        <div className="flex justify-between text-lg">
          <span className="font-semibold">Troco</span>
          <span
            className={cn(
              'text-money font-bold',
              change >= 0 ? 'text-success' : 'text-destructive'
            )}
          >
            {formatCurrency(Math.max(0, change))}
          </span>
        </div>
      </div>
    </div>
  );

  const renderOtherPayment = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => setPaymentMethod(null)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          {paymentMethod === 'PIX' && <QrCode className="h-5 w-5 text-info" />}
          {paymentMethod === 'CREDIT' && <CreditCard className="h-5 w-5 text-primary" />}
          {paymentMethod === 'DEBIT' && <CreditCard className="h-5 w-5" />}
          <span className="font-semibold">
            {paymentMethod === 'PIX' && 'Pagamento via PIX'}
            {paymentMethod === 'CREDIT' && 'Cartão de Crédito'}
            {paymentMethod === 'DEBIT' && 'Cartão de Débito'}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 py-8">
        <div className="text-4xl font-bold text-money text-primary">{formatCurrency(total)}</div>
        <p className="text-center text-muted-foreground">
          {paymentMethod === 'PIX' && 'Aguarde o cliente escanear o QR Code ou digitar a chave PIX'}
          {(paymentMethod === 'CREDIT' || paymentMethod === 'DEBIT') &&
            'Processe o pagamento na maquininha'}
        </p>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">Finalizar Venda</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {!paymentMethod && renderPaymentSelection()}
          {paymentMethod === 'CASH' && renderCashPayment()}
          {paymentMethod && paymentMethod !== 'CASH' && renderOtherPayment()}
        </div>

        {paymentMethod && (
          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancelar
            </Button>
            <Button
              onClick={handleFinalize}
              disabled={!canFinalize || isProcessing}
              className="gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Confirmar Pagamento
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
