const cols = [
  ['Product', [['Features', '#features'], ['Pricing', '#pricing'], ['Open account', '#open-account']]],
  ['Help', [['Support', '#support'], ['Design system', '/design']]],
];

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-line/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="text-xl font-extrabold">Trade<span className="text-gradient">Nova</span></p>
          <p className="mt-2 max-w-xs text-sm text-mute">A paper trading platform for learning the market without risking real money.</p>
        </div>
        {cols.map(([title, items]) => (
          <div key={title}>
            <p className="font-semibold">{title}</p>
            <ul className="mt-3 space-y-2 text-sm text-mute">
              {items.map(([label, href]) => (
                <li key={label}><a className="hover:text-ink" href={href}>{label}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line/60 px-4 py-5 text-center text-xs text-mute sm:px-6">
        TradeNova is an educational project. No real trades are placed and nothing here is investment advice.
      </div>
    </footer>
  );
}
