import { Card } from '../ui';

const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || 'http://localhost:5174';

const paths = [
  { key: 'beginner', emoji: '🌱', title: "I'm new to the market", text: 'Learn step by step with games, quizzes and simple words. No jargon, no pressure.', perks: ['Bite-sized lessons', 'A price tug-of-war you can play', 'Earn XP and level up'], cta: 'Start learning' },
  { key: 'pro', emoji: '📈', title: 'I already trade', text: 'Market pulse, risk checks and clear ideas on what to change in your portfolio.', perks: ['Top gainers and losers', 'Sector exposure check', 'A "what to change" list'], cta: 'Open insights' },
];

// Two doors into the dashboard: the link carries ?track=... so the dashboard opens the right one.
export default function Paths() {
  return (
    <section id="paths" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">Pick your path</h2>
      <p className="mt-2 text-mute">Same platform, built for where you are today.</p>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {paths.map((p) => (
          <a key={p.key} href={`${DASHBOARD_URL}/?track=${p.key}`} className="block">
            <Card className="h-full p-7 transition hover:-translate-y-1 hover:border-ink">
              <span className="text-5xl">{p.emoji}</span>
              <h3 className="mt-5 text-xl font-bold">{p.title}</h3>
              <p className="mt-2 text-mute">{p.text}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {p.perks.map((x) => <li key={x} className="flex gap-2"><span className="text-profit" aria-hidden>✓</span>{x}</li>)}
              </ul>
              <p className="mt-6 font-semibold text-primary">{p.cta} →</p>
            </Card>
          </a>
        ))}
      </div>
    </section>
  );
}
