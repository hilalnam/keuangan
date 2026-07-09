import { useEffect, useMemo, useState } from 'react';
import { Modal } from '../components/Modal';
import { formatCurrency, getDashboardSummary, loadAppData, saveAppData, type AppData } from '../lib/app-data';

const HeroCard = ({ totalBalance, monthlyChange }: { totalBalance: number; monthlyChange: number }) => (
  <section className="relative rounded-2xl p-lg overflow-hidden bg-gradient-to-br from-primary-container to-secondary-container shadow-[0_8px_32px_rgba(45,212,191,0.2)]">
    <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
    <div className="relative z-10 flex flex-col gap-xs">
      <span className="font-label-md text-label-md text-white/80 uppercase tracking-wider">Total Saldo</span>
      <h2 className="font-display-lg text-display-lg text-white">{formatCurrency(totalBalance)}</h2>
      <div className="flex items-center gap-xs mt-sm bg-white/20 w-fit px-sm py-xs rounded-full backdrop-blur-md">
        <span className="material-symbols-outlined text-white text-[16px]" data-icon="trending_up">trending_up</span>
        <span className="font-label-sm text-label-sm text-white">{monthlyChange >= 0 ? '+' : ''}{formatCurrency(monthlyChange)} bulan ini</span>
      </div>
    </div>
    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/30 rounded-full blur-3xl -mr-32 -mt-32"></div>
    <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/30 rounded-full blur-2xl -ml-24 -mb-24"></div>
  </section>
);

const SummaryCards = ({ monthlyIncome, monthlyExpense }: { monthlyIncome: number; monthlyExpense: number }) => (
  <section className="grid grid-cols-2 gap-md">
    <div className="bg-surface-container/50 backdrop-blur-xl border border-white/5 rounded-xl p-md flex flex-col gap-xs relative overflow-hidden">
      <div className="absolute right-0 top-0 w-24 h-24 bg-tertiary-container/20 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
      <div className="w-8 h-8 rounded-full bg-tertiary-container/20 flex items-center justify-center mb-xs">
        <span className="material-symbols-outlined text-tertiary font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_downward</span>
      </div>
      <span className="font-label-sm text-label-sm text-on-surface-variant">Pemasukan</span>
      <span className="font-headline-md text-headline-md text-tertiary">{formatCurrency(monthlyIncome)}</span>
    </div>
    <div className="bg-surface-container/50 backdrop-blur-xl border border-white/5 rounded-xl p-md flex flex-col gap-xs relative overflow-hidden">
      <div className="absolute right-0 top-0 w-24 h-24 bg-error/20 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
      <div className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center mb-xs">
        <span className="material-symbols-outlined text-error font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_upward</span>
      </div>
      <span className="font-label-sm text-label-sm text-on-surface-variant">Pengeluaran</span>
      <span className="font-headline-md text-headline-md text-error">{formatCurrency(monthlyExpense)}</span>
    </div>
  </section>
);

const WalletList = ({ wallets, onAdd }: { wallets: Array<{ name: string; balance: number }>; onAdd: () => void }) => (
  <section className="lg:col-span-1 bg-surface-container/30 backdrop-blur-lg border border-white/5 rounded-xl p-md flex flex-col gap-md h-fit shadow-lg">
    <h3 className="font-headline-md text-headline-md text-on-surface">Daftar Dompet</h3>
    <div className="flex flex-col gap-sm">
      {wallets.length > 0 ? wallets.map((wallet) => (
        <div key={wallet.name} className="flex items-center justify-between p-sm rounded-lg bg-surface-variant/50 border border-white/5 hover:bg-surface-variant transition-colors cursor-pointer group">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 rounded-full bg-secondary-container/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-secondary" data-icon="account_balance">account_balance</span>
            </div>
            <span className="font-label-md text-label-md text-on-surface">{wallet.name}</span>
          </div>
          <span className="font-headline-md text-headline-md text-on-surface text-[16px]">{formatCurrency(wallet.balance)}</span>
        </div>
      )) : (
        <p className="text-sm text-on-surface-variant">Belum ada dompet.</p>
      )}
    </div>
    <button onClick={onAdd} className="w-full mt-auto py-xs rounded-lg border border-primary/30 text-primary font-label-md text-label-md hover:bg-primary/10 transition-colors flex items-center justify-center gap-xs">
      <span className="material-symbols-outlined text-[18px]" data-icon="add">add</span>
      Tambah Dompet
    </button>
  </section>
);

const TransactionList = ({ recentTransactions, onAdd }: { recentTransactions: Array<{ id: string; description: string; amount: number; type: 'income' | 'expense' | 'transfer'; walletName: string }>; onAdd: () => void }) => (
  <section className="lg:col-span-2 bg-surface-container/30 backdrop-blur-lg border border-white/5 rounded-xl p-md flex flex-col gap-md shadow-lg">
    <div className="flex items-center justify-between">
      <h3 className="font-headline-md text-headline-md text-on-surface">Transaksi Terakhir</h3>
      <button onClick={onAdd} className="text-primary font-label-md text-label-md hover:underline">Tambah Transaksi</button>
    </div>
    <div className="flex flex-col gap-base">
      {recentTransactions.length > 0 ? recentTransactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center justify-between p-sm border-b border-white/5 last:border-0 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
          <div className="flex items-center gap-sm">
            <div className={`w-10 h-10 rounded-full ${transaction.type === 'income' ? 'bg-tertiary-container/20' : transaction.type === 'expense' ? 'bg-error/10' : 'bg-secondary-container/20'} flex items-center justify-center`}>
              <span className="material-symbols-outlined text-on-surface-variant" data-icon={transaction.type === 'income' ? 'add_circle' : transaction.type === 'expense' ? 'remove_circle' : 'swap_horiz'}>{transaction.type === 'income' ? 'add_circle' : transaction.type === 'expense' ? 'remove_circle' : 'swap_horiz'}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface">{transaction.description}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">{transaction.walletName}</span>
            </div>
          </div>
          <span className={`font-body-md text-body-md ${transaction.type === 'income' ? 'text-tertiary' : 'text-on-surface'}`}>{transaction.type === 'income' ? '+' : ''}{formatCurrency(transaction.amount)}</span>
        </div>
      )) : (
        <p className="text-sm text-on-surface-variant">Belum ada transaksi.</p>
      )}
    </div>
  </section>
);

export const Home = () => {
  const [data, setData] = useState<AppData>(() => loadAppData());
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ walletId: '', description: '', amount: '0', type: 'expense' as 'income' | 'expense' | 'transfer', transactionDate: new Date().toISOString().slice(0, 16) });

  useEffect(() => {
    saveAppData(data);
  }, [data]);

  const dashboard = useMemo(() => getDashboardSummary(data), [data]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.walletId || !form.description) {
      window.alert('Lengkapi data transaksi');
      return;
    }

    const wallet = data.wallets.find((item) => item.id === form.walletId);
    if (!wallet) {
      window.alert('Pilih dompet yang valid');
      return;
    }

    const transaction = {
      id: `${Date.now()}`,
      walletId: wallet.id,
      description: form.description,
      amount: Number(form.amount),
      type: form.type,
      transactionDate: new Date(form.transactionDate).toISOString(),
      category: form.type === 'income' ? 'Pemasukan' : form.type === 'expense' ? 'Pengeluaran' : 'Transfer',
    };

    setData((prev) => ({ ...prev, transactions: [transaction, ...prev.transactions] }));
    setForm({ walletId: '', description: '', amount: '0', type: 'expense', transactionDate: new Date().toISOString().slice(0, 16) });
    setShowModal(false);
  };

  return (
    <main className="pt-20 px-container-padding max-w-[1200px] mx-auto md:pt-8 flex flex-col gap-lg pb-32">
      <>
        <HeroCard totalBalance={dashboard.totalBalance} monthlyChange={dashboard.monthlyChange} />
        <SummaryCards monthlyIncome={dashboard.monthlyIncome} monthlyExpense={dashboard.monthlyExpense} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
          <WalletList wallets={dashboard.wallets} onAdd={() => setShowModal(true)} />
          <TransactionList recentTransactions={dashboard.recentTransactions} onAdd={() => setShowModal(true)} />
        </div>
      </>

      <Modal open={showModal} title="Tambah Transaksi" onClose={() => setShowModal(false)}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm text-on-surface">
            Deskripsi
            <input required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="rounded-xl border border-outline-variant bg-surface px-3 py-2" />
          </label>
          <label className="flex flex-col gap-2 text-sm text-on-surface">
            Jumlah
            <input required type="number" min="1" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} className="rounded-xl border border-outline-variant bg-surface px-3 py-2" />
          </label>
          <label className="flex flex-col gap-2 text-sm text-on-surface">
            Tipe
            <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as 'income' | 'expense' | 'transfer' })} className="rounded-xl border border-outline-variant bg-surface px-3 py-2">
              <option value="expense">Pengeluaran</option>
              <option value="income">Pemasukan</option>
              <option value="transfer">Transfer</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm text-on-surface">
            Dompet
            <select value={form.walletId} onChange={(event) => setForm({ ...form, walletId: event.target.value })} className="rounded-xl border border-outline-variant bg-surface px-3 py-2">
              <option value="">Pilih dompet</option>
              {data.wallets.map((wallet) => (
                <option key={wallet.id} value={wallet.id}>{wallet.name}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm text-on-surface">
            Tanggal
            <input type="datetime-local" value={form.transactionDate} onChange={(event) => setForm({ ...form, transactionDate: event.target.value })} className="rounded-xl border border-outline-variant bg-surface px-3 py-2" />
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="rounded-xl px-4 py-2 text-sm text-on-surface-variant">Batal</button>
            <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary-container">Simpan</button>
          </div>
        </form>
      </Modal>
    </main>
  );
};
