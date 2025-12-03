import { Transaction, AppSettings } from './types';

export const MOCK_SETTINGS: AppSettings = {
  categories: [
    'Despesas administrativas', 'Despesas esporádicas', 'Despesas fixas', 
    'Despesas operacionais', 'Receita de assessoria', 'Receita de consultoria', 
    'Receita de eventos', 'Receita de ferramentas', 'Receita de mentoria'
  ],
  entities: [
    'A Lenha', 'AppSheet', 'Alice Salazar', 'Ágil Disc', 'Mercado Livre', 
    'Google Workspace', 'Rose Portal Advocacia', 'Vitória', 'Ferrão', 
    'Douglas Marcenaria'
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
    dataLancamento: '2025-10-02',
    dataVencimento: '2025-10-02',
    tipo: 'Saída',
    categoria: 'Despesas operacionais',
    entidade: 'Ágil Disc',
    produtoServico: 'Análise de Perfis',
    centroCusto: 'Ferramentas operacionais',
    formaPagamento: 'Boleto',
    descricao: 'Análise de Perfis Comportamentais',
    valorPrevisto: 209.30,
    valorRealizado: 209.30,
    dataPagamento: '2025-10-02',
    dataCompetencia: '2025-10-02',
    status: 'Pago'
  },
  {
    id: '2',
    dataLancamento: '2025-09-22',
    dataVencimento: '2025-10-05',
    tipo: 'Entrada',
    categoria: 'Receita de serviços',
    entidade: 'Cia da Fruta',
    produtoServico: 'Consultoria',
    centroCusto: 'Consultoria',
    formaPagamento: 'Pix',
    descricao: 'Consultoria Mensal',
    valorPrevisto: 1100.00,
    valorRealizado: 1100.00,
    dataPagamento: '2025-10-05',
    dataCompetencia: '2025-10-05',
    status: 'Recebido'
  },
  {
    id: '3',
    dataLancamento: '2025-09-28',
    dataVencimento: '2025-10-05',
    tipo: 'Saída',
    categoria: 'Despesas fixas',
    entidade: 'Sócios',
    produtoServico: '',
    centroCusto: 'Pro-labore',
    formaPagamento: 'Pix',
    descricao: 'Pro-labore Sócios',
    valorPrevisto: 6000.00,
    valorRealizado: 3000.00,
    dataPagamento: '2025-10-13',
    dataCompetencia: '2025-10-13',
    status: 'Pago'
  },
  {
    id: '4',
    dataLancamento: '2025-09-22',
    dataVencimento: '2025-11-20',
    tipo: 'Entrada',
    categoria: 'Receita de mentoria',
    entidade: 'Savana Imóveis',
    produtoServico: 'Mentoria',
    centroCusto: 'Mentoria',
    formaPagamento: 'Pix',
    descricao: 'Mentoria | A Jornada do Líder 2/9',
    valorPrevisto: 200.00,
    valorRealizado: 0.00,
    dataCompetencia: '2025-11-20',
    status: 'A receber'
  },
  {
    id: '5',
    dataLancamento: '2025-09-28',
    dataVencimento: '2025-11-20',
    tipo: 'Saída',
    categoria: 'Despesas administrativas',
    entidade: 'Receita Federal',
    produtoServico: '',
    centroCusto: 'Impostos',
    formaPagamento: 'Boleto',
    descricao: 'Simples Nacional',
    valorPrevisto: 525.00,
    valorRealizado: 0.00,
    dataCompetencia: '2025-11-20',
    status: 'A pagar'
  }
];