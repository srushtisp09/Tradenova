import { Button } from '../ui';
import HeroChart from './HeroChart';

const stats = [
  ['₹10,00,000', 'virtual cash to start'],
  ['₹0', 'brokerage, always'],
  ['Pro layout', 'charts, orders, holdings'],
];

export default function Hero() {
  return (
    <section id="top" className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 md:pt-20 lg:grid-cols-2 lg:gap-14">
      <div className="animate-slide-up">
        <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          Practice the market
          <br />
          before it costs you <span className="text-gradient whitespace-nowrap">a rupee.</span>
        </h1>
        <p className="mt-5 max-w-lg text-lg text-mute">
          TradeNova gives you ₹10 lakh of virtual money, live-style charts and a real order window.
          Build a portfolio, make mistakes, and learn from them for free.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#open-account"><Button size="lg" className="animate-pulse-glow">Open free account</Button></a>
          <a href="#features"><Button size="lg" variant="outline">See how it works</Button></a>
        </div>
        <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4">
          {stats.map(([big, small]) => (
            <div key={small}>
              <dt className="num text-lg font-semibold sm:text-xl">{big}</dt>
              <dd className="mt-0.5 text-xs text-mute sm:text-sm">{small}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="animate-slide-up [animation-delay:150ms]">
        <HeroChart />
      </div>
    </section>
  );
}
