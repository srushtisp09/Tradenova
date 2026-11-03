import { Card, Button } from '../ui';

// Demo pricing for the project. No payments are connected.
const plans = [
  { name: 'Starter', price: '₹0', note: 'free forever', perks: ['₹10,00,000 virtual cash', 'Watchlist and order history', 'Basic charts'], cta: 'Start free' },
  { name: 'Trader', price: '₹199', note: 'per month', perks: ['Everything in Starter', 'Portfolio analytics', 'Price alerts', 'Export trades to CSV'], cta: 'Choose Trader', featured: true },
  { name: 'Classroom', price: '₹999', note: 'per month, up to 30 learners', perks: ['Everything in Trader', 'Shared leaderboard', 'Teacher view'], cta: 'Choose Classroom' },
];

export default function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple pricing</h2>
      <p className="mt-2 text-mute">Demo pricing for this project. No payment is taken.</p>
      <div className="mt-10 grid items-stretch gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <Card key={p.name} className={`flex flex-col p-7 ${p.featured ? 'border-ink ring-1 ring-ink/30 md:-translate-y-3' : ''}`}>
            <h3 className="font-semibold">{p.name}</h3>
            <p className="num mt-4 text-4xl font-bold">{p.price}</p>
            <p className="text-sm text-mute">{p.note}</p>
            <ul className="mt-6 flex-1 space-y-2.5 text-sm">
              {p.perks.map((perk) => (
                <li key={perk} className="flex gap-2"><span className="text-profit" aria-hidden>✓</span>{perk}</li>
              ))}
            </ul>
            <a href="#open-account" className="mt-7"><Button variant={p.featured ? 'primary' : 'outline'} className="w-full">{p.cta}</Button></a>
          </Card>
        ))}
      </div>
    </section>
  );
}
