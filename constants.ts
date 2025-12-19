import { Transaction, AppSettings, Account } from './types';

export const MOCK_ACCOUNTS: Account[] = [
  { id: 'acc1', name: 'Banco Inter', type: 'Corrente', initialBalance: 5000, color: '#FF7F00' },
  { id: 'acc2', name: 'Caixa Física', type: 'Caixa', initialBalance: 1200, color: '#10B981' }
];

export const MOCK_SETTINGS: AppSettings = {
  categories: [
    { id: 'c1', name: 'Despesas administrativas', type: 'Despesa' },
    { id: 'c2', name: 'Despesas operacionais', type: 'Despesa' },
    { id: 'c3', name: 'Despesas fixas', type: 'Despesa' },
    { id: 'c4', name: 'Receita de serviços', type: 'Receita' },
    { id: 'c5', name: 'Receita de consultoria', type: 'Receita' },
    { id: 'c6', name: 'Receita de mentoria', type: 'Receita' }
  ],
  entities: [
    { id: 'e1', name: 'A Lenha', type: 'Fornecedor' },
    { id: 'e2', name: 'AppSheet', type: 'Fornecedor' },
    { id: 'e3', name: 'Alice Salazar', type: 'Cliente' },
    { id: 'e4', name: 'Ágil Disc', type: 'Fornecedor' },
    { id: 'e5', name: 'Mercado Livre', type: 'Fornecedor' },
    { id: 'e6', name: 'Google Workspace', type: 'Fornecedor' },
    { id: 'e7', name: 'Rose Portal Advocacia', type: 'Cliente' },
    { id: 'e8', name: 'Vitória', type: 'Cliente' },
    { id: 'e9', name: 'Ferrão', type: 'Fornecedor' }
  ],
  paymentMethods: [
    'Dinheiro', 'Boleto', 'Pix', 'Cartão de Crédito [Lidera]', 
    'Cartão de Crédito [Charles]', 'Cartão de Crédito [Rafaella]'
  ],
  costCenters: [
    'Produtos e Serviços', 'Alimentação', 'Aluguel', 'Assessoria', 
    'Capacitação', 'Colaboradores', 'Consultoria', 'Marketing e Publicidade'
  ]
};

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    issueDate: '2025-10-02',
    dueDate: '2025-10-02',
    type: 'Saída',
    category: 'Despesas operacionais',
    entity: 'Ágil Disc',
    productService: 'Análise de Perfis',
    costCenter: 'Ferramentas operacionais',
    paymentMethod: 'Boleto',
    accountId: 'acc1',
    description: 'Análise de Perfis Comportamentais',
    expectedAmount: 209.30,
    actualAmount: 209.30,
    paymentDate: '2025-10-02',
    accrualDate: '2025-10-02',
    status: 'Pago'
  },
  {
    id: '2',
    issueDate: '2025-09-22',
    dueDate: '2025-10-05',
    type: 'Entrada',
    category: 'Receita de serviços',
    entity: 'Cia da Fruta',
    productService: 'Consultoria',
    costCenter: 'Consultoria',
    paymentMethod: 'Pix',
    accountId: 'acc1',
    description: 'Consultoria Mensal',
    expectedAmount: 1100.00,
    actualAmount: 1100.00,
    paymentDate: '2025-10-05',
    accrualDate: '2025-10-05',
    status: 'Recebido'
  },
  {
    id: '3',
    issueDate: '2025-09-28',
    dueDate: '2025-10-05',
    type: 'Saída',
    category: 'Despesas fixas',
    entity: 'Sócios',
    productService: '',
    costCenter: 'Pro-labore',
    paymentMethod: 'Pix',
    accountId: 'acc1',
    description: 'Pro-labore Sócios',
    expectedAmount: 6000.00,
    actualAmount: 3000.00,
    paymentDate: '2025-10-13',
    accrualDate: '2025-10-13',
    status: 'Pago'
  },
  {
    id: '4',
    issueDate: '2025-09-22',
    dueDate: '2025-11-20',
    type: 'Entrada',
    category: 'Receita de mentoria',
    entity: 'Savana Imóveis',
    productService: 'Mentoria',
    costCenter: 'Mentoria',
    paymentMethod: 'Pix',
    accountId: 'acc1',
    description: 'Mentoria | A Jornada do Líder 2/9',
    expectedAmount: 200.00,
    actualAmount: 0.00,
    accrualDate: '2025-11-20',
    status: 'A receber'
  },
  {
    id: '5',
    issueDate: '2025-09-28',
    dueDate: '2025-11-20',
    type: 'Saída',
    category: 'Despesas administrativas',
    entity: 'Receita Federal',
    productService: '',
    costCenter: 'Impostos',
    paymentMethod: 'Boleto',
    accountId: 'acc1',
    description: 'Simples Nacional',
    expectedAmount: 525.00,
    actualAmount: 0.00,
    accrualDate: '2025-11-20',
    status: 'A pagar'
  }
];