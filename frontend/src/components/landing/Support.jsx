import { useState } from 'react';
import { Card } from '../ui';

const faqs = [
  ['Is real money involved?', 'No. TradeNova is a paper trading platform. You trade with virtual cash, so you cannot lose real money.'],
  ['Are the prices live?', 'Prices in this demo are simulated. Live market data is added later through a market data API.'],
  ['How do I reset my virtual cash?', 'Open Settings in the dashboard and choose Reset portfolio. Your cash goes back to ₹10,00,000.'],
  ['Can I use it on my phone?', 'Yes. Every page is built mobile-first and works on small screens.'],
];

export default function Support() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="support" className="mx-auto grid max-w-6xl scroll-mt-20 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
      <div>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Questions, answered</h2>
        <p className="mt-3 text-mute">Cannot find what you need? Write to us and we will reply within a day.</p>
        <Card className="mt-6">
          <p className="text-sm text-mute">Email</p>
          <a className="font-semibold text-primary hover:underline" href="mailto:support@tradenova.dev">support@tradenova.dev</a>
        </Card>
      </div>
      <div className="space-y-3">
        {faqs.map(([q, a], i) => (
          <div key={q} className="glass overflow-hidden">
            <button
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium"
              aria-expanded={openIdx === i}
              onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
            >
              {q}
              <span className={`text-mute transition-transform ${openIdx === i ? 'rotate-45' : ''}`} aria-hidden>+</span>
            </button>
            {openIdx === i && <p className="px-5 pb-5 text-sm text-mute animate-fade-in">{a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
