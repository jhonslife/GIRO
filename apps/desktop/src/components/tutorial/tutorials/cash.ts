import type { Tutorial } from '../types';

export const cashTutorial: Tutorial = {
  id: 'cash',
  name: 'Controle de Caixa',
  description:
    'Domine o fluxo de caixa: abertura com fundo de troco, sangrias durante o dia e fechamento com conferência de valores.',
  category: 'operations',
  estimatedMinutes: 8,
  icon: 'Landmark',
  prerequisites: ['pdv-basic'],
  tags: ['caixa', 'sangria', 'suprimento', 'fechamento', 'abertura', 'conferência', 'troco'],
  steps: [
    {
      id: 'cash-intro',
      title: '💰 Controle Financeiro do Dia',
      description:
        'O controle de caixa garante que todo dinheiro esteja contabilizado corretamente. Vamos aprender o fluxo completo do início ao fim do expediente!',
      placement: 'center',
      route: '/cash',
    },
    {
      id: 'cash-status',
      title: '🟢 Status do Caixa',
      description:
        'O painel mostra se o caixa está ABERTO (verde) ou FECHADO (amarelo), quem abriu, o valor inicial e um resumo das movimentações do dia.',
      target: '[data-tutorial="cash-status"]',
      placement: 'bottom',
    },
    {
      id: 'cash-open',
      title: '🔓 Abrir Caixa',
      description:
        'No início do expediente, clique em "Abrir Caixa". Você informará o valor do fundo de troco (dinheiro para dar troco aos clientes).',
      target: '[data-tutorial="cash-open-button"]',
      placement: 'right',
      action: 'click',
    },
    {
      id: 'cash-open-value',
      title: '💵 Fundo de Troco',
      description:
        'Digite o valor em dinheiro que você está colocando no caixa (geralmente R$ 100 a R$ 200). Este valor NÃO é uma venda, é apenas para dar troco.',
      target: '[data-tutorial="cash-initial-value"]',
      placement: 'bottom',
      required: true,
    },
    {
      id: 'cash-open-confirm',
      title: '✅ Iniciar Sessão',
      description:
        'Clique em "Confirmar" para iniciar a sessão de caixa. A partir de agora você pode realizar vendas no PDV!',
      target: '[data-tutorial="cash-confirm-open"]',
      placement: 'top',
      action: 'click',
    },
    {
      id: 'cash-movements',
      title: '📊 Movimentações do Dia',
      description:
        'Acompanhe em tempo real: vendas realizadas (por forma de pagamento), sangrias feitas e suprimentos adicionados. Tudo registrado automaticamente!',
      target: '[data-tutorial="cash-movements"]',
      placement: 'bottom',
    },
    {
      id: 'cash-withdrawal',
      title: '💸 Sangria (Retirada)',
      description:
        'Quando acumular muito dinheiro no caixa, faça uma sangria para segurança. Clique em "Sangria" e informe o valor sendo retirado.',
      target: '[data-tutorial="cash-withdrawal-button"]',
      placement: 'right',
    },
    {
      id: 'cash-withdrawal-form',
      title: '📝 Registrar Sangria',
      description:
        'Informe o valor retirado e o destino (cofre, banco, etc.). Guarde o comprovante! Tudo fica registrado para auditoria.',
      target: '[data-tutorial="cash-withdrawal-form"]',
      placement: 'bottom',
    },
    {
      id: 'cash-supply',
      title: '💵 Suprimento (Entrada)',
      description:
        'Precisa adicionar mais dinheiro ao caixa (mais troco)? Use "Suprimento" para registrar a entrada corretamente.',
      target: '[data-tutorial="cash-supply-button"]',
      placement: 'right',
    },
    {
      id: 'cash-close',
      title: '🔒 Fechar Caixa',
      description:
        'No final do expediente, clique em "Fechar Caixa". Você fará a contagem física do dinheiro e o sistema comparará com o valor esperado.',
      target: '[data-tutorial="cash-close-button"]',
      placement: 'right',
      action: 'click',
    },
    {
      id: 'cash-close-count',
      title: '🧮 Contagem do Dinheiro',
      description:
        'O sistema mostra o VALOR ESPERADO (calculado automaticamente). Conte todo o dinheiro físico na gaveta e digite o VALOR CONTADO.',
      target: '[data-tutorial="cash-counted-value"]',
      placement: 'bottom',
    },
    {
      id: 'cash-close-diff',
      title: '⚖️ Diferença (Sobra/Falta)',
      description:
        'O sistema calcula: CONTADO - ESPERADO. Diferença positiva = sobra, negativa = falta. Se houver diferença, informe o possível motivo.',
      target: '[data-tutorial="cash-difference"]',
      placement: 'left',
    },
    {
      id: 'cash-close-confirm',
      title: '✅ Confirmar Fechamento',
      description:
        'Revise tudo e clique em "Fechar". Um relatório completo da sessão será gerado automaticamente para arquivo.',
      target: '[data-tutorial="cash-confirm-close"]',
      placement: 'top',
      action: 'click',
    },
    {
      id: 'cash-history',
      title: '📚 Histórico de Sessões',
      description:
        'Consulte sessões anteriores com todos os detalhes: quem operou, valores movimentados e diferenças registradas. Ótimo para auditoria!',
      target: '[data-tutorial="cash-history"]',
      placement: 'bottom',
    },
    {
      id: 'cash-done',
      title: '✅ Caixa Sob Controle!',
      description:
        'Você dominou o fluxo de caixa! Lembre-se: SEMPRE abra no início do dia e feche no final. Isso evita problemas e facilita a gestão financeira.',
      placement: 'center',
    },
  ],
};
