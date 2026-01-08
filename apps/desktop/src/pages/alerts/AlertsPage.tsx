/**
 * @file AlertsPage - Central de Alertas
 * @description Lista de alertas do sistema (estoque baixo, vencimentos, etc)
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Bell, BellOff, Calendar, Check, Clock, TrendingDown, X } from 'lucide-react';
import { type FC, useState } from 'react';

type AlertType = 'LOW_STOCK' | 'EXPIRATION' | 'SYSTEM';
type AlertPriority = 'HIGH' | 'MEDIUM' | 'LOW';

interface Alert {
  id: string;
  type: AlertType;
  priority: AlertPriority;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
  productId?: string;
}

const priorityColors: Record<AlertPriority, string> = {
  HIGH: 'bg-destructive/10 text-destructive border-destructive/30',
  MEDIUM: 'bg-warning/10 text-warning border-warning/30',
  LOW: 'bg-muted text-muted-foreground border-muted',
};

const typeIcons: Record<AlertType, React.ReactNode> = {
  LOW_STOCK: <TrendingDown className="h-5 w-5" />,
  EXPIRATION: <Calendar className="h-5 w-5" />,
  SYSTEM: <Bell className="h-5 w-5" />,
};

// Mock data
const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'LOW_STOCK',
    priority: 'HIGH',
    title: 'Arroz Tio João 5kg - Estoque Crítico',
    description: 'Apenas 3 unidades em estoque. Mínimo configurado: 10 unidades.',
    createdAt: '2025-01-06T14:00:00',
    read: false,
    productId: '1',
  },
  {
    id: '2',
    type: 'EXPIRATION',
    priority: 'HIGH',
    title: 'Leite Integral - Vencimento Próximo',
    description: '15 unidades vencem em 3 dias (09/01/2025).',
    createdAt: '2025-01-06T10:00:00',
    read: false,
    productId: '2',
  },
  {
    id: '3',
    type: 'LOW_STOCK',
    priority: 'MEDIUM',
    title: 'Café Pilão 500g - Estoque Baixo',
    description: 'Apenas 5 unidades em estoque. Mínimo configurado: 8 unidades.',
    createdAt: '2025-01-05T16:30:00',
    read: true,
    productId: '3',
  },
  {
    id: '4',
    type: 'EXPIRATION',
    priority: 'MEDIUM',
    title: 'Iogurte Natural - Vencimento em 7 dias',
    description: '8 unidades vencem em 13/01/2025.',
    createdAt: '2025-01-05T09:00:00',
    read: true,
    productId: '4',
  },
  {
    id: '5',
    type: 'SYSTEM',
    priority: 'LOW',
    title: 'Backup automático realizado',
    description: 'O backup diário foi concluído com sucesso às 03:00.',
    createdAt: '2025-01-06T03:00:00',
    read: true,
  },
];

export const AlertsPage: FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = alerts.filter((a) => !a.read).length;
  const lowStockAlerts = alerts.filter((a) => a.type === 'LOW_STOCK');
  const expirationAlerts = alerts.filter((a) => a.type === 'EXPIRATION');

  const filteredAlerts = filter === 'unread' ? alerts.filter((a) => !a.read) : alerts;

  const markAsRead = (id: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, read: true } : alert)));
  };

  const markAllAsRead = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, read: true })));
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Central de Alertas</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? (
              <span className="text-destructive font-medium">{unreadCount} alertas não lidos</span>
            ) : (
              'Todos os alertas foram visualizados'
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <Check className="mr-2 h-4 w-4" />
            Marcar todos como lidos
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className={lowStockAlerts.some((a) => !a.read) ? 'border-warning' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
            <TrendingDown className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              {lowStockAlerts.filter((a) => !a.read).length} não lidos
            </p>
          </CardContent>
        </Card>

        <Card className={expirationAlerts.some((a) => !a.read) ? 'border-destructive' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencimentos</CardTitle>
            <Calendar className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expirationAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              {expirationAlerts.filter((a) => !a.read).length} não lidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alertas</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
            <p className="text-xs text-muted-foreground">nos últimos 7 dias</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Alertas Recentes</CardTitle>
              <CardDescription>Clique em um alerta para marcar como lido</CardDescription>
            </div>
            <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread')}>
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="unread">
                  Não lidos
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 justify-center">
                      {unreadCount}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12">
              <BellOff className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium">Nenhum alerta</p>
              <p className="text-muted-foreground">
                {filter === 'unread' ? 'Todos os alertas foram lidos' : 'Não há alertas no momento'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                    priorityColors[alert.priority]
                  } ${!alert.read ? 'ring-2 ring-primary/20' : 'opacity-75'}`}
                  onClick={() => markAsRead(alert.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && markAsRead(alert.id)}
                >
                  <div className="flex-shrink-0 mt-0.5">{typeIcons[alert.type]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{alert.title}</p>
                      {!alert.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                    <p className="text-sm opacity-80 mt-1">{alert.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs opacity-60">
                      <Clock className="h-3 w-3" />
                      <span>
                        {format(new Date(alert.createdAt), "dd/MM 'às' HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      dismissAlert(alert.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
