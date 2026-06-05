import { Transaction } from './types';

// O tempo atual local é 2026-06-05
export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 't-1',
    type: 'receita',
    description: 'Salário Clt - Desenvolvimento',
    value: 8500.00,
    dueDate: '2026-06-05',
    category: 'Salário',
    status: 'recebido',
    notes: 'Salário correspondente ao mês trabalhado de Maio'
  },
  {
    id: 't-2',
    type: 'despesa',
    description: 'Aluguel do Apartamento',
    value: 2800.00,
    dueDate: '2026-06-10',
    category: 'Moradia',
    status: 'pendente',
    notes: 'Condomínio incluso no boleto do proprietário'
  },
  {
    id: 't-3',
    type: 'receita',
    description: 'Projeto Freela - Landing Page',
    value: 3200.00,
    dueDate: '2026-06-12',
    category: 'Serviços',
    status: 'pendente',
    notes: 'Desenvolvimento de página institucional e integrações'
  },
  {
    id: 't-4',
    type: 'despesa',
    description: 'Supermercado Mensal',
    value: 1250.40,
    dueDate: '2026-06-02',
    category: 'Alimentação',
    status: 'pago',
    notes: 'Compra mensal realizada no Carrefour'
  },
  {
    id: 't-5',
    type: 'despesa',
    description: 'Assinatura Nuvem AWS',
    value: 420.50,
    dueDate: '2026-05-28',
    category: 'Serviços',
    status: 'atrasado',
    notes: 'Fatura do cartão de crédito falhou - regularizar'
  },
  {
    id: 't-6',
    type: 'despesa',
    description: 'Plano de Saúde Familiar',
    value: 950.00,
    dueDate: '2026-06-15',
    category: 'Saúde',
    status: 'pendente'
  },
  {
    id: 't-7',
    type: 'receita',
    description: 'Dividendos de Ações/FIIs',
    value: 640.25,
    dueDate: '2026-06-18',
    category: 'Investimentos',
    status: 'pendente'
  },
  {
    id: 't-8',
    type: 'despesa',
    description: 'Festa de Aniversário - Buffet',
    value: 500.00,
    dueDate: '2026-06-01',
    category: 'Lazer',
    status: 'pago'
  }
];
