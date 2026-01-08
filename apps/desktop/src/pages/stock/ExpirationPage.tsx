/**
 * @file ExpirationPage - Controle de Validades
 * @description Página de monitoramento de produtos próximos ao vencimento
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { daysUntil, formatDate, formatExpirationRelative } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { AlertTriangle, ArrowLeft, Calendar, Clock } from 'lucide-react';
import { type FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock data
const mockExpirations = [
  {
    id: '1',
    productName: 'Iogurte Natural',
    lotNumber: 'L001',
    quantity: 15,
    expirationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    productName: 'Leite Integral',
    lotNumber: 'L002',
    quantity: 8,
    expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    productName: 'Queijo Minas',
    lotNumber: 'L003',
    quantity: 4,
    expirationDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: '4',
    productName: 'Presunto',
    lotNumber: 'L004',
    quantity: 12,
    expirationDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
  },
  {
    id: '5',
    productName: 'Margarina',
    lotNumber: 'L005',
    quantity: 6,
    expirationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

export const ExpirationPage: FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const getExpirationStatus = (date: Date) => {
    const days = daysUntil(date);
    if (days < 0)
      return { label: 'Vencido', variant: 'destructive' as const, color: 'text-destructive' };
    if (days <= 3)
      return { label: 'Crítico', variant: 'destructive' as const, color: 'text-destructive' };
    if (days <= 7) return { label: 'Urgente', variant: 'warning' as const, color: 'text-warning' };
    if (days <= 30)
      return { label: 'Atenção', variant: 'secondary' as const, color: 'text-muted-foreground' };
    return { label: 'OK', variant: 'default' as const, color: 'text-success' };
  };

  const stats = {
    expired: mockExpirations.filter((p) => daysUntil(p.expirationDate) < 0).length,
    critical: mockExpirations.filter(
      (p) => daysUntil(p.expirationDate) >= 0 && daysUntil(p.expirationDate) <= 3
    ).length,
    warning: mockExpirations.filter(
      (p) => daysUntil(p.expirationDate) > 3 && daysUntil(p.expirationDate) <= 7
    ).length,
  };

  const filteredItems = mockExpirations
    .filter((item) => {
      const days = daysUntil(item.expirationDate);
      if (filter === 'expired') return days < 0;
      if (filter === 'critical') return days >= 0 && days <= 3;
      if (filter === 'warning') return days > 3 && days <= 7;
      return true;
    })
    .sort((a, b) => a.expirationDate.getTime() - b.expirationDate.getTime());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/stock')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Controle de Validades</h1>
          <p className="text-muted-foreground">Monitore produtos próximos ao vencimento</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-destructive/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.expired}</div>
            <p className="text-xs text-muted-foreground">Retirar do estoque</p>
          </CardContent>
        </Card>
        <Card className="border-warning/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Críticos (3 dias)</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.critical}</div>
            <p className="text-xs text-muted-foreground">Vender com urgência</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Atenção (7 dias)</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.warning}</div>
            <p className="text-xs text-muted-foreground">Considerar promoção</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex justify-end">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="expired">Vencidos</SelectItem>
            <SelectItem value="critical">Críticos</SelectItem>
            <SelectItem value="warning">Atenção</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Lote</TableHead>
                <TableHead className="text-center">Quantidade</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => {
                const status = getExpirationStatus(item.expirationDate);
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell className="text-muted-foreground">{item.lotNumber}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell>
                      <div>
                        <p className={cn('font-medium', status.color)}>
                          {formatExpirationRelative(item.expirationDate)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(item.expirationDate)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
