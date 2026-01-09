import type { Tutorial } from '../types';

export const alertsTutorial: Tutorial = {
  id: 'alerts',
  name: '🔔 Alertas e Notificações',
  description:
    'O sistema monitora estoque baixo, validades e diferenças de caixa automaticamente. Nunca mais seja pego de surpresa!',
  category: 'advanced',
  estimatedMinutes: 5,
  icon: 'Bell',
  tags: ['alertas', 'notificações', 'estoque baixo', 'validade', 'automático'],
  steps: [
    {
      id: 'alerts-intro',
      title: '🔔 Alertas Inteligentes',
      description:
        'Seu assistente de monitoramento! O sistema vigia estoque, validades e caixa 24h. Quando algo precisa de atenção, você é avisado na hora.',
      placement: 'center',
      route: '/alerts',
    },
    {
      id: 'alerts-list',
      title: '📬 Central de Alertas',
      description:
        'Todos os alertas em um só lugar! Organizados por prioridade: 🔴 Crítico (agir agora), 🟡 Atenção (agir em breve), 🟢 Informativo (acompanhar).',
      target: '[data-tutorial="alerts-list"]',
      placement: 'bottom',
    },
    {
      id: 'alerts-badge',
      title: '🟢 Badge de Alertas',
      description:
        'O sininho no topo da tela mostra quantos alertas não lidos existem. Número vermelho = atenção necessária! Clique para ver o resumo rápido.',
      target: '[data-tutorial="alerts-badge"]',
      placement: 'left',
    },
    {
      id: 'alerts-types',
      title: '📦 Tipos de Alertas',
      description:
        'O sistema gera 3 tipos principais: 📉 Estoque Baixo (produto acabando), 📆 Validade Próxima (produto vencendo), 💰 Diferença de Caixa (dinheiro não bate).',
      placement: 'center',
    },
    {
      id: 'alerts-low-stock',
      title: '📉 Estoque Baixo',
      description:
        'Quando um produto atinge ou fica abaixo do estoque mínimo (configurado em cada produto), o alerta aparece aqui. Hora de fazer pedido ao fornecedor!',
      target: '[data-tutorial="alert-low-stock"]',
      placement: 'right',
    },
    {
      id: 'alerts-expiration',
      title: '📆 Produtos Vencendo',
      description:
        'Alertas são gerados 7 dias antes do vencimento (você pode alterar isso). Tempo de colocar em promoção ou devolver ao fornecedor antes que vire prejuízo!',
      target: '[data-tutorial="alert-expiration"]',
      placement: 'right',
    },
    {
      id: 'alerts-cash-diff',
      title: '💰 Diferença de Caixa',
      description:
        'Se o fechamento de caixa tiver diferença (faltou ou sobrou dinheiro), um alerta é criado automaticamente. Investigue com o operador responsável!',
      target: '[data-tutorial="alert-cash-diff"]',
      placement: 'right',
    },
    {
      id: 'alerts-action',
      title: '👉 Agir no Alerta',
      description:
        'Clique em qualquer alerta para ver os detalhes completos. Você pode: resolver (problema tratado), adiar (ver depois) ou ignorar (não relevante).',
      target: '[data-tutorial="alert-action"]',
      placement: 'left',
      action: 'click',
    },
    {
      id: 'alerts-resolve',
      title: '✅ Resolver Alerta',
      description:
        'Fez o pedido de compra? Tirou o produto vencido? Investigou a diferença? Marque como resolvido para limpar a lista e manter organizado.',
      target: '[data-tutorial="alert-resolve"]',
      placement: 'left',
    },
    {
      id: 'alerts-settings',
      title: '⚙️ Configurações de Alertas',
      description:
        'Em Configurações > Alertas você personaliza: quantos dias antes avisar sobre validade, estoque mínimo padrão, e se quer receber notificações sonoras.',
      target: '[data-tutorial="alerts-settings"]',
      placement: 'right',
    },
    {
      id: 'alerts-sound',
      title: '🔊 Som de Alertas',
      description:
        'Ative notificações sonoras para alertas críticos! Um "bip" discreto te avisa mesmo quando você não está olhando para a tela. Nunca perca um aviso importante.',
      target: '[data-tutorial="alerts-sound"]',
      placement: 'bottom',
    },
    {
      id: 'alerts-done',
      title: '🎉 Monitoramento Ativo!',
      description:
        'Pronto! O sistema está de olho em tudo para você. Dica: confira a central de alertas no início de cada turno - é a melhor forma de começar o dia informado!',
      placement: 'center',
    },
  ],
};
