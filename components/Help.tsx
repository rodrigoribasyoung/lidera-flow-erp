import React, { useState } from 'react';
import { Github, Server, Cloud, ExternalLink, BookOpen, Code, Terminal, FileText } from 'lucide-react';

interface HelpProps {
  darkMode: boolean;
}

const Help: React.FC<HelpProps> = ({ darkMode }) => {
  const [activeTab, setActiveTab] = useState<'user' | 'dev'>('user');

  const cardBg = darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200';
  const textColor = darkMode ? 'text-zinc-100' : 'text-slate-800';
  const subText = darkMode ? 'text-zinc-400' : 'text-slate-500';

  const LinkCard = ({ icon: Icon, title, desc, url, colorClass }: any) => (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`p-4 rounded-xl border transition-all hover:scale-[1.02] flex items-center gap-4 ${cardBg} ${darkMode ? 'hover:bg-zinc-800' : 'hover:bg-slate-50'}`}
    >
      <div className={`p-3 rounded-lg bg-opacity-10 ${colorClass.replace('text-', 'bg-')} ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div className="flex-1">
        <h4 className={`font-bold ${textColor}`}>{title}</h4>
        <p className={`text-xs ${subText}`}>{desc}</p>
      </div>
      <ExternalLink size={16} className={subText} />
    </a>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className={`text-2xl font-bold ${textColor}`}>Central de Ajuda</h2>
        <p className={subText}>Documentação e Links Úteis</p>
      </div>

      {/* External Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LinkCard 
          icon={Github} 
          title="Repositório GitHub" 
          desc="Código fonte e versionamento" 
          url="https://github.com/somoslidera/lidera-flow-erp" 
          colorClass="text-purple-500"
        />
        <LinkCard 
          icon={Server} 
          title="Firebase Console" 
          desc="Banco de dados e Autenticação" 
          url="https://console.firebase.google.com/" 
          colorClass="text-orange-500"
        />
        <LinkCard 
          icon={Cloud} 
          title="Vercel Dashboard" 
          desc="Deploy e CI/CD" 
          url="https://vercel.com/dashboard" 
          colorClass="text-blue-500"
        />
      </div>

      {/* Documentation Area */}
      <div className={`rounded-xl border overflow-hidden ${cardBg}`}>
        <div className={`flex border-b ${darkMode ? 'border-zinc-800' : 'border-slate-200'}`}>
          <button
            onClick={() => setActiveTab('user')}
            className={`flex-1 p-4 font-medium flex justify-center items-center gap-2 transition-colors ${
              activeTab === 'user' 
                ? (darkMode ? 'bg-zinc-800 text-yellow-500 border-b-2 border-yellow-500' : 'bg-slate-50 text-blue-600 border-b-2 border-blue-600') 
                : subText
            }`}
          >
            <BookOpen size={18} /> Manual do Usuário
          </button>
          <button
            onClick={() => setActiveTab('dev')}
            className={`flex-1 p-4 font-medium flex justify-center items-center gap-2 transition-colors ${
              activeTab === 'dev' 
                ? (darkMode ? 'bg-zinc-800 text-yellow-500 border-b-2 border-yellow-500' : 'bg-slate-50 text-blue-600 border-b-2 border-blue-600') 
                : subText
            }`}
          >
            <Code size={18} /> Manual do Desenvolvedor
          </button>
        </div>

        <div className="p-8 prose max-w-none">
          {activeTab === 'user' ? (
            <div className={`space-y-6 ${textColor}`}>
              <section>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText size={20}/> Introdução</h3>
                <p className={subText}>Bem-vindo ao Lidera Flow ERP. Este sistema foi desenhado para simplificar a gestão financeira da sua empresa, permitindo controle total sobre contas a pagar, receber, fluxo de caixa e relatórios.</p>
              </section>

              <div className="grid md:grid-cols-2 gap-8">
                <section>
                  <h4 className="font-bold mb-2 text-lg">🚀 Primeiros Passos</h4>
                  <ul className={`list-disc pl-5 space-y-1 ${subText}`}>
                    <li>Acesse <strong>Configurações</strong> para cadastrar suas Categorias, Clientes e Contas Bancárias.</li>
                    <li>Utilize a tela de <strong>Lançamentos</strong> para registrar entradas e saídas.</li>
                    <li>Use o botão <strong>Importar CSV</strong> para carregar dados em massa do seu banco.</li>
                  </ul>
                </section>

                <section>
                  <h4 className="font-bold mb-2 text-lg">📊 Relatórios</h4>
                  <ul className={`list-disc pl-5 space-y-1 ${subText}`}>
                    <li>O <strong>Dashboard</strong> oferece uma visão rápida do mês atual.</li>
                    <li>A aba <strong>Relatórios</strong> contém o DRE Gerencial detalhado.</li>
                    <li>Você pode exportar o DRE em PDF ou CSV para análises externas.</li>
                  </ul>
                </section>
              </div>

              <section className={`p-4 rounded-lg border ${darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <h4 className="font-bold mb-2">💡 Dica Pro: Importação CSV</h4>
                <p className={`text-sm ${subText}`}>Ao importar um CSV, você pode mapear as colunas do seu banco para os campos do sistema. O sistema aprende e tenta identificar automaticamente colunas como "Data", "Valor" e "Descrição".</p>
              </section>
            </div>
          ) : (
            <div className={`space-y-6 ${textColor}`}>
              <section>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Terminal size={20}/> Stack Tecnológica</h3>
                <p className={subText}>O projeto foi construído utilizando as tecnologias mais modernas do ecossistema React.</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {['React 18', 'Vite', 'TypeScript', 'Tailwind CSS', 'Firebase Firestore', 'Recharts', 'Lucide React'].map(tech => (
                    <span key={tech} className={`px-2 py-1 rounded text-xs font-mono border ${darkMode ? 'border-zinc-700 bg-zinc-800' : 'border-slate-300 bg-slate-100'}`}>
                      {tech}
                    </span>
                  ))}
                </div>
              </section>

              <div className="grid md:grid-cols-2 gap-8">
                <section>
                  <h4 className="font-bold mb-2 text-lg">🛠 Estrutura do Projeto</h4>
                  <ul className={`list-disc pl-5 space-y-1 ${subText} font-mono text-sm`}>
                    <li>/src/components - Componentes de UI (Dashboard, Grids)</li>
                    <li>/src/services - Integração com Firebase</li>
                    <li>/src/types.ts - Definições de Tipos TypeScript</li>
                    <li>/src/constants.ts - Mock Data para fallback</li>
                  </ul>
                </section>

                <section>
                  <h4 className="font-bold mb-2 text-lg">🚀 Deploy</h4>
                  <ul className={`list-disc pl-5 space-y-1 ${subText}`}>
                    <li>O projeto está configurado para <strong>Vercel</strong>.</li>
                    <li>O build comando é <code>npm run build</code> (tsc + vite build).</li>
                    <li>Certifique-se de configurar as variáveis de ambiente se necessário.</li>
                  </ul>
                </section>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Help;