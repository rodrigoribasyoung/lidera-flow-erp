import React, { useState } from 'react';
import { AppSettings } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface SettingsProps {
  settings: AppSettings;
  darkMode: boolean;
  onUpdateSettings: (s: AppSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, darkMode, onUpdateSettings }) => {
  const [activeTab, setActiveTab] = useState<keyof AppSettings>('categories');
  const [newItem, setNewItem] = useState('');

  // Styling
  const cardBg = darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200';
  const textColor = darkMode ? 'text-zinc-100' : 'text-slate-800';
  const subText = darkMode ? 'text-zinc-400' : 'text-slate-500';
  const inputBg = darkMode ? 'bg-zinc-950 border-zinc-700 text-white' : 'bg-white border-slate-300 text-slate-900';

  const handleAdd = () => {
    if (!newItem.trim()) return;
    onUpdateSettings({
      ...settings,
      [activeTab]: [...settings[activeTab], newItem]
    });
    setNewItem('');
  };

  const handleDelete = (index: number) => {
    const updated = [...settings[activeTab]];
    updated.splice(index, 1);
    onUpdateSettings({
      ...settings,
      [activeTab]: updated
    });
  };

  const tabs: { key: keyof AppSettings; label: string }[] = [
    { key: 'categories', label: 'Categorias' },
    { key: 'entities', label: 'Entidades' },
    { key: 'paymentMethods', label: 'Formas de Pagamento' },
    { key: 'costCenters', label: 'Centros de Custo' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${textColor}`}>Configurações</h2>
        <p className={subText}>Gerencie os parâmetros do sistema</p>
      </div>

      <div className={`rounded-xl border flex flex-col md:flex-row overflow-hidden ${cardBg}`}>
        {/* Tabs Sidebar */}
        <div className={`w-full md:w-64 flex flex-col border-b md:border-b-0 md:border-r ${darkMode ? 'border-zinc-800 bg-zinc-950/50' : 'border-slate-200 bg-slate-50'}`}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`p-4 text-left font-medium transition-colors border-l-4 ${
                activeTab === tab.key 
                  ? (darkMode ? 'bg-zinc-800 border-yellow-500 text-yellow-500' : 'bg-white border-blue-600 text-blue-600 shadow-sm')
                  : (darkMode ? 'border-transparent text-zinc-400 hover:bg-zinc-800/50' : 'border-transparent text-slate-500 hover:bg-slate-100')
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <h3 className={`text-lg font-bold mb-4 ${textColor}`}>
            Gerenciar {tabs.find(t => t.key === activeTab)?.label}
          </h3>

          <div className="flex gap-2 mb-6">
            <input 
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Adicionar novo item..."
              className={`flex-1 p-2 rounded border focus:ring-2 outline-none ${inputBg} ${darkMode ? 'focus:ring-yellow-500/50' : 'focus:ring-blue-500/50'}`}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <button 
              onClick={handleAdd}
              className={`p-2 px-4 rounded font-medium flex items-center gap-2 ${darkMode ? 'bg-yellow-500 text-zinc-900 hover:bg-yellow-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              <Plus size={18} /> Adicionar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
             {settings[activeTab].map((item, index) => (
                <div key={`${item}-${index}`} className={`flex justify-between items-center p-3 rounded border group ${darkMode ? 'bg-zinc-800/30 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                   <span className={textColor}>{item}</span>
                   <button 
                    onClick={() => handleDelete(index)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-red-500/10 text-red-500 transition-all"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;