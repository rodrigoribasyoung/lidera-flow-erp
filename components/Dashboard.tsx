import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { ArrowUpCircle, ArrowDownCircle, DollarSign, Wallet } from 'lucide-react';
import { Transaction } from '../types';

interface DashboardProps {
  transactions: Transaction[];
  darkMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, darkMode }) => {
  
  const metrics = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.tipo === 'Entrada' && (t.status === 'Recebido' || t.status === 'Pago')) // Assuming Pago used mistakenly for Entrada sometimes or just 'Recebido'
      .reduce((acc, curr) => acc + curr.valorRealizado, 0);

    const totalExpense = transactions
      .filter(t => t.tipo === 'Saída' && t.status === 'Pago')
      .reduce((acc, curr) => acc + curr.valorRealizado, 0);

    const pendingIncome = transactions
      .filter(t => t.tipo === 'Entrada' && t.status === 'A receber')
      .reduce((acc, curr) => acc + curr.valorPrevisto, 0);

    const pendingExpense = transactions
      .filter(t => t.tipo === 'Saída' && t.status === 'A pagar')
      .reduce((acc, curr) => acc + curr.valorPrevisto, 0);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      pendingIncome,
      pendingExpense
    };
  }, [transactions]);

  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    transactions.forEach(t => {
      if (t.tipo === 'Saída') {
        data[t.categoria] = (data[t.categoria] || 0) + (t.status === 'Pago' ? t.valorRealizado : t.valorPrevisto);
      }
    });
    return Object.keys(data).map(name => ({ name, value: data[name] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [transactions]);

  // Colors
  const COLORS = darkMode 
    ? ['#fbbf24', '#f59e0b', '#d97706', '#b45309', '#78350f'] // Golds
    : ['#3b82f6', '#06b6d4', '#6366f1', '#8b5cf6', '#ec4899']; // Blues/Cool

  const cardBg = darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-sm';
  const textColor = darkMode ? 'text-zinc-100' : 'text-slate-800';
  const subText = darkMode ? 'text-zinc-400' : 'text-slate-500';

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${textColor}`}>Visão Geral</h2>
          <p className={subText}>Resumo financeiro e projeções</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-6 rounded-xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <span className={subText}>Saldo Atual</span>
            <Wallet className={darkMode ? 'text-yellow-500' : 'text-blue-500'} size={20} />
          </div>
          <div className={`text-2xl font-bold ${metrics.balance >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {formatCurrency(metrics.balance)}
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <span className={subText}>Receitas (Realizado)</span>
            <ArrowUpCircle className="text-emerald-500" size={20} />
          </div>
          <div className={`text-2xl font-bold ${textColor}`}>
            {formatCurrency(metrics.totalIncome)}
          </div>
          <div className="text-xs text-emerald-500 mt-1">
            + {formatCurrency(metrics.pendingIncome)} a receber
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <span className={subText}>Despesas (Realizado)</span>
            <ArrowDownCircle className="text-red-500" size={20} />
          </div>
          <div className={`text-2xl font-bold ${textColor}`}>
            {formatCurrency(metrics.totalExpense)}
          </div>
           <div className="text-xs text-red-500 mt-1">
            + {formatCurrency(metrics.pendingExpense)} a pagar
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <span className={subText}>Fluxo Líquido</span>
            <DollarSign className={darkMode ? 'text-yellow-500' : 'text-blue-500'} size={20} />
          </div>
          <div className={`text-2xl font-bold ${metrics.totalIncome - metrics.totalExpense >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {formatCurrency(metrics.totalIncome - metrics.totalExpense)}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className={`lg:col-span-2 p-6 rounded-xl border ${cardBg}`}>
           <h3 className={`font-semibold mb-6 ${textColor}`}>Fluxo de Caixa (Top Categorias de Despesa)</h3>
           <div className="h-80">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#3f3f46' : '#e2e8f0'} horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={100} 
                    tick={{ fill: darkMode ? '#a1a1aa' : '#64748b', fontSize: 12 }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: darkMode ? '#18181b' : '#fff', 
                      borderColor: darkMode ? '#27272a' : '#e2e8f0',
                      color: darkMode ? '#fff' : '#000'
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar dataKey="value" fill={darkMode ? '#fbbf24' : '#3b82f6'} radius={[0, 4, 4, 0]} barSize={20} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Pie Chart */}
        <div className={`p-6 rounded-xl border ${cardBg}`}>
          <h3 className={`font-semibold mb-6 ${textColor}`}>Distribuição de Despesas</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   formatter={(value: number) => formatCurrency(value)}
                   contentStyle={{ 
                      backgroundColor: darkMode ? '#18181b' : '#fff', 
                      borderColor: darkMode ? '#27272a' : '#e2e8f0'
                   }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;