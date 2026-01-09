import type { Tutorial } from '../types';

export const pdvAdvancedTutorial: Tutorial = {
  id: 'pdv-advanced',
  name: 'PDV - Domine os Atalhos',
  description:
    'Torne-se um expert: aprenda todos os atalhos de teclado, venda produtos pesáveis com balança, aplique descontos por item e gerencie vendas em espera.',
  category: 'advanced',
  estimatedMinutes: 15,
  icon: 'Zap',
  prerequisites: ['pdv-basic'],
  tags: ['pdv', 'avançado', 'balança', 'cancelamento', 'atalhos', 'pesável', 'produtividade'],
  steps: [
    {
      id: 'adv-intro',
      title: '⚡ Turbine sua Produtividade!',
      description:
        'Você já sabe o básico. Agora vamos aprender recursos que vão te transformar em um operador expert: atalhos, balança, vendas em espera e muito mais!',
      placement: 'center',
      route: '/pdv',
    },
    {
      id: 'adv-shortcuts-intro',
      title: 'Atalhos de Teclado',
      description:
        'Operadores experientes usam o teclado para tudo. Vamos conhecer os atalhos mais importantes do PDV.',
      placement: 'center',
    },
    {
      id: 'adv-shortcut-f2',
      title: '⌨️ F2 - Buscar Produto',
      description:
        'A qualquer momento, pressione F2 para focar instantaneamente na busca. Não precisa usar o mouse!',
      target: '[data-tutorial="product-search"]',
      placement: 'bottom',
      hotkey: 'F2',
    },
    {
      id: 'adv-shortcut-f4',
      title: '⌨️ F4 - Definir Quantidade',
      description:
        'Antes de adicionar um produto, pressione F4, digite a quantidade e Enter. Exemplo: F4 → 5 → Enter = adiciona 5 unidades do próximo produto.',
      target: '[data-tutorial="product-search"]',
      placement: 'bottom',
      hotkey: 'F4',
    },
    {
      id: 'adv-shortcut-f6',
      title: '⌨️ F6 - Aplicar Desconto',
      description:
        'Aplica desconto na venda inteira ou no item selecionado. Você pode dar desconto em % ou valor fixo (R$). Sempre informe o motivo!',
      target: '[data-tutorial="discount-button"]',
      placement: 'top',
      hotkey: 'F6',
    },
    {
      id: 'adv-shortcut-f10',
      title: 'F10 - Finalizar Venda',
      description: 'Abre o modal de pagamento. Você pode usar Enter para confirmar dinheiro exato.',
      target: '[data-tutorial="finalize-button"]',
      placement: 'top',
      hotkey: 'F10',
    },
    {
      id: 'adv-shortcut-f12',
      title: 'F12 - Cancelar Item',
      description: 'Remove o item selecionado do carrinho. Será pedida confirmação.',
      target: '[data-tutorial="cart-items"]',
      placement: 'left',
      hotkey: 'F12',
    },
    {
      id: 'adv-shortcut-esc',
      title: '⌨️ ESC - Cancelar Venda',
      description:
        'Cancela toda a venda em andamento. O sistema pedirá confirmação antes de limpar o carrinho. Use com cuidado!',
      placement: 'center',
      hotkey: 'Escape',
    },
    {
      id: 'adv-weighted',
      title: '⚖️ Produtos Pesáveis',
      description:
        'Frutas, verduras, carnes e frios são vendidos por peso (KG). O sistema integra com a balança automaticamente para ler o peso ou você pode digitar manualmente.',
      placement: 'center',
    },
    {
      id: 'adv-weighted-search',
      title: '🍌 Buscar Produto Pesável',
      description:
        'Ao adicionar um produto pesável (identificado pelo ícone ⚖️), o sistema automaticamente pede o peso antes de adicionar ao carrinho.',
      target: '[data-tutorial="product-search"]',
      placement: 'bottom',
      action: 'type',
      actionData: 'banana',
    },
    {
      id: 'adv-weighted-scale',
      title: '⚖️ Leitura da Balança',
      description:
        'Se a balança estiver configurada (em Configurações > Hardware), o peso é lido automaticamente. Caso contrário, digite o peso em KG (ex: 0.500 para 500g).',
      target: '[data-tutorial="weight-input"]',
      placement: 'bottom',
    },
    {
      id: 'adv-weighted-calc',
      title: '🧮 Cálculo Automático',
      description:
        'O valor é calculado automaticamente: Peso × Preço/KG = Subtotal. Exemplo: 0.500 kg × R$ 5,00/kg = R$ 2,50. Confira sempre o subtotal!',
      target: '[data-tutorial="cart-item-subtotal"]',
      placement: 'left',
    },
    {
      id: 'adv-barcode-weighted',
      title: '🏷️ Código de Barras com Peso',
      description:
        'Códigos que começam com "2" são especiais: o peso já vem embutido! Formato: 2PPPPP XXXXX C (P=produto, X=peso, C=dígito). A balança da loja imprime essas etiquetas.',
      placement: 'center',
    },
    {
      id: 'adv-discount-item',
      title: 'Desconto por Item',
      description:
        'Selecione um item no carrinho e pressione F6. O desconto será aplicado apenas naquele item, não na venda toda.',
      target: '[data-tutorial="cart-items"]',
      placement: 'left',
      hotkey: 'F6',
    },
    {
      id: 'adv-cancel-sale',
      title: 'Cancelar Venda Finalizada',
      description:
        'Se precisar cancelar uma venda já finalizada, vá em Relatórios > Vendas, encontre a venda e clique em Cancelar. Apenas gerentes podem fazer isso.',
      placement: 'center',
    },
    {
      id: 'adv-customer',
      title: 'Identificar Cliente',
      description:
        'Clique em "Cliente" para associar a venda a um cliente cadastrado. Útil para histórico e fidelização.',
      target: '[data-tutorial="customer-button"]',
      placement: 'top',
    },
    {
      id: 'adv-hold-sale',
      title: '⏸️ Segurar Venda (F8)',
      description:
        'Cliente esqueceu algo? Pressione F8 para "pausar" a venda atual e atender outro cliente. A venda fica salva para recuperar depois!',
      target: '[data-tutorial="hold-button"]',
      placement: 'top',
      hotkey: 'F8',
    },
    {
      id: 'adv-recover-sale',
      title: '▶️ Recuperar Venda (F9)',
      description:
        'Pressione F9 para ver todas as vendas em espera e recuperar a que deseja finalizar. As vendas ficam salvas apenas durante a sessão de caixa atual.',
      target: '[data-tutorial="recover-button"]',
      placement: 'top',
      hotkey: 'F9',
    },
    {
      id: 'adv-done',
      title: '🏆 Você é um Expert!',
      description:
        'Parabéns! Agora você domina todos os recursos do PDV. Use os atalhos para atender mais rápido e com mais eficiência. Boas vendas!',
      placement: 'center',
    },
  ],
};
