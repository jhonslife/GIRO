import type { Tutorial } from '../types';

export const employeesTutorial: Tutorial = {
  id: 'employees',
  name: '👥 Gestão de Funcionários',
  description:
    'Cadastre operadores, defina PINs de acesso e configure permissões por cargo. Controle total de quem faz o quê!',
  category: 'management',
  estimatedMinutes: 6,
  icon: 'Users',
  tags: ['funcionários', 'permissões', 'pin', 'acesso', 'roles', 'segurança'],
  steps: [
    {
      id: 'emp-intro',
      title: '👥 Gestão de Funcionários',
      description:
        'Cada operador acessa o sistema com seu PIN pessoal. As permissões são definidas pelo cargo - assim você controla exatamente o que cada um pode fazer!',
      placement: 'center',
      route: '/employees',
    },
    {
      id: 'emp-list',
      title: '📋 Lista de Funcionários',
      description:
        'Veja todos os operadores cadastrados. Cada linha mostra o nome, cargo e se está ativo. Use a busca para encontrar rapidamente!',
      target: '[data-tutorial="employees-table"]',
      placement: 'bottom',
    },
    {
      id: 'emp-new',
      title: '➕ Novo Funcionário',
      description:
        'Clique aqui para cadastrar um novo operador. O sistema vai gerar um PIN aleatório de 4 dígitos automaticamente!',
      target: '[data-tutorial="new-employee-button"]',
      placement: 'bottom',
      action: 'click',
    },
    {
      id: 'emp-name',
      title: '📝 Nome Completo',
      description:
        'Digite o nome completo do funcionário. Este nome aparece nos relatórios de vendas, no cupom fiscal e no histórico de operações.',
      target: '[data-tutorial="employee-name"]',
      placement: 'bottom',
      required: true,
    },
    {
      id: 'emp-pin',
      title: '🔐 PIN de Acesso',
      description:
        'O PIN é gerado automaticamente (4 dígitos), mas você pode alterá-lo. É com esse PIN que o funcionário faz login - anote e entregue com segurança!',
      target: '[data-tutorial="employee-pin"]',
      placement: 'bottom',
      required: true,
    },
    {
      id: 'emp-role',
      title: '🎖️ Cargo (Permissões)',
      description:
        'O cargo define o que o funcionário pode fazer. Escolha com cuidado - cada nível tem acessos diferentes. Veja os detalhes a seguir:',
      target: '[data-tutorial="employee-role"]',
      placement: 'bottom',
      required: true,
    },
    {
      id: 'emp-role-admin',
      title: '👑 Administrador (ADMIN)',
      description:
        'Poder absoluto! Gerencia funcionários, altera configurações, vê todos os relatórios, cancela vendas e acessa o backup. Reserve para proprietários e gerentes de confiança.',
      placement: 'center',
    },
    {
      id: 'emp-role-manager',
      title: '🏪 Gerente (MANAGER)',
      description:
        'Quase tudo! Abre/fecha caixa, cadastra produtos, faz sangria/suprimento, vê relatórios. Não pode gerenciar admins nem alterar configurações críticas.',
      placement: 'center',
    },
    {
      id: 'emp-role-cashier',
      title: '💵 Operador de Caixa (CASHIER)',
      description:
        'Focado em vendas! Usa o PDV, abre/fecha seu próprio caixa, cadastra produtos rapidamente. Não vê relatórios financeiros nem valores de outros caixas.',
      placement: 'center',
    },
    {
      id: 'emp-role-viewer',
      title: '👁️ Visualizador (VIEWER)',
      description:
        'Somente leitura! Vê produtos, estoque e alguns relatórios, mas não pode alterar nada. Ideal para sócios ou investidores que querem acompanhar à distância.',
      placement: 'center',
    },
    {
      id: 'emp-save',
      title: '✅ Salvar Funcionário',
      description:
        'Confira os dados e salve! O PIN será exibido em uma notificação por 10 segundos - anote ou copie antes que desapareça. O funcionário já pode logar!',
      target: '[data-tutorial="employee-save"]',
      placement: 'top',
      action: 'click',
    },
    {
      id: 'emp-edit',
      title: '✏️ Editar Funcionário',
      description:
        'Precisa alterar cargo, email ou telefone? Clique nos três pontos "⋮" ao lado do funcionário e escolha Editar. Também pode resetar o PIN esquecido.',
      target: '[data-tutorial="employee-edit"]',
      placement: 'left',
    },
    {
      id: 'emp-deactivate',
      title: '🚫 Desativar (Nunca Excluir!)',
      description:
        'Funcionário saiu? DESATIVE, não exclua! Isso bloqueia o acesso mas mantém todo o histórico de vendas e operações para auditoria. Você pode reativar depois se ele voltar.',
      target: '[data-tutorial="employee-status"]',
      placement: 'left',
    },
    {
      id: 'emp-audit',
      title: '📊 Auditoria e Rastreabilidade',
      description:
        'Cada venda, cancelamento, sangria e ajuste fica registrado com nome do operador, data e hora. Em Relatórios você pode filtrar por funcionário para ver todas as operações!',
      placement: 'center',
    },
    {
      id: 'emp-done',
      title: '🎉 Equipe Pronta!',
      description:
        'Sua equipe está configurada com acessos personalizados! Dica: troque os PINs periodicamente e desative imediatamente funcionários que saírem.',
      placement: 'center',
    },
  ],
};
