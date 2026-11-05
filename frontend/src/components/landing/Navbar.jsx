import { useState } from 'react';
import { Button } from '../ui';

const links = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Support', href: '#support' },
  { label: 'Explore 3D', href: '#explore' },
];
const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || 'http://localhost:5174';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-bg/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6" aria-label="Main">
        <a href="#top" className="text-xl font-extrabold tracking-tight">
          Trade<span className="text-gradient">Nova</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-sm text-mute transition hover:text-ink">{l.label}</a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <a href={`${DASHBOARD_URL}/login`}><Button variant="ghost" size="sm">Log in</Button></a>
          <a href={`${DASHBOARD_URL}/register`}><Button size="sm">Open account</Button></a>
        </div>

        <button
          className="rounded-lg border border-line px-3 py-2 text-sm md:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? '✕' : '☰'}
        </button>
      </nav>

      {open && (
        <div className="border-t border-line/60 bg-bg/95 px-4 pb-5 pt-3 md:hidden animate-fade-in">
          <ul className="space-y-1">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-mute hover:bg-line/40 hover:text-ink">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center gap-3">
            <a href={`${DASHBOARD_URL}/login`} className="flex-1">
              <Button variant="outline" className="w-full">Log in</Button>
            </a>
            <a href={`${DASHBOARD_URL}/register`} onClick={() => setOpen(false)} className="flex-1">
              <Button className="w-full">Open account</Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
