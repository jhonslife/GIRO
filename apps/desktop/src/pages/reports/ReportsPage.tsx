/**
 * @file ReportsPage - Hub de relatórios
 * @description Página central de acesso aos relatórios do sistema
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardStats } from '@/hooks/useDashboard';
import { formatCurrency } from '@/lib/formatters';
import { getMonthlySummary, type MonthlySalesSummary } from '@/lib/tauri';
import { useQuery } from '@tanstack/react-query';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Calendar,
  DollarSign,
  FileText,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react';
import { type FC } from 'react';
import { Link } from 'react-router-dom';

// ────────────────────────────────────────────────────────────────────────────
// REPORT CARDS
// ────────────────────────────────────────────────────────────────────────────

const REPORTS = [
  {
    id: 'sales',
    title: 'Relatório de Vendas',
    description: 'Análise detalhada de vendas por período, produto e vendedor',
    icon: ShoppingCart,
    href: '/reports/sales',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    id: 'financial',
    title: 'Relatório Financeiro',
    description: 'Fluxo de caixa, receitas, despesas e lucro líquido',
    icon: DollarSign,
    href: '/reports/financial',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    id: 'stock',
    title: 'Relatório de Estoque',
    description: 'Posição de estoque, movimentações e valorização',
    icon: Package,
    href: '/reports/stock',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    id: 'products',
    title: 'Ranking de Produtos',
    description: 'Produtos mais vendidos, margem e giro de estoque',
    icon: TrendingUp,
    href: '/reports/products',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    id: 'employees',
    title: 'Desempenho de Funcionários',
    description: 'Vendas por funcionário, metas e comissões',
    icon: Users,
    href: '/reports/employees',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
  },
  {
    id: 'alerts',
    title: 'Relatório de Alertas',
    description: 'Produtos vencidos, estoque baixo e anomalias',
    icon: AlertTriangle,
    href: '/reports/alerts',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
];

// ────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ────────────────────────────────────────────────────────────────────────────

export const ReportsPage: FC = () => {
  const { data: stats } = useDashboardStats();

  // Buscar estatísticas do mês atual
  const currentYearMonth = new Date().toISOString().slice(0, 7); // Format: YYYY-MM
  const { data: monthlyStats } = useQuery<MonthlySalesSummary>({
    queryKey: ['monthly-summary', currentYearMonth],
    queryFn: () => getMonthlySummary(currentYearMonth),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const todayRevenue = stats?.todayRevenue || 0;
  const averageTicket = stats?.averageTicket || 0;
  const todayCount = stats?.todaySales || 0;
  const lowStock = stats?.lowStockCount || 0;
  const monthlyRevenue = monthlyStats?.totalAmount || 0;
  const monthlySalesCount = monthlyStats?.totalSales || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground">Análises e insights para tomar decisões informadas</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Vendas Hoje</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(todayRevenue)}</div>
            <p className="text-xs text-muted-foreground">{todayCount} vendas realizadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Vendas Mês</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(monthlyRevenue)}</div>
            <p className="text-xs text-muted-foreground">{monthlySalesCount} vendas no mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averageTicket)}</div>
            <p className="text-xs text-muted-foreground">Baseado em vendas de hoje</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Produtos Baixos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${lowStock > 0 ? 'text-warning' : ''}`}>
              {lowStock}
            </div>
            <p className="text-xs text-muted-foreground">Precisam reposição</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {REPORTS.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.id} className="group hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${report.bgColor}`}>
                    <Icon className={`h-6 w-6 ${report.color}`} />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    asChild
                  >
                    <Link to={report.href}>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <CardTitle className="text-lg">{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link to={report.href}>
                    <FileText className="mr-2 h-4 w-4" />
                    Gerar Relatório
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
