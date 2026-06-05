import React from 'react';
import { LucideIcon } from './LucideIcon';

interface NavigationProps {
  currentTab: 'dashboard' | 'fluxo';
  onTabChange: (tab: 'dashboard' | 'fluxo') => void;
  onAddClick: () => void;
}

export function Navigation({
  currentTab,
  onTabChange,
  onAddClick
}: NavigationProps) {
  return (
    <>
      {/* 1. SIDEBAR DESK (md:flex) */}
      <aside className="hidden md:flex flex-col w-64 bg-white text-slate-700 h-screen sticky top-0 shrink-0 border-r border-slate-200">
        {/* LOGOTIPO */}
        <div className="p-8 pb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <LucideIcon name="Landmark" size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">Finanz.io</h1>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-1">Contas e Fluxo</p>
          </div>
        </div>

        {/* ITEMS DE MENU */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
              currentTab === 'dashboard'
                ? 'bg-indigo-50 text-indigo-700 font-bold'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <LucideIcon name="PieChart" size={18} />
            Dashboard
          </button>

          <button
            onClick={() => onTabChange('fluxo')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
              currentTab === 'fluxo'
                ? 'bg-indigo-50 text-indigo-700 font-bold'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <LucideIcon name="FileSpreadsheet" size={18} />
            Transações
          </button>
        </nav>

        {/* RODAPÉ DO MENU / USUÁRIO LOGADO */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-xs overflow-hidden flex items-center justify-center text-xs font-bold text-slate-700">
              JS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">João D. Santos</p>
              <p className="text-xs text-slate-400 truncate">Pro Account</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. BOTTOM NAVIGATION MOBILE (md:hidden) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 px-4 py-1.5 flex items-center justify-around shadow-lg">
        {/* Item 1 */}
        <button
          onClick={() => onTabChange('dashboard')}
          className={`flex flex-col items-center gap-1 py-1.5 text-center cursor-pointer transition ${
            currentTab === 'dashboard' ? 'text-indigo-600 font-semibold' : 'text-slate-450 hover:text-slate-600'
          }`}
        >
          <LucideIcon name="PieChart" size={18} />
          <span className="text-[10px] font-medium">Dashboard</span>
        </button>

        {/* Central Lançar Item */}
        <button
          onClick={onAddClick}
          className="relative -top-5 flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-100 border-4 border-white text-center cursor-pointer active:scale-95 transition"
        >
          <LucideIcon name="Plus" size={20} strokeWidth={3} />
        </button>

        {/* Item 2 */}
        <button
          onClick={() => onTabChange('fluxo')}
          className={`flex flex-col items-center gap-1 py-1.5 text-center cursor-pointer transition ${
            currentTab === 'fluxo' ? 'text-indigo-600 font-semibold' : 'text-slate-450 hover:text-slate-600'
          }`}
        >
          <LucideIcon name="FileSpreadsheet" size={18} />
          <span className="text-[10px] font-medium">Transações</span>
        </button>
      </nav>
    </>
  );
}
