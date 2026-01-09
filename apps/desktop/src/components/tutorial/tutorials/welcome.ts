import type { Tutorial } from '../types';

export const welcomeTutorial: Tutorial = {
  id: 'welcome',
  name: 'Bem-vindo ao GIRO',
  description:
    'Conheça a interface do sistema e aprenda a navegar pelas principais funcionalidades. Tour completo de 5 minutos.',
  category: 'getting-started',
  estimatedMinutes: 5,
  icon: 'Sparkles',
  tags: ['início', 'introdução', 'básico', 'primeiro acesso', 'navegação', 'menu'],
  steps: [
    {
      id: 'welcome-intro',
      title: '🎉 Bem-vindo ao GIRO!',
      description:
        'Este tutorial vai te guiar pelos principais recursos do sistema. Você aprenderá a fazer vendas, gerenciar produtos e muito mais. Vamos começar?',
      placement: 'center',
      skippable: true,
    },
    {
      id: 'welcome-sidebar',
      title: 'Menu de Navegação',
      description:
        'Este é o menu principal. Aqui você encontra todas as funcionalidades do sistema organizadas por categoria. Use as teclas de atalho para navegar mais rápido!',
      target: '[data-tutorial="sidebar"]',
      placement: 'right',
      hotkey: 'Alt+M',
    },
    {
      id: 'welcome-pdv',
      title: '🛒 Ponto de Venda (PDV)',
      description:
        'O coração do sistema! Aqui você realiza vendas, busca produtos por nome ou código de barras, e finaliza com diferentes formas de pagamento. Use o atalho F2 para buscar rapidamente.',
      target: '[data-tutorial="nav-pdv"]',
      placement: 'right',
      hotkey: 'Ctrl+1',
    },
    {
      id: 'welcome-products',
      title: '📦 Gestão de Produtos',
      description:
        'Cadastre novos produtos, defina preços de custo e venda, organize por categorias e acompanhe a margem de lucro automaticamente.',
      target: '[data-tutorial="nav-products"]',
      placement: 'right',
    },
    {
      id: 'welcome-stock',
      title: '📊 Controle de Estoque',
      description:
        'Registre entradas de mercadorias, faça ajustes de inventário e monitore produtos com estoque baixo ou próximos do vencimento.',
      target: '[data-tutorial="nav-stock"]',
      placement: 'right',
    },
    {
      id: 'welcome-cash',
      title: '💰 Controle de Caixa',
      description:
        'Abra o caixa no início do dia com o fundo de troco, registre sangrias quando necessário, e feche ao final conferindo os valores.',
      target: '[data-tutorial="nav-cash"]',
      placement: 'right',
    },
    {
      id: 'welcome-reports',
      title: '📈 Relatórios',
      description:
        'Analise vendas por período, veja produtos mais vendidos, acompanhe o financeiro e exporte para Excel, CSV ou PDF.',
      target: '[data-tutorial="nav-reports"]',
      placement: 'right',
    },
    {
      id: 'welcome-user',
      title: 'Seu Perfil',
      description:
        'Aqui você vê quem está logado e pode sair do sistema. Cada funcionário tem seu próprio PIN de acesso.',
      target: '[data-tutorial="user-menu"]',
      placement: 'bottom',
    },
    {
      id: 'welcome-help',
      title: 'Ajuda a Qualquer Momento',
      description:
        'Clique neste botão ou pressione F1 para acessar tutoriais e ajuda a qualquer momento. Você pode refazer este tour quando quiser!',
      target: '[data-tutorial="help-button"]',
      placement: 'left',
      hotkey: 'F1',
    },
    {
      id: 'welcome-done',
      title: '✅ Tutorial Concluído!',
      description:
        'Você completou o tour inicial! Agora recomendamos fazer o tutorial "PDV Básico" para aprender a fazer sua primeira venda. Bom trabalho!',
      placement: 'center',
    },
  ],
};
