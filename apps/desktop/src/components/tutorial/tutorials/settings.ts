import type { Tutorial } from '../types';

export const settingsTutorial: Tutorial = {
  id: 'settings',
  name: 'Configurações do Sistema',
  description:
    'Personalize o sistema para sua loja: dados da empresa, impressora térmica, balança, scanner e preferências gerais.',
  category: 'advanced',
  estimatedMinutes: 10,
  icon: 'Settings',
  tags: ['configurações', 'impressora', 'balança', 'scanner', 'empresa', 'hardware', 'cupom'],
  steps: [
    {
      id: 'settings-intro',
      title: '⚙️ Personalize seu Sistema',
      description:
        'Configure o GIRO para funcionar perfeitamente com seu hardware e exibir as informações da sua loja nos cupons.',
      placement: 'center',
      route: '/settings',
    },
    {
      id: 'settings-tabs',
      title: '🗂️ Abas de Configuração',
      description:
        'As configurações estão organizadas em abas: Empresa (dados para cupom), Hardware (impressora, balança, scanner), Aparência e Notificações.',
      target: '[data-tutorial="settings-tabs"]',
      placement: 'bottom',
    },
    {
      id: 'settings-general',
      title: 'Configurações Gerais',
      description: 'Defina moeda, formato de data, idioma e comportamentos padrão do sistema.',
      target: '[data-tutorial="settings-general"]',
      placement: 'right',
    },
    {
      id: 'settings-company',
      title: '🏪 Dados da Empresa',
      description:
        'Preencha nome fantasia, CNPJ (opcional), endereço e telefone. Essas informações aparecem no cabeçalho do cupom e nos relatórios.',
      target: '[data-tutorial="settings-company"]',
      placement: 'right',
      action: 'click',
    },
    {
      id: 'settings-company-name',
      title: '✏️ Nome Fantasia',
      description:
        'O nome que aparecerá no topo do cupom. Exemplo: "Mercearia do João" ou "Minimercado Família Silva".',
      target: '[data-tutorial="company-name"]',
      placement: 'bottom',
    },
    {
      id: 'settings-company-cnpj',
      title: 'CNPJ',
      description: 'Informe o CNPJ se tiver. Para MEI ou informal, pode deixar em branco.',
      target: '[data-tutorial="company-cnpj"]',
      placement: 'bottom',
    },
    {
      id: 'settings-printer',
      title: '🖨️ Impressora Térmica',
      description:
        'Configure sua impressora de cupom (não-fiscal). Clique na aba "Hardware" e depois em "Impressora" para ver as opções.',
      target: '[data-tutorial="settings-printer"]',
      placement: 'right',
      action: 'click',
    },
    {
      id: 'settings-printer-model',
      title: '📝 Modelo da Impressora',
      description:
        'Selecione o modelo: Epson TM-T20/T88, Elgin i9, Bematech MP-4200, ou "Genérica ESC/POS" se não encontrar a sua.',
      target: '[data-tutorial="printer-model"]',
      placement: 'bottom',
    },
    {
      id: 'settings-printer-connection',
      title: '🔌 Tipo de Conexão',
      description:
        'Escolha: USB (mais comum, detectada automaticamente), Serial (porta COM1, COM2...) ou Rede (IP para impressoras em rede).',
      target: '[data-tutorial="printer-connection"]',
      placement: 'bottom',
    },
    {
      id: 'settings-printer-test',
      title: '🧪 Testar Impressão',
      description:
        'Clique em "Testar" para imprimir uma página de teste. Verifique se o texto saiu corretamente e a guilhotina funcionou.',
      target: '[data-tutorial="printer-test"]',
      placement: 'left',
      action: 'click',
    },
    {
      id: 'settings-scale',
      title: '⚖️ Balança',
      description:
        'Se você vende produtos por peso (frutas, verduras, carnes), configure a balança aqui para leitura automática.',
      target: '[data-tutorial="settings-scale"]',
      placement: 'right',
      action: 'click',
    },
    {
      id: 'settings-scale-model',
      title: '📝 Modelo da Balança',
      description:
        'Selecione: Toledo Prix 3/4, Filizola Platina, Elgin DP/SM100, ou configure o protocolo manualmente se não encontrar.',
      target: '[data-tutorial="scale-model"]',
      placement: 'bottom',
    },
    {
      id: 'settings-scale-port',
      title: '🔌 Porta Serial',
      description:
        'Balanças geralmente usam porta serial (COM1 a COM20). Se não souber qual, tente cada uma até a leitura funcionar.',
      target: '[data-tutorial="scale-port"]',
      placement: 'bottom',
    },
    {
      id: 'settings-scale-test',
      title: '🧪 Testar Balança',
      description:
        'Coloque um peso conhecido na balança (ex: 1kg) e clique "Ler Peso". O valor deve aparecer corretamente. Se não funcionar, verifique a porta.',
      target: '[data-tutorial="scale-test"]',
      placement: 'left',
    },
    {
      id: 'settings-scanner',
      title: '📷 Leitor de Código de Barras',
      description:
        'Leitores USB funcionam automaticamente (modo teclado). Aqui você configura opções avançadas como prefixo/sufixo e scanner por celular.',
      target: '[data-tutorial="settings-scanner"]',
      placement: 'right',
    },
    {
      id: 'settings-mobile-scanner',
      title: '📱 Scanner por Celular',
      description:
        'Use seu celular como scanner! Habilite esta opção e um QR Code aparecerá para conectar o app do celular ao sistema.',
      target: '[data-tutorial="mobile-scanner"]',
      placement: 'bottom',
    },
    {
      id: 'settings-drawer',
      title: '💰 Gaveta de Dinheiro',
      description:
        'A gaveta é conectada na impressora térmica. Configure se deve abrir automaticamente após cada venda em dinheiro.',
      target: '[data-tutorial="settings-drawer"]',
      placement: 'right',
    },
    {
      id: 'settings-backup',
      title: '💾 Backup Automático',
      description:
        'MUITO IMPORTANTE! Configure backup automático dos dados. Em caso de problema no computador, você não perde nada.',
      target: '[data-tutorial="settings-backup"]',
      placement: 'right',
    },
    {
      id: 'settings-save',
      title: '✅ Salvar Configurações',
      description:
        'Após fazer alterações, clique em "Salvar" para aplicar. Algumas configurações de hardware podem precisar reiniciar o sistema.',
      target: '[data-tutorial="settings-save"]',
      placement: 'top',
      action: 'click',
    },
    {
      id: 'settings-done',
      title: '✅ Sistema Personalizado!',
      description:
        'Seu sistema está configurado para sua loja. Revise as configurações periodicamente, especialmente o backup!',
      placement: 'center',
    },
  ],
};
