import { Outlet, NavLink, Link } from 'react-router-dom';

const Header = () => (
  <header className="fixed top-0 w-full z-50 flex items-center justify-between px-container-padding h-16 bg-surface/80 dark:bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-sm md:hidden transition-all duration-300 active:scale-95">
    <div className="flex items-center gap-sm">
      <span className="material-symbols-outlined text-primary text-[28px]" data-icon="account_balance_wallet" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
      <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary tracking-tight">DompetKu</h1>
    </div>
    <button aria-label="Notifications" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 text-on-surface-variant transition-all duration-300 active:scale-95">
      <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
    </button>
  </header>
);

const Sidebar = () => (
  <aside className="hidden lg:flex flex-col border-r border-outline-variant h-screen w-[250px] fixed left-0 top-0 bg-surface-container dark:bg-surface-container backdrop-blur-2xl shadow-2xl z-40">
    <div className="p-container-padding flex flex-col gap-sm border-b border-white/10">
      <div className="flex items-center gap-sm">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
          <img className="w-full h-full object-cover" alt="User Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRe82rCzakG8INBovC0qHU9-J-z_DsEtYzFuSez4rjHFNfcTN4AY0m8DhXtksybw4TU4HaV08DAMXvheg539syfjsBMgwuvfz50gWBPbcbmQg3-i_n32BZY-vuTAmlHkVjwIV4WBpzcq8n_mkf_OS0faqVM31rSwB5MeLLo5EOuSaCyT_GYp6xglgUP3oOyqAlLhtg40087oX1SePaGauNSkYqF1eO1RejKWuLixKFxRVateQzIQq_-kQYNpAC3ZHzdRZjsAo0Tg" />
        </div>
        <div className="flex flex-col">
          <span className="font-headline-md text-headline-md text-primary font-black">DompetKu</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">Digital Wealth Manager</span>
        </div>
      </div>
    </div>
    <nav className="flex-1 overflow-y-auto py-sm flex flex-col">
      <NavLink to="/" className={({ isActive }) => `flex items-center gap-4 rounded-lg px-4 py-3 mx-2 my-1 transition-all duration-200 ease-in-out font-label-md text-label-md ${isActive ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-variant hover:text-primary'}`}>
        <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
        Dashboard
      </NavLink>
      <NavLink to="/wallets" className={({ isActive }) => `flex items-center gap-4 rounded-lg px-4 py-3 mx-2 my-1 transition-all duration-200 ease-in-out font-label-md text-label-md ${isActive ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-variant hover:text-primary'}`}>
        <span className="material-symbols-outlined" data-icon="wallet">wallet</span>
        Dompet
      </NavLink>
      <NavLink to="/transactions" className={({ isActive }) => `flex items-center gap-4 rounded-lg px-4 py-3 mx-2 my-1 transition-all duration-200 ease-in-out font-label-md text-label-md ${isActive ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-variant hover:text-primary'}`}>
        <span className="material-symbols-outlined" data-icon="swap_horiz">swap_horiz</span>
        Transaksi
      </NavLink>
      <NavLink to="/savings" className={({ isActive }) => `flex items-center gap-4 rounded-lg px-4 py-3 mx-2 my-1 transition-all duration-200 ease-in-out font-label-md text-label-md ${isActive ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-variant hover:text-primary'}`}>
        <span className="material-symbols-outlined" data-icon="trending_up">trending_up</span>
        Tabungan
      </NavLink>
    </nav>
  </aside>
);

const BottomNav = () => (
  <nav className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center px-4 py-2 pb-safe bg-surface/90 dark:bg-surface/90 backdrop-blur-2xl border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] rounded-t-xl">
    <NavLink to="/" className={({ isActive }) => `flex flex-col items-center justify-center p-2 active:scale-90 transition-transform duration-200 w-[64px] ${isActive ? 'text-primary bg-primary-container/20 rounded-xl' : 'text-on-surface-variant hover:text-primary transition-colors'}`}>
      {({ isActive }) => (
        <>
          <span className="material-symbols-outlined mb-1 text-[24px]" data-icon="home" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>home</span>
          <span className={`font-label-sm text-[10px] ${isActive ? 'font-bold' : ''}`}>Beranda</span>
        </>
      )}
    </NavLink>
    
    <NavLink to="/wallets" className={({ isActive }) => `flex flex-col items-center justify-center p-2 active:scale-90 transition-transform duration-200 w-[64px] ${isActive ? 'text-primary bg-primary-container/20 rounded-xl' : 'text-on-surface-variant hover:text-primary transition-colors'}`}>
      {({ isActive }) => (
        <>
          <span className="material-symbols-outlined mb-1 text-[24px]" data-icon="account_balance_wallet" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>account_balance_wallet</span>
          <span className={`font-label-sm text-[10px] ${isActive ? 'font-bold' : ''}`}>Dompet</span>
        </>
      )}
    </NavLink>

    <Link to="/add" className="flex flex-col items-center justify-center -mt-8 w-[64px]">
      <div className="bg-gradient-to-b from-primary to-tertiary-container p-3 rounded-full shadow-[0_4px_15px_rgba(45,212,191,0.4)] text-on-primary active:scale-90 transition-transform duration-200 border-4 border-surface">
        <span className="material-symbols-outlined text-[28px]" data-icon="add">add</span>
      </div>
      <span className="font-label-sm text-[10px] text-on-surface-variant mt-1 opacity-0 h-0">Tambah</span>
    </Link>

    <NavLink to="/transactions" className={({ isActive }) => `flex flex-col items-center justify-center p-2 active:scale-90 transition-transform duration-200 w-[64px] ${isActive ? 'text-primary bg-primary-container/20 rounded-xl' : 'text-on-surface-variant hover:text-primary transition-colors'}`}>
      {({ isActive }) => (
        <>
          <span className="material-symbols-outlined mb-1 text-[24px]" data-icon="receipt_long" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>receipt_long</span>
          <span className={`font-label-sm text-[10px] ${isActive ? 'font-bold' : ''}`}>Riwayat</span>
        </>
      )}
    </NavLink>

    <NavLink to="/savings" className={({ isActive }) => `flex flex-col items-center justify-center p-2 active:scale-90 transition-transform duration-200 w-[64px] ${isActive ? 'text-primary bg-primary-container/20 rounded-xl' : 'text-on-surface-variant hover:text-primary transition-colors'}`}>
      {({ isActive }) => (
        <>
          <span className="material-symbols-outlined mb-1 text-[24px]" data-icon="savings" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>savings</span>
          <span className={`font-label-sm text-[10px] ${isActive ? 'font-bold' : ''}`}>Tabungan</span>
        </>
      )}
    </NavLink>
  </nav>
);

export const Layout = () => {
  return (
    <>
      <Header />
      <Sidebar />
      <Outlet />
      <BottomNav />
    </>
  );
};
