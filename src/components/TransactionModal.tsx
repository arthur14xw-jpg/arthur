import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, TransactionStatus, CATEGORIES } from '../types';
import { LucideIcon } from './LucideIcon';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transactionData: Omit<Transaction, 'id'> & { id?: string }) => void;
  editingTransaction?: Transaction | null;
}

export function TransactionModal({
  isOpen,
  onClose,
  onSave,
  editingTransaction
}: TransactionModalProps) {
  // Estados do formulário
  const [type, setType] = useState<TransactionType>('despesa');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState<string>('');
  const [dueDate, setDueDate] = useState('2026-06-05'); // Padrão tempo atual
  const [category, setCategory] = useState('Outros');
  const [isLiquidado, setIsLiquidado] = useState(false); // Já foi pago/recebido?
  const [notes, setNotes] = useState('');

  // Erros do formulário
  const [erreur, setErreur] = useState<string | null>(null);

  // Sincronizar dados quando o modal abre ou para edição
  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setDescription(editingTransaction.description);
      setValue(editingTransaction.value.toString());
      setDueDate(editingTransaction.dueDate);
      setCategory(editingTransaction.category);
      setIsLiquidado(editingTransaction.status === 'pago' || editingTransaction.status === 'recebido');
      setNotes(editingTransaction.notes || '');
      setErreur(null);
    } else {
      // Estado inicial padrão para nova conta
      setType('despesa');
      setDescription('');
      setValue('');
      setDueDate('2026-06-05'); // Hoje
      setCategory('Alimentação'); // Categoria padrão despesa
      setIsLiquidado(false);
      setNotes('');
      setErreur(null);
    }
  }, [editingTransaction, isOpen]);

  // Atualiza a categoria padrão quando o tipo muda
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'receita') {
      setCategory('Salário');
    } else {
      setCategory('Alimentação');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!description.trim()) {
      setErreur('Por favor, informe a descrição da conta.');
      return;
    }

    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue <= 0) {
      setErreur('Deves preencher um valor numérico válido e maior que zero.');
      return;
    }

    if (!dueDate) {
      setErreur('Selecione uma data de vencimento válida.');
      return;
    }

    // Calcula status dependendo se está liquidado ou não
    let status: TransactionStatus = 'pendente';
    if (isLiquidado) {
      status = type === 'receita' ? 'recebido' : 'pago';
    } else {
      // Se não estiver liquidado, checa se já venceu relativo a hoje 2026-06-05
      const vencimento = new Date(dueDate + 'T12:00:00');
      const hoje = new Date('2026-06-05T12:00:00');
      if (vencimento < hoje) {
        status = 'atrasado';
      }
    }

    // Enviar dados para salvar
    onSave({
      id: editingTransaction?.id,
      type,
      description: description.trim(),
      value: numericValue,
      dueDate,
      category,
      status,
      notes: notes.trim() || undefined
    });

    onClose();
  };

  if (!isOpen) return null;

  // Filtrar categorias conforme o Tipo selecionado
  const availableCategories = Object.values(CATEGORIES).filter((catPreset) => {
    if (type === 'receita') {
      return ['Salário', 'Vendas', 'Serviços', 'Investimentos', 'Outros'].includes(catPreset.name);
    } else {
      return ['Moradia', 'Alimentação', 'Transporte', 'Saúde', 'Lazer', 'Educação', 'Impostos', 'Outros'].includes(catPreset.name);
    }
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Caixa do Modal */}
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden transform transition-all z-10 border border-slate-100 flex flex-col">
        {/* Topo do Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {editingTransaction ? 'Editar Registro' : 'Lançar Nova Conta'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {editingTransaction ? 'Modifique os campos necessários.' : 'Insira as informações de receitas ou despesas.'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            <LucideIcon name="X" size={18} />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {erreur && (
            <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2 animate-shake">
              <LucideIcon name="AlertCircle" size={16} className="shrink-0" />
              <span>{erreur}</span>
            </div>
          )}

          {/* Tipo de Transação (Radio elegante) */}
          <div className="grid grid-cols-2 gap-3 pb-1">
            <button
              type="button"
              onClick={() => handleTypeChange('receita')}
              className={`py-2.5 rounded-xl border-2 font-medium text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                type === 'receita'
                  ? 'border-emerald-500 bg-emerald-50/45 text-emerald-700 font-bold'
                  : 'border-slate-150 hover:border-slate-300 text-slate-500 bg-white'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${type === 'receita' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              Receber (+)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('despesa')}
              className={`py-2.5 rounded-xl border-2 font-medium text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                type === 'despesa'
                  ? 'border-rose-500 bg-rose-50/45 text-rose-700 font-bold'
                  : 'border-slate-150 hover:border-slate-300 text-slate-500 bg-white'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${type === 'despesa' ? 'bg-rose-500' : 'bg-slate-300'}`} />
              Pagar (-)
            </button>
          </div>

          {/* Descrição */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 tracking-wide block">Descrição da Conta</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ex: Conta de Internet, Venda de Console, Aluguel"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (erreur) setErreur(null);
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition text-slate-700 placeholder:text-slate-400"
                autoFocus
              />
            </div>
          </div>

          {/* Valor da Conta */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 tracking-wide block">Valor da Fatura (R$)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400 font-medium text-sm select-none pointer-events-none">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  if (erreur) setErreur(null);
                }}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition text-slate-700 font-mono"
              />
            </div>
          </div>

          {/* Grid de Vencimento e Categoria */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Vencimento */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 tracking-wide block">Vencimento</label>
              <div className="relative">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition text-slate-700 cursor-pointer"
                />
              </div>
            </div>

            {/* Categoria */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 tracking-wide block">Categoria</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition text-slate-700 appearance-none cursor-pointer"
                >
                  {availableCategories.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <span className="absolute inset-y-0 right-3 flex items-center text-slate-400 pointer-events-none">
                  <LucideIcon name="ChevronDown" size={14} />
                </span>
              </div>
            </div>

          </div>

          {/* Já foi liquidado (Toggle Switch) */}
          <div className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-700 block">
                {type === 'receita' ? 'Marcar como recebido' : 'Marcar como pago'}
              </span>
              <span className="text-[10px] text-slate-400 block leading-tight">
                {type === 'receita' 
                  ? 'Ative caso já tenha recebido este valor em sua conta.' 
                  : 'Ative caso já tenha realizado o pagamento desta fatura.'}
              </span>
            </div>
            
            {/* Toggle slider custom */}
            <button
              type="button"
              onClick={() => setIsLiquidado(!isLiquidado)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition duration-200 cursor-pointer ${
                isLiquidado ? (type === 'receita' ? 'bg-emerald-500' : 'bg-indigo-600') : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ${
                  isLiquidado ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Observações / Notas */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 tracking-wide block">Observações (Opcional)</label>
            <textarea
              placeholder="Adicione informações extras ou detalhes da transação..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition text-slate-700 placeholder:text-slate-400 resize-none"
            />
          </div>

          {/* Botões do Rodapé */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 hover:bg-slate-55 text-slate-600 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-5 py-2.5 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-md ${
                type === 'receita' ? 'bg-emerald-600 hover:bg-emerald-705 shadow-emerald-50' : 'bg-indigo-600 hover:bg-indigo-705 shadow-indigo-50'
              }`}
            >
              {editingTransaction ? 'Salvar Alterações' : 'Confirmar Lançamento'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
