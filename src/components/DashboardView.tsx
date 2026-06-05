import React, { useState } from 'react';
import { Transaction, STATUS_PRESETS } from '../types';
import { LucideIcon } from './LucideIcon';

interface DashboardViewProps {
  transactions: Transaction[];
  onToggleStatus: (id: string) => void;
  onAddClick: () => void;
  onNavigateToFlow: () => void;
}

export function DashboardView({
  transactions,
  onToggleStatus,
  onAddClick,
  onNavigateToFlow
}: DashboardViewProps) {
  // --- CALCULOS FINANCEIROS ---
  
  // Receitas totais e Recebidas
  const totalReceitas = transactions
    .filter(t => t.type === 'receita')
    .reduce((acc, t) => acc + t.value, 0);
    
  const receitasRecebidas = transactions
    .filter(t => t.type === 'receita' && t.status === 'recebido')
    .reduce((acc, t) => acc + t.value, 0);

  const receitasPendentes = totalReceitas - receitasRecebidas;

  // Despesas totais e Pagas/Atrasadas
  const totalDespesas = transactions
    .filter(t => t.type === 'despesa')
    .reduce((acc, t) => acc + t.value, 0);
    
  const despesasPagas = transactions
    .filter(t => t.type === 'despesa' && t.status === 'pago')
    .reduce((acc, t) => acc + t.value, 0);

  const despesasPendentesEAtrasadas = transactions
    .filter(t => t.type === 'despesa' && (t.status === 'pendente' || t.status === 'atrasado'))
    .reduce((acc, t) => acc + t.value, 0);

  const despesasAtrasadas = transactions
    .filter(t => t.type === 'despesa' && t.status === 'atrasado')
    .reduce((acc, t) => acc + t.value, 0);

  // Saldo Previsto (Tudo que entrará - Tudo que sairá)
  const saldoPrevisto = totalReceitas - totalDespesas;
  // Saldo Real realizado no Caixa
  const saldoRealizado = receitasRecebidas - despesasPagas;

  // Filtro de 5 transações mais recentes criadas/adicionadas
  // Como não guardamos timestamp explícito, mostramos as últimas 5 da lista
  // Mas vamos inverter para ter a de id mais recentes ou simplesmente as últimas 5 adicionadas.
  const transacoesRecentes = [...transactions].slice(-5).reverse();

  // --- COMPONENTES GRÁFICOS PERSONALIZADOS (SVG/CSS) ---
  const totalGeralVolume = totalReceitas + totalDespesas;
  const pctReceitas = totalGeralVolume > 0 ? (totalReceitas / totalGeralVolume) * 100 : 50;
  const pctDespesas = totalGeralVolume > 0 ? (totalDespesas / totalGeralVolume) * 100 : 50;

  // Gráfico Donut de Eficiência de Caixa: Recebidos vs Pagos Realizados
  const totalRealizadoVolume = receitasRecebidas + despesasPagas;
  const pctRecebidoRealizado = totalRealizadoVolume > 0 ? (receitasRecebidas / totalRealizadoVolume) * 100 : 0;
  const pctPagoRealizado = totalRealizadoVolume > 0 ? (despesasPagas / totalRealizadoVolume) * 100 : 0;

  // Formatadores de Moeda
  const formatMoeda = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(val);
  };

  return (
    <div className="space-y-8">
      {/* HEADER BANNER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Visão Geral</h2>
          <p className="text-slate-500 mt-1">Bem-vindo de volta, aqui está o resumo do seu mês.</p>
        </div>
        <button
          onClick={onAddClick}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-indigo-100 hover:scale-[1.02] transition-transform cursor-pointer active:scale-98"
        >
          <LucideIcon name="Plus" size={20} strokeWidth={2.5} />
          Nova Transação
        </button>
      </div>

      {/* CARDS DE RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Card 1: Saldo */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:border-indigo-100 hover:shadow-md transition duration-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <LucideIcon name="Wallet" size={24} />
            </div>
            <span className="text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">
              {saldoPrevisto >= 0 ? '+' : ''}{totalDespesas > 0 ? ((saldoPrevisto / totalReceitas) * 100).toFixed(1) : 100}%
            </span>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Saldo Atual</p>
            <h3 className="text-3xl font-bold mt-1 text-slate-900 font-sans tracking-tight">
              {formatMoeda(saldoPrevisto)}
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
              <span className="font-semibold text-slate-500 font-mono">Realizado: {formatMoeda(saldoRealizado)}</span>
            </p>
          </div>
        </div>

        {/* Card 2: Total a Receber */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:border-emerald-100 hover:shadow-md transition duration-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <LucideIcon name="ArrowUpRight" size={24} />
            </div>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">A Receber</p>
            <h3 className="text-3xl font-bold mt-1 text-emerald-600 font-sans tracking-tight">
              {formatMoeda(totalReceitas)}
            </h3>
            <p className="text-xs text-emerald-600 font-medium mt-1.5">
              {formatMoeda(receitasRecebidas)} já liquidados
            </p>
          </div>
        </div>

        {/* Card 3: Total a Pagar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:border-rose-100 hover:shadow-md transition duration-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
              <LucideIcon name="ArrowDownRight" size={24} />
            </div>
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">A Pagar</p>
            <h3 className="text-3xl font-bold mt-1 text-rose-600 font-sans tracking-tight">
              {formatMoeda(totalDespesas)}
            </h3>
            <p className="text-xs text-rose-600 font-medium mt-1.5">
              {formatMoeda(despesasPagas)} pagos • {formatMoeda(despesasAtrasadas)} atrasados
            </p>
          </div>
        </div>

      </div>

      {/* METADE INFERIOR - GRÁFICOS & TABELA DE ATIVIDADES RECENTES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Atividades Recentes (Col 8) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h4 className="font-bold text-slate-900 text-base">Atividades Recentes</h4>
            <button 
              onClick={onNavigateToFlow}
              className="text-indigo-600 text-sm font-bold hover:underline cursor-pointer"
            >
              Ver todos
            </button>
          </div>

          {/* LISTA */}
          <div className="divide-y divide-slate-50 flex-1 min-h-[300px] flex flex-col justify-start overflow-auto">
            {transacoesRecentes.length === 0 ? (
              <div className="my-auto flex flex-col items-center justify-center text-center py-10 px-4">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-3">
                  <LucideIcon name="FileSpreadsheet" size={24} />
                </div>
                <h4 className="text-sm font-semibold text-slate-700">Nenhuma transação encontrada</h4>
                <p className="text-xs text-slate-400 max-w-xs mt-1">Crie sua primeira conta a pagar ou receber para iniciar o controle.</p>
              </div>
            ) : (
              transacoesRecentes.map((t) => {
                const isReceita = t.type === 'receita';
                return (
                  <div key={t.id} className="flex items-center justify-between px-6 py-4.5 hover:bg-slate-50/20 transition group">
                    <div className="flex items-center gap-3">
                      {/* Círculo indicador */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isReceita 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'bg-rose-50 text-rose-600'
                      }`}>
                        <LucideIcon 
                          name={isReceita ? 'Plus' : 'ArrowDownRight'} 
                          size={18} 
                          strokeWidth={2.5} 
                        />
                      </div>
                      
                      {/* Descricao & Categoria/Data */}
                      <div className="space-y-0.5">
                        <span className="font-medium text-slate-700 block line-clamp-1">{t.description}</span>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="font-medium text-slate-500">
                            {t.category}
                          </span>
                          <span>•</span>
                          <span>Venc. {t.dueDate.split('-').reverse().join('/')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Valor e Ações Rápidas */}
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className={`text-base font-bold font-mono ${isReceita ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isReceita ? '+ ' : '- '} {formatMoeda(t.value)}
                        </div>
                      </div>
                      
                      {/* Status Toggle Actionable */}
                      <button
                        onClick={() => onToggleStatus(t.id)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight cursor-pointer transition ${
                          t.status === 'pago' || t.status === 'recebido'
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                            : t.status === 'atrasado'
                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                            : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                        }`}
                        title={`Marcar como ${isReceita ? 'Recebido/Pendente' : 'Pago/Pendente'}`}
                      >
                        {t.status === 'recebido' ? 'Recebido' : t.status === 'pago' ? 'Pago' : t.status === 'atrasado' ? 'Atrasado' : 'Pendente'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Grafico de Bar-Chart semanal representativo (Col 4) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Fluxo de Caixa</h4>
          </div>
          
          <div className="flex-1 flex flex-col justify-end gap-3 px-2">
            <div className="flex items-end gap-3 h-40">
              <div className="flex-1 bg-emerald-100 rounded-t-lg h-[60%] relative group cursor-pointer">
                 <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] font-bold bg-slate-800 text-white px-2 py-0.5 rounded transition-opacity">60%</div>
              </div>
              <div className="flex-1 bg-emerald-400 rounded-t-lg h-[85%] relative group cursor-pointer">
                 <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] font-bold bg-slate-800 text-white px-2 py-0.5 rounded transition-opacity">85%</div>
              </div>
              <div className="flex-1 bg-emerald-200 rounded-t-lg h-[45%] relative group cursor-pointer">
                 <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] font-bold bg-slate-800 text-white px-2 py-0.5 rounded transition-opacity">45%</div>
              </div>
              <div className="flex-1 bg-rose-400 rounded-t-lg h-[70%] relative group cursor-pointer">
                 <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] font-bold bg-slate-800 text-white px-2 py-0.5 rounded transition-opacity">70%</div>
              </div>
              <div className="flex-1 bg-rose-200 rounded-t-lg h-[30%] relative group cursor-pointer">
                 <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] font-bold bg-slate-800 text-white px-2 py-0.5 rounded transition-opacity">30%</div>
              </div>
              <div className="flex-1 bg-emerald-500 rounded-t-lg h-[95%] relative group cursor-pointer">
                 <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] font-bold bg-slate-800 text-white px-2 py-0.5 rounded transition-opacity">95%</div>
              </div>
              <div className="flex-1 bg-emerald-300 rounded-t-lg h-[55%] relative group cursor-pointer">
                 <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[10px] font-bold bg-slate-800 text-white px-2 py-0.5 rounded transition-opacity">55%</div>
              </div>
            </div>
            
            <div className="flex justify-between text-[10px] text-slate-400 font-extrabold uppercase tracking-widest pt-2">
              <span>Seg</span>
              <span>Ter</span>
              <span>Qua</span>
              <span>Qui</span>
              <span>Sex</span>
              <span>Sáb</span>
              <span>Dom</span>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                Entradas Realizadas
              </div>
              <span className="font-bold">
                {totalReceitas > 0 ? ((receitasRecebidas / totalGeralVolume) * 100).toFixed(0) : 50}%
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <div className="w-2 h-2 rounded-full bg-rose-450"></div>
                Saídas Realizadas
              </div>
              <span className="font-bold">
                {totalDespesas > 0 ? ((despesasPagas / totalGeralVolume) * 100).toFixed(0) : 50}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
              <div 
                className="bg-emerald-500 h-full transition-all duration-500" 
                style={{ 
                  width: `${totalGeralVolume > 0 ? (receitasRecebidas / totalGeralVolume) * 100 : 50}%` 
                }} 
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
