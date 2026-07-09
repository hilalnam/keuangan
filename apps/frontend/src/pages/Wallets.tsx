import { useEffect, useState } from 'react';
import { Modal } from '../components/Modal';
import { formatCurrency, getDashboardSummary, loadAppData, saveAppData, type AppData, type Wallet } from '../lib/app-data';

export const Wallets = () => {
  const [data, setData] = useState<AppData>(() => loadAppData());
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', icon: 'account_balance_wallet', initialBalance: '0' });

  useEffect(() => {
    saveAppData(data);
  }, [data]);

  const wallets = getDashboardSummary(data).wallets;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name) {
      return;
    }

    const wallet: Wallet = {
      id: `${Date.now()}`,
      name: form.name,
      icon: form.icon,
      color: '#2dd4bf',
      initialBalance: Number(form.initialBalance),
      createdAt: new Date().toISOString(),
    };

    setData((prev) => ({ ...prev, wallets: [wallet, ...prev.wallets] }));
    setForm({ name: '', icon: 'account_balance_wallet', initialBalance: '0' });
    setShowModal(false);
  };

  const handleDeleteWallet = (walletId: string) => {
    if (!window.confirm('Hapus dompet ini?')) {
      return;
    }

    setData((prev) => ({
      ...prev,
      wallets: prev.wallets.filter((wallet) => wallet.id !== walletId),
      transactions: prev.transactions.filter((transaction) => transaction.walletId !== walletId),
    }));
  };

  return (
    <main className="pt-24 pb-32 px-container-padding max-w-4xl mx-auto w-full md:pt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md mb-xl">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Dompet Saya</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Kelola sumber dana dan rekening Anda.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center justify-center gap-xs bg-gradient-to-r from-primary-container to-secondary-container hover:from-primary hover:to-secondary text-on-primary-container font-label-md text-label-md py-sm px-md rounded-full shadow-[0_0_20px_rgba(45,212,191,0.2)] hover:shadow-[0_0_25px_rgba(45,212,191,0.4)] transition-all duration-300 active:scale-95 w-full sm:w-auto self-start sm:self-auto">
          <span className="material-symbols-outlined text-[18px]" data-icon="add">add</span>
          Tambah Dompet
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          {wallets.length > 0 ? wallets.map((wallet) => (
            <div key={wallet.id} className="group relative bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-lg overflow-hidden hover:border-primary-container/50 transition-colors duration-300">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500"></div>
              <div className="flex justify-between items-start mb-xl relative z-10">
                <div className="flex items-center gap-sm">
                  <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-primary border border-white/5">
                    <span className="material-symbols-outlined" data-icon={wallet.icon || 'account_balance'}>{wallet.icon || 'account_balance'}</span>
                  </div>
                  <span className="font-label-md text-label-md text-on-surface-variant tracking-wider uppercase">{wallet.name}</span>
                </div>
                <div className="flex gap-2">
                  <button aria-label="Edit" className="text-on-surface-variant hover:text-primary transition-colors p-1">
                    <span className="material-symbols-outlined text-[20px]" data-icon="edit">edit</span>
                  </button>
                  <button aria-label="Hapus" onClick={() => handleDeleteWallet(wallet.id)} className="text-on-surface-variant hover:text-error transition-colors p-1">
                    <span className="material-symbols-outlined text-[20px]" data-icon="delete">delete</span>
                  </button>
                </div>
              </div>
              <div className="relative z-10">
                <p className="font-body-sm text-on-surface-variant mb-1">Saldo Aktif</p>
                <h3 className="font-headline-lg text-headline-lg text-on-surface">{formatCurrency(wallet.balance)}</h3>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-container to-transparent opacity-50"></div>
            </div>
          )) : (
            <div className="col-span-full rounded-2xl border border-dashed border-outline-variant/50 p-lg text-center text-on-surface-variant">
              Belum ada dompet. Tambahkan dompet pertama Anda.
            </div>
          )}

          <button onClick={() => setShowModal(true)} className="flex flex-col items-center justify-center min-h-[160px] bg-transparent border-2 border-dashed border-outline-variant/50 rounded-2xl hover:border-primary hover:bg-surface-variant/20 transition-all duration-300 group cursor-pointer active:scale-95">
            <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant group-hover:text-primary group-hover:bg-primary/10 transition-colors mb-sm">
              <span className="material-symbols-outlined text-[28px]" data-icon="add">add</span>
            </div>
            <span className="font-label-md text-label-md text-on-surface-variant group-hover:text-on-surface transition-colors">Tambah Dompet Baru</span>
          </button>
        </div>

      <Modal open={showModal} title="Tambah Dompet" onClose={() => setShowModal(false)}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm text-on-surface">
            Nama Dompet
            <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="rounded-xl border border-outline-variant bg-surface px-3 py-2" placeholder="Contoh: Bank BCA" />
          </label>
          <label className="flex flex-col gap-2 text-sm text-on-surface">
            Ikon
            <input value={form.icon} onChange={(event) => setForm({ ...form, icon: event.target.value })} className="rounded-xl border border-outline-variant bg-surface px-3 py-2" placeholder="account_balance_wallet" />
          </label>
          <label className="flex flex-col gap-2 text-sm text-on-surface">
            Saldo Awal
            <input type="number" min="0" value={form.initialBalance} onChange={(event) => setForm({ ...form, initialBalance: event.target.value })} className="rounded-xl border border-outline-variant bg-surface px-3 py-2" />
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
