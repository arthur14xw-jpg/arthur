import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, TransactionStatus, CATEGORIES, STATUS_PRESETS } from '../types';
import { LucideIcon } from './LucideIcon';

interface FlowViewProps {
  transactions: Transaction[];
  onToggleStatus: (id: string) => void;
  onDeleteTransaction: (id: string) => void;
  onEditTransaction: (transaction: Transaction) => void;
  onAddClick: () => void;
}

type TypeFilter = 'todas' | 'pagar' | 'receber';
type StatusFilter = 'todas' | 'pendentes' | 'liquidadas' | 'atrasadas';

export function FlowView({
  transactions,
  onToggleStatus,
  onDeleteTransaction,
  onEditTransaction,
  onAddClick
}: FlowViewProps) {
  // Filtros de estado locais
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('todas');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todas');

  // Ordenação de dados (padrão: data de vencimento mais próxima primeiro, ou ordenação invertida)
  const [sortBy, setSortBy] = useState<'dueDate' | 'value' | 'description'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Categorias únicas existentes para o seletor
  const uniqueCategories = useMemo(() => {
    const list = new Set(transactions.map(t => t.category));
    return Array.from(list).sort();
  }, [transactions]);

  // Aplicação de filtros
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // 1. Filtro de Tipo (Pagar vs Receber)
      if (typeFilter === 'pagar' && t.type !== 'despesa') return false;
      if (typeFilter === 'receber' && t.type !== 'receita') return false;

      // 2. Filtro por Status
      if (statusFilter === 'pendentes' && (t.status === 'pago' || t.status === 'recebido')) return false;
      if (statusFilter === 'liquidadas' && (t.status !== 'pago' && t.status !== 'recebido')) return false;
      if (statusFilter === 'atrasadas' && t.status !== 'atrasado') return false;

      // 3. Filtro de Categoria
      if (categoryFilter !== 'todas' && t.category !== categoryFilter) return false;

      // 4. Busca por Texto (Descrição/Categoria/Notas)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesDescription = t.description.toLowerCase().includes(query);
        const matchesCategory = t.category.toLowerCase().includes(query);
        const matchesNotes = t.notes ? t.notes.toLowerCase().includes(query) : false;
        if (!matchesDescription && !matchesCategory && !matchesNotes) return false;
      }

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'dueDate') {
        comparison = a.dueDate.localeCompare(b.dueDate);
      } else if (sortBy === 'value') {
        comparison = a.value - b.value;
      } else if (sortBy === 'description') {
        comparison = a.description.localeCompare(b.description);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [transactions, typeFilter, statusFilter, categoryFilter, searchQuery, sortBy, sortOrder]);

  const handleSort = (field: 'dueDate' | 'value' | 'description') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Formatadores de Moeda
  const formatMoeda = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(val);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER DE TELA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Transações</h2>
          <p className="text-slate-500 mt-1">
            Gerencie, filtre e acompanhe todas as contas do caixa.
          </p>
        </div>
        <button
          onClick={onAddClick}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-indigo-100 hover:scale-[1.02] transition-transform cursor-pointer active:scale-98 text-sm"
        >
          <LucideIcon name="Plus" size={18} strokeWidth={2.5} />
          Nova Transação
        </button>
      </div>

      {/* PAINEL DE FILTROS */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
        
        {/* BARRA DE PESQUISA E SELETORES */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Campo de Busca */}
          <div className="relative md:col-span-5">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
              <LucideIcon name="Search" size={16} />
            </span>
            <input
              type="text"
              placeholder="Buscar por descrição, categoria ou notas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition placeholder:text-slate-400 text-slate-700"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <LucideIcon name="X" size={14} />
              </button>
            )}
          </div>

          {/* Filtro de Categoria */}
          <div className="relative md:col-span-3">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
              <LucideIcon name="SlidersHorizontal" size={14} />
            </span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 appearance-none text-slate-700 cursor-pointer"
            >
              <option value="todas">Todas as Categorias</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-3 flex items-center text-slate-400 pointer-events-none">
              <LucideIcon name="ChevronDown" size={14} />
            </span>
          </div>

          {/* Filtros de Tipo */}
          <div className="md:col-span-4 flex rounded-xl border border-slate-100 p-1 bg-slate-50">
            {(['todas', 'pagar', 'receber'] as TypeFilter[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setTypeFilter(tab)}
                className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg transition capitalize cursor-pointer ${
                  typeFilter === tab
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-100'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab === 'todas' ? 'Todas' : tab === 'pagar' ? 'A Pagar' : 'A Receber'}
              </button>
            ))}
          </div>
        </div>

        {/* STATUS BAR E REINICIAR FILTROS */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-50">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 mr-2">Status:</span>
            {(['todas', 'pendentes', 'liquidadas', 'atrasadas'] as StatusFilter[]).map((stat) => (
              <button
                key={stat}
                onClick={() => setStatusFilter(stat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer ${
                  statusFilter === stat
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {stat === 'todas' ? 'Todos' : stat === 'pendentes' ? 'Pendentes' : stat === 'liquidadas' ? 'Liquidados' : 'Atrasados'}
              </button>
            ))}
          </div>

          {(typeFilter !== 'todas' || statusFilter !== 'todas' || categoryFilter !== 'todas' || searchQuery) && (
            <button
              onClick={() => {
                setTypeFilter('todas');
                setStatusFilter('todas');
                setCategoryFilter('todas');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 cursor-pointer"
            >
              <LucideIcon name="RefreshCcw" size={12} />
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* LISTAGEM DE CONTA */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        
        {/* VIEW DESKTOP: TABELA LIMPA */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th 
                  onClick={() => handleSort('description')}
                  className="px-6 py-4.5 text-xs font-bold text-slate-400 tracking-wider uppercase cursor-pointer select-none hover:text-slate-800"
                >
                  <div className="flex items-center gap-1.5">
                    Descrição
                    {sortBy === 'description' && (
                      <LucideIcon name={sortOrder === 'asc' ? 'ChevronDown' : 'ChevronDown'} className={`transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} size={12} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-400 tracking-wider uppercase">
                  Categoria
                </th>
                <th 
                  onClick={() => handleSort('dueDate')}
                  className="px-6 py-4.5 text-xs font-bold text-slate-400 tracking-wider uppercase cursor-pointer select-none hover:text-slate-800"
                >
                  <div className="flex items-center gap-1.5">
                    Vencimento
                    {sortBy === 'dueDate' && (
                      <LucideIcon name={sortOrder === 'asc' ? 'ChevronDown' : 'ChevronDown'} className={`transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} size={12} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-400 tracking-wider uppercase">
                  Status
                </th>
                <th 
                  onClick={() => handleSort('value')}
                  className="px-6 py-4.5 text-xs font-bold text-slate-400 tracking-wider uppercase cursor-pointer select-none hover:text-slate-800 text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    Valor
                    {sortBy === 'value' && (
                      <LucideIcon name={sortOrder === 'asc' ? 'ChevronDown' : 'ChevronDown'} className={`transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} size={12} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4.5 text-xs font-bold text-slate-400 tracking-wider uppercase text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="p-3 bg-slate-50 rounded-full text-slate-400 mb-3">
                        <LucideIcon name="Filter" size={24} />
                      </div>
                      <p className="text-sm font-semibold text-slate-700">Nenhum resultado com esses filtros</p>
                      <p className="text-xs text-slate-400 mt-1">Remova ou ajuste os parâmetros de busca para localizar as contas.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => {
                  const isReceita = t.type === 'receita';
                  const catPreset = CATEGORIES[t.category] || CATEGORIES.Outros;
                  const statusPreset = STATUS_PRESETS[t.status];

                  return (
                    <tr 
                      key={t.id} 
                      className={`hover:bg-slate-50/20 transition border-l-4 ${isReceita ? 'border-l-emerald-500' : 'border-l-rose-500'}`}
                    >
                      {/* Descricao */}
                      <td className="px-6 py-5">
                        <div className="space-y-0.5">
                          <span className="text-sm font-semibold text-slate-800 block line-clamp-1">
                            {t.description}
                          </span>
                          {t.notes && (
                            <span className="text-xs text-slate-400 line-clamp-1 block">
                              {t.notes}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Categoria */}
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${catPreset.bgColor} ${catPreset.color} ${catPreset.borderColor}`}>
                          <LucideIcon name={catPreset.icon} size={13} />
                          {t.category}
                        </div>
                      </td>

                      {/* Vencimento */}
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                          <LucideIcon name="Calendar" size={13} className="text-slate-400" />
                          {t.dueDate.split('-').reverse().join('/')}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5 whitespace-nowrap">
                        <button
                          onClick={() => onToggleStatus(t.id)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight cursor-pointer transition capitalize ${statusPreset.bgColor} ${statusPreset.color}`}
                          title="Clique para alternar o status"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            t.status === 'pago' || t.status === 'recebido'
                              ? 'bg-emerald-500'
                              : t.status === 'atrasado'
                              ? 'bg-rose-500'
                              : 'bg-amber-400'
                          }`} />
                          {statusPreset.label}
                        </button>
                      </td>

                      {/* Valor */}
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <span className={`text-base font-bold font-mono ${isReceita ? 'text-emerald-600' : 'text-slate-800'}`}>
                          {isReceita ? '+ ' : '- '} {formatMoeda(t.value)}
                        </span>
                      </td>

                      {/* Ações */}
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          {/* Alternar Status Implícito */}
                          <button
                            onClick={() => onToggleStatus(t.id)}
                            className="p-1 px-1.5 rounded-xl border border-slate-100 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition cursor-pointer"
                            title={`Marcar como ${isReceita ? 'Recebido/Pendente' : 'Pago/Pendente'}`}
                          >
                            <LucideIcon name="Check" size={14} strokeWidth={2.5} />
                          </button>
                          {/* Editar */}
                          <button
                            onClick={() => onEditTransaction(t)}
                            className="p-1 px-1.5 rounded-xl border border-slate-100 hover:bg-slate-50 text-slate-500 hover:text-indigo-600 hover:border-indigo-100 transition cursor-pointer"
                            title="Editar"
                          >
                            <LucideIcon name="Pencil" size={13} />
                          </button>
                          {/* Deletar */}
                          <button
                            onClick={() => {
                              if (confirm(`Tem certeza de que deseja excluir "${t.description}"?`)) {
                                onDeleteTransaction(t.id);
                              }
                            }}
                            className="p-1 px-1.5 rounded-xl border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-rose-600 hover:border-rose-100 transition cursor-pointer"
                            title="Excluir"
                          >
                            <LucideIcon name="Trash2" size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* VIEW MOBILE: CARDS DE LISTA */}
        <div className="block md:hidden divide-y divide-slate-100">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 px-4 text-slate-400">
              <div className="p-3 bg-slate-50 rounded-full text-slate-400 mb-3 w-max mx-auto">
                <LucideIcon name="Filter" size={24} />
              </div>
              <p className="text-sm font-semibold text-slate-700">Nenhum resultado com esses filtros</p>
              <p className="text-xs text-slate-400 mt-1">Modifique as opções de filtro para ver as contas.</p>
            </div>
          ) : (
            filteredTransactions.map((t) => {
              const isReceita = t.type === 'receita';
              const catPreset = CATEGORIES[t.category] || CATEGORIES.Outros;
              const statusPreset = STATUS_PRESETS[t.status];

              return (
                <div 
                  key={t.id} 
                  className={`p-5 flex flex-col gap-3.5 hover:bg-slate-50/20 transition ${
                    isReceita ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-rose-500'
                  }`}
                >
                  {/* Linha 1: Descrição e Categoria */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-850 line-clamp-1">{t.description}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 whitespace-nowrap inline-flex items-center gap-1">
                        <LucideIcon name="Calendar" size={10} />
                        Venc. {t.dueDate.split('-').reverse().join('/')}
                      </p>
                    </div>
                    {/* Categoria */}
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${catPreset.bgColor} ${catPreset.color} ${catPreset.borderColor} shrink-0`}>
                      <LucideIcon name={catPreset.icon} size={11} />
                      {t.category}
                    </span>
                  </div>

                  {/* Notas */}
                  {t.notes && (
                    <p className="text-[11px] text-slate-450 bg-slate-50 p-2.5 rounded-lg line-clamp-2">
                      {t.notes}
                    </p>
                  )}

                  {/* Linha 2: Valor, Status e Ações */}
                  <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-1">
                    {/* Preço e Status */}
                    <div className="space-y-1">
                      <div className={`text-base font-bold font-mono ${isReceita ? 'text-emerald-300' : 'text-slate-800'}`}>
                        {isReceita ? '+ ' : '- '} {formatMoeda(t.value)}
                      </div>
                      <button
                        onClick={() => onToggleStatus(t.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer ${statusPreset.bgColor} ${statusPreset.color}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          t.status === 'pago' || t.status === 'recebido' ? 'bg-emerald-500' : 'bg-amber-400'
                        }`} />
                        {statusPreset.label}
                      </button>
                    </div>

                    {/* Botões de Ações Rápidas */}
                    <div className="flex items-center gap-1.5">
                      {/* Toggle */}
                      <button
                        onClick={() => onToggleStatus(t.id)}
                        className="p-2 text-xs text-slate-600 hover:text-indigo-600 border border-slate-100 rounded-lg bg-slate-50 active:bg-slate-100 transition cursor-pointer"
                        title="Alternar Status"
                      >
                        <LucideIcon name="Check" size={13} strokeWidth={2.5} />
                      </button>
                      {/* Editar */}
                      <button
                        onClick={() => onEditTransaction(t)}
                        className="p-2 text-xs text-slate-600 hover:text-indigo-600 border border-slate-100 rounded-lg bg-slate-50 active:bg-slate-100 transition cursor-pointer"
                      >
                        <LucideIcon name="Pencil" size={13} />
                      </button>
                      {/* Deletar */}
                      <button
                        onClick={() => {
                          if (confirm(`Excluir conta "${t.description}"?`)) {
                            onDeleteTransaction(t.id);
                          }
                        }}
                        className="p-2 text-xs text-rose-600 hover:bg-rose-50 border border-rose-50 rounded-lg transition shrink-0 cursor-pointer"
                      >
                        <LucideIcon name="Trash2" size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
}
