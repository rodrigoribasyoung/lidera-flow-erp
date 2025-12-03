import React, { useState, useMemo } from 'react';
import { Transaction } from '../types';

interface ReportsProps {
  transactions: Transaction[];
  darkMode: boolean;
}

const Reports: React.FC<ReportsProps> = ({ transactions, darkMode }) => {
  const [activeTab, setActiveTab] = useState<'payables' | 'dre'>('payables');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const cardBg = darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200';
  const textColor = darkMode ? 'text-zinc-100' : 'text-slate-800';
  const subText = darkMode ? 'text-zinc-400' : 'text-slate-500';

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Data for Payables/Receivables
  const pendingPayables = transactions.filter(t => t.tipo === 'Saída' && t.status === 'A pagar');
  const pendingReceivables = transactions.filter(t => t.tipo === 'Entrada' && t.status === 'A receber');
  const totalPayable = pendingPayables.reduce((acc, curr) => acc + curr.valorPrevisto, 0);
  const totalReceivable = pendingReceivables.reduce((acc, curr) => acc + curr.valorPrevisto, 0);

  // Data for DRE
  const dreData = useMemo(() => {
    // Filter by year and realized status
    const realized = transactions.filter(t => 
      (t.status === 'Pago' || t.status === 'Recebido') && 
      new Date(t.dataCompetencia).getFullYear() === selectedYear
    );

    const incomeMap: Record<string, number> = {};
    const expenseMap: Record<string, number> = {};
    let totalIncome = 0;
    let totalExpense = 0;

    realized.forEach(t => {
      if (t.tipo === 'Entrada') {
        incomeMap[t.categoria] = (incomeMap[t.categoria] || 0) + t.valorRealizado;
        totalIncome += t.valorRealizado;
      } else {
        expenseMap[t.categoria] = (expenseMap[t.categoria] || 0) + t.valorRealizado;
        totalExpense += t.valorRealizado;
      }
    });

    return { incomeMap, expenseMap, totalIncome, totalExpense, result: totalIncome - totalExpense };
  }, [transactions, selectedYear]);

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <div>
            <h2 className={`text-2xl font-bold ${textColor}`}>Relatórios</h2>
            <p className={subText}>Análises financeiras detalhadas</p>
          </div>
          <div className={`flex p-1 rounded-lg border ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-100 border-slate-200'}`}>
            <button 
              onClick={() => setActiveTab('payables')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'payables' ? (darkMode ? 'bg-zinc-800 text-white' : 'bg-white text-blue-600 shadow-sm') : subText}`}
            >
              Contas a Pagar/Receber
            </button>
            <button 
              onClick={() => setActiveTab('dre')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'dre' ? (darkMode ? 'bg-zinc-800 text-white' : 'bg-white text-blue-600 shadow-sm') : subText}`}
            >
              DRE Gerencial
            </button>
          </div>
        </div>
        
        {activeTab === 'payables' ? (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className={`p-6 rounded-xl border flex-1 ${cardBg}`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`font-bold text-lg ${textColor}`}>Contas a Receber</h3>
                <span className="text-xl font-bold text-emerald-500">{formatCurrency(totalReceivable)}</span>
              </div>
              <div className="space-y-3">
                  {pendingReceivables.slice(0, 10).map((t) => (
                    <div key={t.id} className={`flex justify-between items-center p-3 rounded border ${darkMode ? 'bg-zinc-950/50 border-zinc-800' : 'bg-slate-50 border-slate-100'}`}>
                        <div>
                          <p className={`font-medium text-sm ${textColor}`}>{t.descricao}</p>
                          <p className={`text-xs ${subText}`}>{t.entidade} • {t.dataVencimento}</p>
                        </div>
                        <span className="font-medium text-emerald-500">{formatCurrency(t.valorPrevisto)}</span>
                    </div>
                  ))}
                  {pendingReceivables.length === 0 && <p className={`text-center py-4 ${subText}`}>Nada pendente.</p>}
              </div>
            </div>

            <div className={`p-6 rounded-xl border flex-1 ${cardBg}`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`font-bold text-lg ${textColor}`}>Contas a Pagar</h3>
                <span className="text-xl font-bold text-red-500">{formatCurrency(totalPayable)}</span>
              </div>
              <div className="space-y-3">
                  {pendingPayables.slice(0, 10).map((t) => (
                    <div key={t.id} className={`flex justify-between items-center p-3 rounded border ${darkMode ? 'bg-zinc-950/50 border-zinc-800' : 'bg-slate-50 border-slate-100'}`}>
                        <div>
                          <p className={`font-medium text-sm ${textColor}`}>{t.descricao}</p>
                          <p className={`text-xs ${subText}`}>{t.entidade} • {t.dataVencimento}</p>
                        </div>
                        <span className="font-medium text-red-500">{formatCurrency(t.valorPrevisto)}</span>
                    </div>
                  ))}
                  {pendingPayables.length === 0 && <p className={`text-center py-4 ${subText}`}>Nada pendente.</p>}
              </div>
            </div>
          </div>
        ) : (
          <div className={`rounded-xl border overflow-hidden ${cardBg}`}>
             <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                <h3 className={`font-bold text-lg ${textColor}`}>Demonstrativo do Resultado do Exercício</h3>
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className={`p-2 rounded border outline-none ${darkMode ? 'bg-zinc-950 border-zinc-700' : 'bg-white border-slate-200'}`}
                >
                   {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
             </div>
             <div className="p-8">
               <div className="space-y-6 max-w-4xl mx-auto">
                  {/* Receitas */}
                  <div>
                    <div className="flex justify-between items-end border-b border-emerald-500/30 pb-2 mb-3">
                      <h4 className="text-emerald-500 font-bold uppercase tracking-wider text-sm">Receita Bruta</h4>
                      <span className="text-emerald-500 font-bold text-lg">{formatCurrency(dreData.totalIncome)}</span>
                    </div>
                    <div className="space-y-2 pl-4">
                      {Object.entries(dreData.incomeMap).map(([cat, val]) => (
                        <div key={cat} className="flex justify-between text-sm">
                          <span className={subText}>{cat}</span>
                          <span className={textColor}>{formatCurrency(val)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Despesas */}
                  <div>
                    <div className="flex justify-between items-end border-b border-red-500/30 pb-2 mb-3">
                      <h4 className="text-red-500 font-bold uppercase tracking-wider text-sm">Despesas Operacionais</h4>
                      <span className="text-red-500 font-bold text-lg">({formatCurrency(dreData.totalExpense)})</span>
                    </div>
                    <div className="space-y-2 pl-4">
                      {Object.entries(dreData.expenseMap).map(([cat, val]) => (
                        <div key={cat} className="flex justify-between text-sm">
                          <span className={subText}>{cat}</span>
                          <span className={textColor}>({formatCurrency(val)})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resultado */}
                  <div className={`mt-8 pt-4 border-t-2 flex justify-between items-center ${darkMode ? 'border-zinc-700' : 'border-slate-200'}`}>
                    <h4 className={`font-bold text-xl ${textColor}`}>Resultado Líquido</h4>
                    <span className={`font-bold text-2xl ${dreData.result >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {formatCurrency(dreData.result)}
                    </span>
                  </div>
               </div>
             </div>
          </div>
        )}
    </div>
  );
};

export default Reports;