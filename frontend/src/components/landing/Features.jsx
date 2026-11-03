import { Card } from '../ui';

// Bento layout: the first card is bigger on purpose, it is the main idea.
const features = [
  { title: 'Paper trading with real rules', text: 'Start with ₹10,00,000 of virtual cash. Place buy and sell orders, track holdings and positions, and see your profit and loss update.', big: true },
  { title: 'Charts you can read', text: 'Price history and portfolio growth, drawn clearly on any screen size.' },
  { title: 'Watchlist', text: 'Keep the stocks you care about in one list, with price and day change.' },
  { title: 'Order history', text: 'Every trade is saved, so you can review what worked and what did not.' },
  { title: 'Built for phones too', text: 'The same dashboard on a laptop, tablet or phone. Dark and light modes included.' },
  { title: 'Safe by design', text: 'No real money moves. Passwords are hashed and every request is checked.' },
];

export default function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">Everything a trading screen needs, nothing you can lose money on</h2>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title} className={f.big ? 'md:col-span-2 md:row-span-2 flex flex-col justify-end p-7' : ''}>
            <h3 className={f.big ? 'text-2xl font-bold' : 'font-semibold'}>{f.title}</h3>
            <p className={`mt-2 text-mute ${f.big ? 'max-w-md text-base' : 'text-sm'}`}>{f.text}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
