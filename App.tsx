import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Settings from './components/Settings';
import Reports from './components/Reports';
import Accounts from './components/Accounts';
import Help from './components/Help';
import { Transaction, AppSettings, Account } from './types';
import { MOCK_TRANSACTIONS, MOCK_SETTINGS, MOCK_ACCOUNTS } from './constants';
import { transactionService, settingsService, accountsService } from './services/firebase';

const App: React.FC = () => {
  // Theme State
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Data State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
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
    const fetchAllData = async () => {
      try {
        // Fetch all data from Firebase in parallel
        const [firebaseTransactions, firebaseSettings, firebaseAccounts] = await Promise.all([
          transactionService.getAll(),
          settingsService.get(),
          accountsService.getAll()
        ]);

        // Set transactions
        setTransactions(firebaseTransactions);
        if (firebaseTransactions.length === 0) {
          console.log("No transactions found in Firebase. Start adding transactions to see them here.");
        }

        // Set settings
        if (firebaseSettings) {
          setSettings(firebaseSettings);
        } else {
          // If no settings in Firebase, use mock and save to Firebase
          console.log("No settings in Firebase - initializing with mock data");
          setSettings(MOCK_SETTINGS);
          try {
            await settingsService.save(MOCK_SETTINGS);
            console.log("Settings initialized in Firebase");
          } catch (error) {
            console.error("Failed to initialize settings in Firebase:", error);
          }
        }

        // Set accounts
        if (firebaseAccounts.length > 0) {
          setAccounts(firebaseAccounts);
        } else {
          // If no accounts in Firebase, use mock and save to Firebase
          console.log("No accounts in Firebase - initializing with mock data");
          setAccounts(MOCK_ACCOUNTS);
          try {
            for (const account of MOCK_ACCOUNTS) {
              const { id, ...accountData } = account;
              await accountsService.add(accountData);
            }
            // Reload accounts to get Firebase IDs
            const savedAccounts = await accountsService.getAll();
            if (savedAccounts.length > 0) {
              setAccounts(savedAccounts);
            }
            console.log("Accounts initialized in Firebase");
          } catch (error) {
            console.error("Failed to initialize accounts in Firebase:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching data from Firebase:", error);
        // Fallback to mock data on error
        setTransactions(MOCK_TRANSACTIONS);
        setSettings(MOCK_SETTINGS);
        setAccounts(MOCK_ACCOUNTS);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const toggleTheme = () => setDarkMode(!darkMode);

  // Handlers
  const handleAddTransaction = async (t: Omit<Transaction, 'id'>) => {
    try {
      // Save to Firebase
      const docRef = await transactionService.add(t);
      // Update local state with the new transaction (Firebase generates the ID)
      const newTransaction = { ...t, id: docRef.id };
      setTransactions([newTransaction, ...transactions]);
    } catch (error: any) {
      console.error("Error adding transaction to Firebase:", error);
      // Fallback: add to local state with generated ID
      const newId = Math.random().toString(36).substr(2, 9);
      const newTransaction = { ...t, id: newId };
      setTransactions([newTransaction, ...transactions]);
      
      if (error?.message?.includes('Permissão negada') || error?.code === 'permission-denied') {
        alert("⚠️ ERRO: Permissão negada pelo Firestore.\n\nConfigure as regras de segurança no console do Firebase:\nhttps://console.firebase.google.com/project/lidera-flow/firestore/rules\n\nVeja o arquivo FIREBASE_SETUP.md para instruções.");
      } else {
        alert("Erro ao salvar no Firebase. A transação foi adicionada localmente.");
      }
    }
  };

  const handleBulkAddTransactions = async (newTs: Omit<Transaction, 'id'>[]) => {
    try {
      // Save all transactions to Firebase
      const addedTransactions: Transaction[] = [];
      for (const t of newTs) {
        const docRef = await transactionService.add(t);
        addedTransactions.push({ ...t, id: docRef.id });
      }
      // Update local state
      setTransactions([...addedTransactions, ...transactions]);
    } catch (error: any) {
      console.error("Error bulk adding transactions to Firebase:", error);
      // Fallback: add to local state with generated IDs
      const processed = newTs.map(t => ({
        ...t,
        id: Math.random().toString(36).substr(2, 9)
      }));
      setTransactions([...processed, ...transactions]);
      
      if (error?.message?.includes('Permissão negada') || error?.code === 'permission-denied') {
        alert("⚠️ ERRO: Permissão negada pelo Firestore.\n\nConfigure as regras de segurança no console do Firebase:\nhttps://console.firebase.google.com/project/lidera-flow/firestore/rules\n\nVeja o arquivo FIREBASE_SETUP.md para instruções.");
      } else {
        alert("Erro ao salvar algumas transações no Firebase. Elas foram adicionadas localmente.");
      }
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      // Delete from Firebase
      await transactionService.delete(id);
      // Update local state
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (error: any) {
      console.error("Error deleting transaction from Firebase:", error);
      // Still remove from local state for better UX
      setTransactions(transactions.filter(t => t.id !== id));
      
      if (error?.message?.includes('Permissão negada') || error?.code === 'permission-denied') {
        console.warn("⚠️ Permissão negada - Configure as regras do Firestore");
      } else {
        alert("Erro ao deletar no Firebase. A transação foi removida localmente.");
      }
    }
  };

  const handleUpdateTransaction = async (id: string, updated: Partial<Transaction>) => {
    try {
      // Update in Firebase
      await transactionService.update(id, updated);
      // Update local state
      setTransactions(transactions.map(t => t.id === id ? { ...t, ...updated } : t));
    } catch (error: any) {
      console.error("Error updating transaction in Firebase:", error);
      // Still update local state for better UX
      setTransactions(transactions.map(t => t.id === id ? { ...t, ...updated } : t));
      
      if (error?.message?.includes('Permissão negada') || error?.code === 'permission-denied') {
        console.warn("⚠️ Permissão negada - Configure as regras do Firestore");
      } else {
        alert("Erro ao atualizar no Firebase. A transação foi atualizada localmente.");
      }
    }
  };

  const handleUpdateSettings = async (newSettings: AppSettings) => {
    try {
      // Save to Firebase
      await settingsService.save(newSettings);
      // Update local state
      setSettings(newSettings);
    } catch (error: any) {
      console.error("Error saving settings to Firebase:", error);
      // Still update local state for better UX
      setSettings(newSettings);
      
      if (error?.message?.includes('Permissão negada') || error?.code === 'permission-denied') {
        console.warn("⚠️ Permissão negada - Configure as regras do Firestore");
      } else {
        alert("Erro ao salvar configurações no Firebase. As alterações foram salvas localmente.");
      }
    }
  };

  const handleAddAccount = async (acc: Account) => {
    try {
      // Save to Firebase
      const { id, ...accountData } = acc;
      const docRef = await accountsService.add(accountData);
      // Update local state with Firebase ID
      const newAccount = { ...acc, id: docRef.id };
      setAccounts([...accounts, newAccount]);
    } catch (error: any) {
      console.error("Error adding account to Firebase:", error);
      // Fallback: add to local state
      setAccounts([...accounts, acc]);
      
      if (error?.message?.includes('Permissão negada') || error?.code === 'permission-denied') {
        alert("⚠️ ERRO: Permissão negada pelo Firestore.\n\nConfigure as regras de segurança no console do Firebase:\nhttps://console.firebase.google.com/project/lidera-flow/firestore/rules");
      } else {
        alert("Erro ao salvar conta no Firebase. A conta foi adicionada localmente.");
      }
    }
  };

  const handleDeleteAccount = async (id: string) => {
    try {
      // Delete from Firebase
      await accountsService.delete(id);
      // Update local state
      setAccounts(accounts.filter(a => a.id !== id));
    } catch (error: any) {
      console.error("Error deleting account from Firebase:", error);
      // Still remove from local state for better UX
      setAccounts(accounts.filter(a => a.id !== id));
      
      if (error?.message?.includes('Permissão negada') || error?.code === 'permission-denied') {
        console.warn("⚠️ Permissão negada - Configure as regras do Firestore");
      } else {
        alert("Erro ao deletar conta no Firebase. A conta foi removida localmente.");
      }
    }
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
          <Route 
            path="/" 
            element={
              <Dashboard 
                transactions={transactions} 
                accounts={accounts} 
                darkMode={darkMode} 
              />
            } 
          />
          <Route 
            path="/transactions" 
            element={
              <Transactions 
                transactions={transactions} 
                accounts={accounts}
                settings={settings}
                darkMode={darkMode}
                onAdd={handleAddTransaction}
                onDelete={handleDeleteTransaction}
                onUpdate={handleUpdateTransaction}
                onBulkAdd={handleBulkAddTransactions}
              />
            } 
          />
          <Route 
            path="/accounts" 
            element={
              <Accounts 
                 accounts={accounts} 
                 transactions={transactions}
                 darkMode={darkMode}
                 onAddAccount={handleAddAccount}
                 onDeleteAccount={handleDeleteAccount}
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
          <Route 
            path="/help" 
            element={<Help darkMode={darkMode} />} 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;