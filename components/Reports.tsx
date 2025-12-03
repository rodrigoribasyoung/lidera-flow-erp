import React from 'react';
import { Transaction } from '../types';

interface ReportsProps {
  transactions: Transaction[];
  darkMode: boolean;
}

const Reports: React.FC<ReportsProps> = ({ transactions, darkMode }) => {
  const cardBg = darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200';
  const textColor = darkMode ? 'text-zinc-100' : 'text-slate-800';
  const subText = darkMode ? 'text-zinc-400' : 'text-slate-500';

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const pendingPayables = transactions.filter(t => t.tipo === 'Saída' && t.status === 'A pagar');
  const pendingReceivables = transactions.filter(t => t.tipo === 'Entrada' && t.status === 'A receber');

  const totalPayable = pendingPayables.reduce((acc, curr) => acc + curr.valorPrevisto, 0);
  const totalReceivable = pendingReceivables.reduce((acc, curr) => acc + curr.valorPrevisto, 0);

  const SummaryList = ({ title, items, total, colorClass }: any) => (
    <div className={`p-6 rounded-xl border flex-1 ${cardBg}`}>
       <div className="flex justify-between items-center mb-6">
         <h3 className={`font-bold text-lg ${textColor}`}>{title}</h3>
         <span className={`text-xl font-bold ${colorClass}`}>{formatCurrency(total)}</span>
       </div>
       <div className="space-y-3">
          {items.slice(0, 10).map((t: Transaction) => (
             <div key={t.id} className={`flex justify-between items-center p-3 rounded border ${darkMode ? 'bg-zinc-950/50 border-zinc-800' : 'bg-slate-50 border-slate-100'}`}>
                <div>
                   <p className={`font-medium text-sm ${textColor}`}>{t.descricao}</p>
                   <p className={`text-xs ${subText}`}>{t.entidade} • {t.dataVencimento}</p>
                </div>
                <span className={`font-medium ${colorClass}`}>{formatCurrency(t.valorPrevisto)}</span>
             </div>
          ))}
          {items.length === 0 && <p className={`text-center py-4 ${subText}`}>Nada pendente.</p>}
       </div>
    </div>
  );

  return (
    <div className="space-y-6">
       <div>
          <h2 className={`text-2xl font-bold ${textColor}`}>Relatórios</h2>
          <p className={subText}>Contas a Pagar e Receber</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
           <SummaryList 
              title="Contas a Receber" 
              items={pendingReceivables} 
              total={totalReceivable} 
              colorClass="text-emerald-500" 
           />
           <SummaryList 
              title="Contas a Pagar" 
              items={pendingPayables} 
              total={totalPayable} 
              colorClass="text-red-500" 
           />
        </div>
    </div>
  );
};

export default Reports;