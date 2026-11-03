import { useState } from 'react';
import { Button, Card, Badge, Input, Modal, Skeleton, ThemeToggle } from '../components/ui';

// Preview board: every UI component in every variant, on one page.
export default function Design({ appName = 'TradeNova' }) {
  const [open, setOpen] = useState(false);

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            <span className="text-gradient">{appName}</span> design system
          </h1>
          <p className="mt-1 text-mute">Every building block in one place.</p>
        </div>
        <ThemeToggle />
      </header>

      <Card className="animate-slide-up">
        <h2 className="mb-4 font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Buy</Button>
          <Button variant="outline">Add to watchlist</Button>
          <Button variant="ghost">Cancel</Button>
          <Button size="sm">Small</Button>
          <Button size="lg" className="animate-pulse-glow">Open account</Button>
          <Button disabled>Disabled</Button>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-mute">Portfolio value</p>
          <p className="num mt-1 text-2xl font-semibold">₹12,48,320.50</p>
          <Badge tone="profit" className="mt-3">+2.4% today</Badge>
        </Card>
        <Card>
          <p className="text-sm text-mute">Day's P&amp;L</p>
          <p className="num mt-1 text-2xl font-semibold text-loss">−₹3,210.00</p>
          <Badge tone="loss" className="mt-3">−0.3%</Badge>
        </Card>
        <Card>
          <p className="text-sm text-mute">Open orders</p>
          <p className="num mt-1 text-2xl font-semibold">4</p>
          <div className="mt-3 flex gap-2"><Badge tone="info">Pending</Badge><Badge>Neutral</Badge></div>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-semibold">Inputs</h2>
          <div className="space-y-4">
            <Input id="sym" label="Stock symbol" placeholder="e.g. RELIANCE" />
            <Input id="qty" label="Quantity" type="number" placeholder="10" />
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 font-semibold">Loading &amp; modal</h2>
          <div className="space-y-3">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-1/2" />
          </div>
          <Button variant="outline" className="mt-5" onClick={() => setOpen(true)}>Open modal</Button>
        </Card>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Place order">
        <div className="space-y-4">
          <Input id="m-qty" label="Quantity" type="number" placeholder="10" />
          <div className="flex gap-3">
            <Button className="flex-1">Buy</Button>
            <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
