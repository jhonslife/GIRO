import type { Tutorial } from '../types';

export const reportsTutorial: Tutorial = {
  id: 'reports',
  name: 'Relatórios e Análises',
  description:
    'Aprenda a extrair insights do seu negócio: vendas por período, produtos mais vendidos, estoque, financeiro e muito mais.',
  category: 'management',
  estimatedMinutes: 8,
  icon: 'BarChart3',
  prerequisites: ['pdv-basic'],
  tags: ['relatórios', 'vendas', 'análise', 'exportar', 'gráficos', 'indicadores', 'excel', 'pdf'],
  steps: [
    {
      id: 'reports-intro',
      title: '📊 Inteligência para seu Negócio',
      description:
        'Relatórios são essenciais para tomar boas decisões. Vamos aprender a extrair informações valiosas das suas vendas e estoque!',
      placement: 'center',
      route: '/reports',
    },
    {
      id: 'reports-menu',
      title: '🗂️ Tipos de Relatórios',
      description:
        'Escolha o que deseja analisar: Vendas (o mais usado!), Estoque, Financeiro, Ranking de Produtos ou Desempenho de Funcionários.',
      target: '[data-tutorial="reports-menu"]',
      placement: 'bottom',
    },
    {
      id: 'reports-sales',
      title: '🛍️ Relatório de Vendas',
      description:
        'O mais utilizado! Analise vendas por período, vendedor, produto ou forma de pagamento. Descubra seus dias e horários de pico.',
      target: '[data-tutorial="reports-sales-link"]',
      placement: 'right',
      action: 'click',
      route: '/reports/sales',
    },
    {
      id: 'reports-period',
      title: '📅 Selecionar Período',
      description:
        'Escolha períodos prontos (Hoje, Esta Semana, Este Mês) ou defina datas personalizadas para análises específicas.',
      target: '[data-tutorial="reports-period"]',
      placement: 'bottom',
    },
    {
      id: 'reports-filters',
      title: '🔍 Filtros Avançados',
      description:
        'Refine sua análise: filtre por vendedor específico, forma de pagamento, categoria de produto ou até um produto individual.',
      target: '[data-tutorial="reports-filters"]',
      placement: 'bottom',
    },
    {
      id: 'reports-generate',
      title: '▶️ Gerar Relatório',
      description:
        'Clique em "Gerar" para processar os dados. Períodos longos podem levar alguns segundos - aguarde a conclusão!',
      target: '[data-tutorial="reports-generate"]',
      placement: 'right',
      action: 'click',
    },
    {
      id: 'reports-summary',
      title: '🎯 Indicadores-Chave',
      description:
        'No topo, os números mais importantes: Total vendido, Ticket médio (valor por venda), Quantidade de vendas e Comparativo com período anterior.',
      target: '[data-tutorial="reports-summary"]',
      placement: 'bottom',
    },
    {
      id: 'reports-chart',
      title: '📊 Gráficos Interativos',
      description:
        'Visualize a evolução das vendas em gráficos de linha, barra ou pizza. Passe o mouse sobre os pontos para ver os valores detalhados.',
      target: '[data-tutorial="reports-chart"]',
      placement: 'bottom',
    },
    {
      id: 'reports-table',
      title: '📝 Dados Detalhados',
      description:
        'A tabela mostra cada venda do período. Clique em uma linha para expandir e ver todos os itens vendidos naquela transação.',
      target: '[data-tutorial="reports-table"]',
      placement: 'top',
    },
    {
      id: 'reports-export',
      title: '📤 Exportar Dados',
      description:
        'Exporte para Excel (.xlsx), CSV ou PDF. Perfeito para contabilidade, análises externas ou simplesmente arquivar.',
      target: '[data-tutorial="reports-export"]',
      placement: 'left',
    },
    {
      id: 'reports-print',
      title: '🖨️ Imprimir Relatório',
      description:
        'Imprima diretamente para arquivo físico. O layout é otimizado para papel A4 em retrato ou paisagem.',
      target: '[data-tutorial="reports-print"]',
      placement: 'left',
    },
    {
      id: 'reports-stock',
      title: '📦 Relatório de Estoque',
      description:
        'Veja a posição atual, valor total em estoque, produtos abaixo do mínimo e a curva ABC (mais importantes).',
      target: '[data-tutorial="reports-stock-link"]',
      placement: 'right',
    },
    {
      id: 'reports-financial',
      title: '💰 Relatório Financeiro',
      description:
        'Acompanhe o fluxo de caixa: receitas, despesas, lucro bruto e líquido. Essencial para a saúde financeira do negócio!',
      target: '[data-tutorial="reports-financial-link"]',
      placement: 'right',
    },
    {
      id: 'reports-done',
      title: '✅ Informação é Poder!',
      description:
        'Você aprendeu a gerar e analisar relatórios. Consulte-os regularmente para tomar decisões mais inteligentes sobre seu negócio!',
      placement: 'center',
    },
  ],
};
