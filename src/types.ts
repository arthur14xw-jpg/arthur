export type TransactionType = 'receita' | 'despesa';

export type TransactionStatus = 'pago' | 'pendente' | 'recebido' | 'atrasado';

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  value: number;
  dueDate: string; // Formato YYYY-MM-DD
  category: string;
  status: TransactionStatus;
  notes?: string;
}

export interface CategoryPreset {
  name: string;
  color: string;     // Tailwind text color class, e.g. 'text-emerald-600'
  bgColor: string;   // Tailwind bg color class, e.g. 'bg-emerald-50'
  borderColor: string; // Tailwind border class
  icon: string;      // Lucide icon key
}

export const CATEGORIES: Record<string, CategoryPreset> = {
  // Receitas
  Salário: { name: 'Salário', color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-100', icon: 'Briefcase' },
  Vendas: { name: 'Vendas', color: 'text-teal-600', bgColor: 'bg-teal-50', borderColor: 'border-teal-100', icon: 'TrendingUp' },
  Serviços: { name: 'Serviços', color: 'text-indigo-600', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-100', icon: 'Cpu' },
  Investimentos: { name: 'Investimentos', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-100', icon: 'LineChart' },
  
  // Despesas
  Moradia: { name: 'Moradia', color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-100', icon: 'Home' },
  Alimentação: { name: 'Alimentação', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-100', icon: 'Utensils' },
  Transporte: { name: 'Transporte', color: 'text-sky-600', bgColor: 'bg-sky-50', borderColor: 'border-sky-100', icon: 'Car' },
  Saúde: { name: 'Saúde', color: 'text-rose-600', bgColor: 'bg-rose-50', borderColor: 'border-rose-100', icon: 'HeartPulse' },
  Lazer: { name: 'Lazer', color: 'text-violet-600', bgColor: 'bg-violet-50', borderColor: 'border-violet-100', icon: 'Sparkles' },
  Educação: { name: 'Educação', color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-100', icon: 'BookOpen' },
  Impostos: { name: 'Impostos', color: 'text-slate-600', bgColor: 'bg-slate-50', borderColor: 'border-slate-100', icon: 'FileText' },
  
  // Geral
  Outros: { name: 'Outros', color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-100', icon: 'HelpCircle' },
};

// Detalhes estéticos extras para status
export interface StatusPreset {
  label: string;
  color: string;
  bgColor: string;
}

export const STATUS_PRESETS: Record<TransactionStatus, StatusPreset> = {
  pago: { label: 'Pago', color: 'text-emerald-700 font-medium', bgColor: 'bg-emerald-50 border border-emerald-200' },
  recebido: { label: 'Recebido', color: 'text-emerald-700 font-medium', bgColor: 'bg-emerald-50 border border-emerald-200' },
  pendente: { label: 'Pendente', color: 'text-amber-700 font-medium', bgColor: 'bg-amber-50 border border-amber-200' },
  atrasado: { label: 'Atrasado', color: 'text-rose-700 font-semibold animate-pulse', bgColor: 'bg-rose-50 border border-rose-200' },
};
