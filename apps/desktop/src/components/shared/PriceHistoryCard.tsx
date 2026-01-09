/**
 * @file PriceHistoryCard - Componente de histórico de preços
 * @description Exibe o histórico de alterações de preço de um produto
 */

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  calculatePriceChange,
  formatPriceChange,
  usePriceHistoryByProduct,
} from '@/hooks/usePriceHistory';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowDown, ArrowUp, History, Loader2, Minus } from 'lucide-react';
import { type FC } from 'react';

interface PriceHistoryCardProps {
  productId: string;
  className?: string;
}

export const PriceHistoryCard: FC<PriceHistoryCardProps> = ({ productId, className }) => {
  const { data: history = [], isLoading, isError } = usePriceHistoryByProduct(productId);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico de Preços
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico de Preços
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Erro ao carregar histórico de preços.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Histórico de Preços
        </CardTitle>
        <CardDescription>
          {history.length > 0
            ? `${history.length} alteração${history.length > 1 ? 'ões' : ''} de preço registrada${
                history.length > 1 ? 's' : ''
              }`
            : 'Nenhuma alteração de preço registrada'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <History className="h-12 w-12 text-muted-foreground/30" />
            <p className="mt-2 text-sm text-muted-foreground">
              O preço deste produto ainda não foi alterado.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Preço Anterior</TableHead>
                <TableHead className="text-right">Novo Preço</TableHead>
                <TableHead className="text-center">Variação</TableHead>
                <TableHead>Motivo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item) => {
                const change = calculatePriceChange(item.oldPrice, item.newPrice);
                const isIncrease = change > 0;
                const isDecrease = change < 0;

                return (
                  <TableRow key={item.id}>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(item.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      R$ {item.oldPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      R$ {item.newPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={cn(
                          'flex items-center justify-center gap-1 w-20 mx-auto',
                          isIncrease && 'border-red-500/50 text-red-600 dark:text-red-400',
                          isDecrease && 'border-green-500/50 text-green-600 dark:text-green-400',
                          !isIncrease && !isDecrease && 'text-muted-foreground'
                        )}
                      >
                        {isIncrease ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : isDecrease ? (
                          <ArrowDown className="h-3 w-3" />
                        ) : (
                          <Minus className="h-3 w-3" />
                        )}
                        {formatPriceChange(item.oldPrice, item.newPrice)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {item.reason || '-'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
