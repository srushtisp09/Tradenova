// The 3D globe of charts, shown inside the landing page.
// "?embed=1" tells the 3D page to hide its own splash, intro and menu.
export default function Sphere() {
  return (
    <section id="explore" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
      <h2 className="max-w-2xl text-3xl tracking-tight sm:text-4xl">Explore the market in <span className="text-gradient">3D</span></h2>
      <p className="mt-2 text-mute">Drag the globe to turn it. Tap a chart to read the lesson behind it.</p>
      <div className="mt-8 overflow-hidden rounded-lg border border-line bg-black">
        <iframe title="TradeNova 3D market archive" src="/explore/index.html?embed=1" loading="lazy"
          className="block h-[70vh] min-h-[420px] w-full border-0" />
      </div>
      <a href="/explore/index.html" className="mt-4 inline-block text-sm text-mute hover:text-ink">Open the full experience →</a>
    </section>
  );
}
