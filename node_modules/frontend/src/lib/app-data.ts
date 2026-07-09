export type Wallet = {
  id: string;
  name: string;
  icon: string;
  color: string;
  initialBalance: number;
  createdAt: string;
};

export type Transaction = {
  id: string;
  walletId: string;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  transactionDate: string;
  category: string;
  notes?: string;
};

export type SavingsGoal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
  color: string;
  targetDate?: string;
};

export type AppData = {
  wallets: Wallet[];
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
};

const STORAGE_KEY = 'dompetku-app-data';

function createDefaultData(): AppData {
  return {
    wallets: [],
    transactions: [],
    savingsGoals: [],
  };
}

export function loadAppData(): AppData {
  if (typeof window === 'undefined') {
    return createDefaultData();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const data = createDefaultData();
      saveAppData(data);
      return data;
    }

    const parsed = JSON.parse(raw) as AppData;
    return {
      wallets: parsed.wallets ?? [],
      transactions: parsed.transactions ?? [],
      savingsGoals: parsed.savingsGoals ?? [],
    };
  } catch {
    const data = createDefaultData();
    saveAppData(data);
    return data;
  }
}

export function saveAppData(data: AppData) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getWalletBalance(wallet: Wallet, transactions: Transaction[]) {
  return wallet.initialBalance + transactions.reduce((sum, tx) => {
    if (tx.walletId !== wallet.id) {
      return sum;
    }

    if (tx.type === 'income') {
      return sum + tx.amount;
    }
    if (tx.type === 'expense') {
      return sum - tx.amount;
    }
    return sum;
  }, 0);
}

export function getDashboardSummary(data: AppData) {
  const wallets = data.wallets.map((wallet) => ({
    ...wallet,
    balance: getWalletBalance(wallet, data.transactions),
  }));

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthTransactions = data.transactions.filter((tx) => new Date(tx.transactionDate) >= startOfMonth);

  const monthlyIncome = monthTransactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const monthlyExpense = monthTransactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return {
    totalBalance: wallets.reduce((sum, wallet) => sum + wallet.balance, 0),
    monthlyChange: monthlyIncome - monthlyExpense,
    monthlyIncome,
    monthlyExpense,
    wallets,
    recentTransactions: [...data.transactions]
      .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
      .slice(0, 5)
      .map((tx) => ({
        ...tx,
        walletName: wallets.find((wallet) => wallet.id === tx.walletId)?.name ?? 'Dompet',
      })),
  };
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}
