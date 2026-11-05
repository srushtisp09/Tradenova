import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Cursor } from '../ui';
import OrderModal from '../dashboard/OrderModal';
import TrackPicker from '../dashboard/TrackPicker';
import { Change } from '../dashboard/Change';
import { useTrack } from '../../context/TrackContext';
import { useTrading } from '../../context/TradingContext';
import { Loading, ErrorBox } from '../dashboard/DataState';

const WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL || 'http://localhost:5173';

// The menu. Items with "tracks" only show for that track.
export const navItems = [
  { to: '/learn', label: 'Learn', tracks: ['beginner'] },
  { to: '/', label: 'Overview', end: true },
  { to: '/insights', label: 'Insights', tracks: ['pro'] },
  { to: '/holdings', label: 'Holdings' },
  { to: '/positions', label: 'Positions', tracks: ['pro'] },
  { to: '/watchlist', label: 'Watchlist' },
  { to: '/orders', label: 'Orders', tracks: ['pro'] },
];

const useNavItems = () => {
  const { track } = useTrack();
  return navItems.filter((n) => !n.tracks || n.tracks.includes(track || 'pro'));
};

function TrackSwitch() {
  const { track, setTrack } = useTrack();
  const navigate = useNavigate();
  const pick = (t) => { setTrack(t); navigate(t === 'beginner' ? '/learn' : '/insights'); };
  return (
    <div className="flex rounded-full border border-line p-0.5 text-xs" role="group" aria-label="Choose your track">
      {[['beginner', '🌱 Beginner'], ['pro', '📈 Pro']].map(([k, l]) => (
        <button key={k} onClick={() => pick(k)} aria-pressed={track === k}
          className={`rounded-full px-4 py-2 transition ${track === k ? 'bg-ink text-bg' : 'text-mute hover:text-ink'}`}>{l}</button>
      ))}
    </div>
  );
}

function IndexChip({ symbol }) {
  const { quotes, bySymbol } = useTrading();
  const info = bySymbol[symbol];
  if (!info || quotes[symbol] == null) return null;
  const change = ((quotes[symbol] - info.prevClose) / info.prevClose) * 100;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-white/60">{info.name}</span>
      <span className="num text-white">{quotes[symbol].toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      <Change value={change} kind="pct" className="text-xs" />
    </div>
  );
}

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const items = useNavItems();
  const { loading, error, refetch } = useTrading();
  const needsData = !pathname.startsWith('/learn'); // the academy works even if the server is down
  const title = navItems.find((n) => (n.end ? pathname === n.to : pathname.startsWith(n.to)))?.label ?? 'Dashboard';

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; }, [open]);

  return (
    <div className="min-h-screen">
      <Cursor />

      {/* Header: wordmark left, Menu right. It uses "difference" blending like the 3D page. */}
      <header className={`fixed inset-x-0 top-0 z-[90] flex items-start justify-between px-5 pt-5 sm:px-8 ${open ? '' : 'mix-blend-difference'}`}>
        <a href={WEBSITE_URL} className="font-serif text-2xl leading-none text-white">Trade<em className="not-italic">Nova</em></a>
        <div className="hidden items-center gap-8 md:flex"><IndexChip symbol="NIFTY" /><IndexChip symbol="SENSEX" /></div>
        <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="nav-menu" aria-label={open ? 'Close menu' : 'Open menu'}
          className="group flex min-h-11 min-w-11 flex-col items-end gap-1.5 text-white">
          <span className={`text-sm transition-opacity ${open ? 'opacity-0' : ''}`}>Menu</span>
          <span className="relative block h-5 w-12">
            <i className={`absolute left-0 right-0 top-1/2 h-px bg-white transition-transform duration-500 ${open ? 'rotate-45' : '-translate-y-[5px]'}`} />
            <i className={`absolute top-1/2 h-px bg-white transition-all duration-500 ${open ? 'left-0 right-0 -rotate-45' : 'right-0 w-9 translate-y-[5px] group-hover:-translate-x-2'}`} />
          </span>
        </button>
      </header>

      {/* Full-screen menu that wipes down, like the 3D page */}
      <div id="nav-menu" aria-hidden={!open} inert={open ? undefined : ''}
        className={`fixed inset-0 z-[80] grid place-items-center bg-[#050505] transition-[clip-path] duration-[850ms] ease-in-out ${open ? '[clip-path:inset(0)]' : 'pointer-events-none [clip-path:inset(0_0_100%_0)]'}`}>
        <nav className="flex flex-col items-center gap-1 text-center" aria-label="Dashboard">
          {items.map((i) => (
            <NavLink key={i.to} to={i.to} end={i.end}
              className={({ isActive }) => `font-serif text-[clamp(34px,7vw,72px)] leading-[1.1] transition-all hover:tracking-[.012em] hover:opacity-100 ${isActive ? 'opacity-100' : 'opacity-55'}`}>
              {i.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute inset-x-5 bottom-6 flex flex-wrap items-center justify-between gap-4 text-xs text-mute sm:inset-x-8">
          <TrackSwitch />
          <span><a className="hover:text-ink" href={`${WEBSITE_URL}/explore/index.html`}>Explore in 3D</a> · <a className="hover:text-ink" href={WEBSITE_URL}>Back to website</a></span>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-5 pb-16 pt-28 sm:px-8">
        <h1 className="mb-8 text-4xl tracking-tight sm:text-5xl">{title}</h1>
        <div key={pathname} className="animate-fade-in">
          {needsData && error ? <ErrorBox message={error} onRetry={refetch} /> : needsData && loading ? <Loading /> : <Outlet />}
        </div>
        <p className="mt-12 text-center text-xs text-mute">Demo data and virtual money. Not investment advice.</p>
      </main>
      <OrderModal />
      <TrackPicker />
    </div>
  );
}
