import { useEffect, useMemo, useState } from 'react';
import { Modal } from '../components/Modal';
import { formatCurrency, loadAppData, saveAppData, type AppData } from '../lib/app-data';

export const Transactions = () => {
  const [data, setData] = useState<AppData>(() => loadAppData());
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ walletId: '', description: '', amount: '0', type: 'expense' as 'income' | 'expense' | 'transfer', transactionDate: new Date().toISOString().slice(0, 16) });

  useEffect(() => {
    saveAppData(data);
  }, [data]);

  const transactions = useMemo(() => [...data.transactions].sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()), [data.transactions]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.walletId || !form.description) {
      window.alert('Lengkapi data transaksi');
      return;
    }

    const transaction = {
      id: `${Date.now()}`,
      walletId: form.walletId,
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

  const grouped = useMemo(() => {
    const groups = new Map<string, typeof transactions>();
    transactions.forEach((tx) => {
      const monthKey = new Date(tx.transactionDate).toLocaleString('id-ID', { month: 'long', year: 'numeric' });
      const list = groups.get(monthKey) ?? [];
      list.push(tx);
      groups.set(monthKey, list);
    });
    return Array.from(groups.entries());
  }, [transactions]);

  return (
    <>
      <div className="fixed inset-0 z-[-1] pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary-container blur-[100px] opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-secondary-container blur-[120px] opacity-20"></div>
      </div>

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-container-padding pt-[80px] md:pt-lg pb-lg flex flex-col gap-lg pb-[100px]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-display-lg text-display-lg text-on-surface mb-2">Riwayat Transaksi</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Pantau arus kas Anda dengan detail.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-container to-secondary py-3 px-6 rounded-xl font-label-md text-label-md font-bold text-on-primary-container shadow-[0_0_15px_rgba(45,212,191,0.3)] hover:shadow-[0_0_25px_rgba(45,212,191,0.5)] transition-all duration-300 active:scale-95 relative ambient-glow w-full md:w-auto">
            <span className="material-symbols-outlined">add</span>
            Tambah Transaksi
          </button>
        </div>

        <div className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input className="w-full glass-input rounded-xl py-3 pl-10 pr-4 text-on-surface font-body-md text-body-md placeholder-on-surface-variant/50 focus:ring-0" placeholder="Cari transaksi..." type="text" />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-[150px]">
              <select className="w-full glass-input appearance-none rounded-xl py-3 px-4 pr-10 text-on-surface font-body-md text-body-md cursor-pointer">
                <option value="all">Semua Bulan</option>
                <option value="current">Bulan Ini</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-xl">
          {grouped.map(([month, items]) => (
            <section key={month} className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-outline-variant pb-2">
                <h2 className="font-headline-md text-headline-md text-on-surface">{month}</h2>
                <span className="font-label-md text-label-md text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">{formatCurrency(items.reduce((sum, item) => sum + (item.type === 'expense' ? -item.amount : item.type === 'income' ? item.amount : 0), 0))}</span>
              </div>
              <div className="flex flex-col gap-2">
                {items.map((tx) => (
                  <div key={tx.id} className="glass-panel rounded-xl p-4 flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className={`w-12 h-12 rounded-full ${tx.type === 'expense' ? 'bg-error-container/20 text-error' : tx.type === 'income' ? 'bg-tertiary-container/20 text-tertiary' : 'bg-secondary-container/20 text-secondary'} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <span className="material-symbols-outlined">{tx.type === 'expense' ? 'remove_circle' : tx.type === 'income' ? 'add_circle' : 'swap_horiz'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-label-md text-label-md text-on-surface truncate font-semibold">{tx.description}</h3>
                      <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">account_balance_wallet</span>
                        {data.wallets.find((wallet) => wallet.id === tx.walletId)?.name ?? 'Dompet'}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`font-body-md text-body-md ${tx.type === 'income' ? 'text-tertiary' : 'text-on-surface'} font-semibold`}>{tx.type === 'income' ? '+' : tx.type === 'expense' ? '-' : ''}{formatCurrency(tx.amount)}</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">{new Date(tx.transactionDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

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
    </>
  );
};
