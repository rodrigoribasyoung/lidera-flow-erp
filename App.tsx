import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Settings from './components/Settings';
import Reports from './components/Reports';
import { Transaction, AppSettings } from './types';
import { MOCK_TRANSACTIONS, MOCK_SETTINGS } from './constants';
import { transactionService } from './services/firebase';

const App: React.FC = () => {
  // Theme State
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Data State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<AppSettings>(MOCK_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Apply theme class to html body
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchTransactions = async () => {
      // Try to fetch from Firebase
      const firebaseData = await transactionService.getAll();
      
      if (firebaseData.length > 0) {
        setTransactions(firebaseData);
      } else {
        // Fallback to Mock Data if Firebase is empty/fails
        console.log("Using Mock Data (Firebase empty or error)");
        setTransactions(MOCK_TRANSACTIONS);
      }
      setLoading(false);
    };

    fetchTransactions();
  }, []);

  const toggleTheme = () => setDarkMode(!darkMode);

  // Handlers (In a real app, these would call Firebase updates)
  const handleAddTransaction = async (t: Omit<Transaction, 'id'>) => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newTransaction = { ...t, id: newId };
    setTransactions([newTransaction, ...transactions]);
    // Fire & Forget firebase add
    // transactionService.add(t);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
    // transactionService.delete(id);
  };

  const handleUpdateTransaction = (id: string, updated: Partial<Transaction>) => {
    setTransactions(transactions.map(t => t.id === id ? { ...t, ...updated } : t));
    // transactionService.update(id, updated);
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    // Would save to Firebase Settings collection
  };

  if (loading) {
    return (
      <div className={`h-screen w-full flex items-center justify-center ${darkMode ? 'bg-zinc-950 text-yellow-500' : 'bg-slate-50 text-blue-600'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-current"></div>
      </div>
    );
  }

  return (
    <Router>
      <Layout darkMode={darkMode} toggleTheme={toggleTheme}>
        <Routes>
          <Route path="/" element={<Dashboard transactions={transactions} darkMode={darkMode} />} />
          <Route 
            path="/transactions" 
            element={
              <Transactions 
                transactions={transactions} 
                settings={settings}
                darkMode={darkMode}
                onAdd={handleAddTransaction}
                onDelete={handleDeleteTransaction}
                onUpdate={handleUpdateTransaction}
              />
            } 
          />
          <Route 
            path="/reports"
            element={<Reports transactions={transactions} darkMode={darkMode} />}
          />
          <Route 
            path="/settings" 
            element={
              <Settings 
                settings={settings} 
                darkMode={darkMode}
                onUpdateSettings={handleUpdateSettings}
              />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;