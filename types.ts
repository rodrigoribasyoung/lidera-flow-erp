export type TransactionType = 'Entrada' | 'Saída';
export type TransactionStatus = 'Pago' | 'Recebido' | 'A pagar' | 'A receber' | 'Atrasado' | 'Cancelado';

export interface Transaction {
  id: string;
  dataLancamento: string;
  dataVencimento: string;
  tipo: TransactionType;
  categoria: string;
  entidade: string; // Cliente ou Fornecedor
  produtoServico: string;
  centroCusto: string;
  formaPagamento: string;
  descricao: string;
  valorPrevisto: number;
  valorRealizado: number;
  dataPagamento?: string;
  dataCompetencia: string;
  status: TransactionStatus;
}

export interface AppSettings {
  categories: string[];
  entities: string[];
  paymentMethods: string[];
  costCenters: string[];
}

export interface DashboardMetrics {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  pendingIncome: number;
  pendingExpense: number;
}