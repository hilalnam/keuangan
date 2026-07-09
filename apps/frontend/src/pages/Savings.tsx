import { useEffect, useMemo, useState } from 'react';
import { Modal } from '../components/Modal';
import { formatCurrency, loadAppData, saveAppData, type AppData, type SavingsGoal } from '../lib/app-data';

export const Savings = () => {
  const [data, setData] = useState<AppData>(() => loadAppData());
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', targetAmount: '0', currentAmount: '0', icon: 'savings' });

  useEffect(() => {
    saveAppData(data);
  }, [data]);

  const goals = useMemo(() => data.savingsGoals, [data.savingsGoals]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name) {
      return;
    }

    const goal: SavingsGoal = {
      id: `${Date.now()}`,
      name: form.name,
      targetAmount: Number(form.targetAmount),
      currentAmount: Number(form.currentAmount),
      icon: form.icon,
      color: '#2dd4bf',
    };

    setData((prev) => ({ ...prev, savingsGoals: [goal, ...prev.savingsGoals] }));
    setForm({ name: '', targetAmount: '0', currentAmount: '0', icon: 'savings' });
    setShowModal(false);
  };

  const handleDeleteGoal = (goalId: string) => {
    if (!window.confirm('Hapus target tabungan ini?')) {
      return;
    }

    setData((prev) => ({
      ...prev,
      savingsGoals: prev.savingsGoals.filter((goal) => goal.id !== goalId),
    }));
  };

  return (
    <main className="flex-1 px-container-padding pt-24 pb-28 md:pt-12 md:pb-12 max-w-5xl mx-auto w-full relative z-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-xl">
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-1">Target Tabungan</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Kelola impian finansial Anda.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-gradient-to-r from-primary-container to-secondary-container hover:from-primary-fixed hover:to-secondary-fixed text-on-primary-container px-6 py-3 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_4px_20px_rgba(45,212,191,0.25)] hover:shadow-[0_6px_25px_rgba(45,212,191,0.4)] active:scale-95 group relative overflow-hidden">
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="material-symbols-outlined text-[20px]" data-icon="add_circle">add_circle</span>
          Buat Target
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md md:gap-lg">
        {goals.map((goal) => {
          const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          return (
            <article key={goal.id} className="bg-surface-variant/30 backdrop-blur-xl border border-white/10 rounded-xl p-lg relative overflow-hidden flex flex-col group transition-all duration-300 hover:border-primary/30 hover:bg-surface-variant/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors pointer-events-none"></div>
              <div className="flex justify-between items-start mb-md relative z-10">
                <div className="flex items-center gap-sm">
                  <div className="w-12 h-12 rounded-lg bg-tertiary-container/10 flex items-center justify-center border border-tertiary-container/20 text-tertiary-container shadow-[0_0_10px_rgba(68,214,155,0.1)]">
                    <span className="material-symbols-outlined text-[24px]" data-icon={goal.icon}>{goal.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">{goal.name}</h3>
                    <p className="font-label-sm text-label-sm text-on-surface-variant font-normal mt-0.5">Target: {formatCurrency(goal.targetAmount)}</p>
                  </div>
                </div>
                <button aria-label="Hapus target" onClick={() => handleDeleteGoal(goal.id)} className="text-on-surface-variant hover:text-error transition-colors p-1 relative z-10">
                  <span className="material-symbols-outlined text-[20px]" data-icon="delete">delete</span>
                </button>
              </div>
              <div className="mb-lg relative z-10">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant font-normal mb-1">Terkumpul</p>
                    <p className="font-headline-md text-headline-md text-primary">{formatCurrency(goal.currentAmount)}</p>
                  </div>
                  <span className="font-label-md text-label-md text-tertiary font-bold bg-tertiary/10 px-2 py-1 rounded">{percent}%</span>
                </div>
                <div className="w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden border border-black/20 shadow-inner relative">
                  <div className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full relative shadow-[0_0_10px_rgba(87,241,219,0.5)]" style={{ width: `${percent}%` }}></div>
                </div>
              </div>
              <div className="mt-auto relative z-10">
                <button className="w-full py-2.5 rounded-lg border border-primary/40 text-primary font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors">
                  <span className="material-symbols-outlined text-[18px]" data-icon="add">add</span>
                  Tambah Saldo
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <Modal open={showModal} title="Buat Target Tabungan" onClose={() => setShowModal(false)}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm text-on-surface">
            Nama Target
            <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="rounded-xl border border-outline-variant bg-surface px-3 py-2" />
          </label>
          <label className="flex flex-col gap-2 text-sm text-on-surface">
            Target Amount
            <input required type="number" min="1" value={form.targetAmount} onChange={(event) => setForm({ ...form, targetAmount: event.target.value })} className="rounded-xl border border-outline-variant bg-surface px-3 py-2" />
          </label>
          <label className="flex flex-col gap-2 text-sm text-on-surface">
            Saldo Saat Ini
            <input type="number" min="0" value={form.currentAmount} onChange={(event) => setForm({ ...form, currentAmount: event.target.value })} className="rounded-xl border border-outline-variant bg-surface px-3 py-2" />
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
