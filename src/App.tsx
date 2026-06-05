import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, TransactionStatus } from './types';
import { INITIAL_TRANSACTIONS } from './mockData';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { FlowView } from './components/FlowView';
import { TransactionModal } from './components/TransactionModal';
import { LucideIcon } from './components/LucideIcon';

export default function App() {
  // --- GERENCIAMENTO DE ESTADO ---
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'fluxo'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // --- CARREGAR DADOS ---
  useEffect(() => {
    const saved = localStorage.getItem('financas_contas_v1');
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        console.error('Erro ao recarregar dados do localStorage, resetando.', e);
        setTransactions(INITIAL_TRANSACTIONS);
      }
    } else {
      // Carregar mock inicial premium para demonstrar funcionamento refinado
      setTransactions(INITIAL_TRANSACTIONS);
      localStorage.setItem('financas_contas_v1', JSON.stringify(INITIAL_TRANSACTIONS));
    }
  }, []);

  // --- PERSISTIR DADOS ---
  const saveToLocalStorage = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
    localStorage.setItem('financas_contas_v1', JSON.stringify(newTransactions));
  };

  // --- OPERAÇÕES ---

  // 1. Alterna status da Conta (Pago/Recebido <-> Pendente/Atrasado)
  const handleToggleStatus = (id: string) => {
    const updated = transactions.map((t) => {
      if (t.id === id) {
        let newStatus: TransactionStatus = 'pendente';
        
        if (t.status === 'pago' || t.status === 'recebido') {
          // Voltar para pendente ou atrasado
          const vencimento = new Date(t.dueDate + 'T12:00:00');
          const hoje = new Date('2026-06-05T12:00:00'); // Tempo atual regulado
          newStatus = vencimento < hoje ? 'atrasado' : 'pendente';
        } else {
          // Liquidar conta
          newStatus = t.type === 'receita' ? 'recebido' : 'pago';
        }

        return { ...t, status: newStatus };
      }
      return t;
    });
    saveToLocalStorage(updated);
  };

  // 2. Excluir lançamentos
  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    saveToLocalStorage(updated);
  };

  // 3. Cadastrar ou Atualizar cadastro do Modal
  const handleSaveTransaction = (transactionData: Omit<Transaction, 'id'> & { id?: string }) => {
    if (transactionData.id) {
      // Edição
      const updated = transactions.map((t) => {
        if (t.id === transactionData.id) {
          return {
            ...t,
            ...transactionData,
            id: t.id // Preserva ID original
          } as Transaction;
        }
        return t;
      });
      saveToLocalStorage(updated);
    } else {
      // Novo Lançamento
      const newRecord: Transaction = {
        ...transactionData,
        id: `t-${Date.now()}`
      } as Transaction;
      saveToLocalStorage([...transactions, newRecord]);
    }
    setEditingTransaction(null);
  };

  // 4. Iniciar edição de conta
  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  // 5. Iniciar adição de nova conta desmarcada
  const handleAddClick = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-800">
      
      {/* BARRA DE NAVEGAÇÃO LATERAL/INFERIOR RESPONSIVA */}
      <Navigation
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onAddClick={handleAddClick}
      />

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <main className="flex-1 min-w-0 max-w-7xl mx-auto w-full px-4 py-6 md:p-8 space-y-6 pb-24 md:pb-8">
        
        {/* TOP BAR MOBILE (Design do Logo para telas pequenas) */}
        <header className="flex md:hidden items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8.5 h-8.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <LucideIcon name="Landmark" size={15} strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-800 block">Finanças360</span>
              <span className="text-[9px] text-slate-400 font-semibold block leading-none">Controle de Contas</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-white border border-slate-100 px-2.5 py-1 rounded-full font-mono font-medium shadow-2xs">
            <LucideIcon name="Calendar" size={11} className="text-blue-500" />
            05 Jun 2026
          </div>
        </header>

        {/* MUDANÇA DILIGENTE DE ABAS */}
        {currentTab === 'dashboard' ? (
          <DashboardView
            transactions={transactions}
            onToggleStatus={handleToggleStatus}
            onAddClick={handleAddClick}
            onNavigateToFlow={() => setCurrentTab('fluxo')}
          />
        ) : (
          <FlowView
            transactions={transactions}
            onToggleStatus={handleToggleStatus}
            onDeleteTransaction={handleDeleteTransaction}
            onEditTransaction={handleEditTransaction}
            onAddClick={handleAddClick}
          />
        )}
      </main>

      {/* MODAL CONFIGURÁVEL PARA CADASTRO / EDIÇÃO */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        editingTransaction={editingTransaction}
      />

    </div>
  );
}
