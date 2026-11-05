import { memo, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrack } from '../../context/TrackContext';
import { useAuth } from '../../context/AuthContext';
import { instruments } from '../../data/mockData';
import { seeded } from '../../utils/seeded';

const G = '#22C55E', RD = '#EF4444';
const SERIF = '"Playfair Display", "Times New Roman", serif';
const TEXT = "Hi, I'm Nova! Are you new to the market, or do you already trade?";

const options = [
  { key: 'beginner', emoji: '🌱', title: "I'm new here", text: 'Show me the basics with games and quizzes.', cta: 'Start learning', to: '/learn' },
  { key: 'pro', emoji: '📈', title: 'I already trade', text: 'Give me market insights and what to change.', cta: 'Open insights', to: '/insights' },
];

const CARDS = [
  { l: 3, t: 14, s: 1, r: -6, d: 9, k: 'c', seed: 3 },
  { l: 72, t: 10, s: 1.1, r: 5, d: 11, k: 'l', seed: 8 },
  { l: 82, t: 46, s: .85, r: -4, d: 10, k: 'b', seed: 5 },
  { l: -3, t: 56, s: 1.05, r: 7, d: 12, k: 'l', seed: 11 },
  { l: 62, t: 70, s: 1.1, r: -5, d: 8, k: 'c', seed: 14 },
  { l: 20, t: 76, s: .9, r: 4, d: 13, k: 'c', seed: 21 },
  { l: 40, t: 8, s: .8, r: 3, d: 10, k: 'b', seed: 6 },
  { l: 28, t: 30, s: .7, r: -3, d: 14, k: 'l', seed: 30 },
];

const BIG = (() => {
  const r = seeded(77); let v = 150; const pts = [];
  for (let i = 0; i < 40; i++) { v += (r() - 0.44) * 26; v = Math.max(30, Math.min(270, v)); pts.push(v); }
  return pts.map((y, i) => `${i ? 'L' : 'M'}${(i / 39) * 1000} ${300 - y}`).join('');
})();

const CSS = `
@keyframes tn-float{0%,100%{transform:translate3d(0,0,0) rotate(var(--r)) scale(var(--s))}50%{transform:translate3d(14px,-24px,0) rotate(calc(var(--r) + 2.5deg)) scale(var(--s))}}
@keyframes tn-marq{to{transform:translateX(-50%)}}
@keyframes tn-draw{0%{stroke-dashoffset:1;opacity:.9}70%{stroke-dashoffset:0;opacity:.9}100%{stroke-dashoffset:0;opacity:0}}
@keyframes tn-in{0%{transform:translateX(120vw) rotate(14deg)}70%{transform:translateX(-14px) rotate(-3deg)}100%{transform:none}}
@keyframes tn-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
@keyframes tn-blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
@keyframes tn-jump{0%,100%{transform:translateY(0)}40%{transform:translateY(-34px) rotate(-6deg)}}
@keyframes tn-pop{from{opacity:0;transform:scale(.9) translateY(8px)}to{opacity:1;transform:none}}
`;

function MiniChart({ seed, kind }) {
  const r = seeded(seed), W = 240, H = 150, P = 12, n = kind === 'c' ? 22 : 30;
  let v = 100; const c = [v];
  for (let i = 0; i < n; i++) { v *= 1 + 0.006 + (r() - 0.5) * 0.08; c.push(v); }
  const lo = Math.min(...c), hi = Math.max(...c);
  const y = (x) => H - P - ((x - lo) / (hi - lo || 1)) * (H - P * 2);
  const bw = (W - P * 2) / n;
  let body;
  if (kind === 'c') {
    body = Array.from({ length: n }, (_, i) => {
      const o = c[i], e = c[i + 1], x = P + i * bw + bw / 2, col = e >= o ? G : RD;
      return (
        <g key={i}>
          <path d={`M${x} ${y(Math.max(o, e) * 1.012)}V${y(Math.min(o, e) * 0.988)}`} stroke={col} />
          <rect x={x - bw * 0.3} y={y(Math.max(o, e))} width={bw * 0.6} height={Math.max(2, Math.abs(y(o) - y(e)))} fill={col} />
        </g>
      );
    });
  } else if (kind === 'b') {
    body = Array.from({ length: 12 }, (_, i) => {
      const h = (0.2 + r() * 0.7) * (H - P * 2), w = (W - P * 2) / 12;
      return <rect key={i} x={P + i * w + 3} y={H - P - h} width={w - 6} height={h} fill={r() > 0.4 ? G : RD} opacity=".85" />;
    });
  } else {
    const d = c.map((x, i) => `${i ? 'L' : 'M'}${P + (i / n) * (W - P * 2)} ${y(x)}`).join('');
    body = (<><path d={`${d}L${W - P} ${H}L${P} ${H}Z`} fill="rgba(99,102,241,.18)" /><path d={d} fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinejoin="round" /></>);
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" aria-hidden="true">
      <rect width={W} height={H} fill="#0a0d14" />
      {[1, 2, 3].map((k) => <path key={k} d={`M0 ${(H * k) / 4}H${W}`} stroke="#fff" strokeOpacity=".06" />)}
      {body}
    </svg>
  );
}

const Row = () =>
  instruments.map((i) => {
    const ch = ((i.price - i.prev) / i.prev) * 100;
    return (
      <span key={i.symbol} className="mx-5 inline-flex items-center gap-2 text-xs">
        <b>{i.symbol}</b>
        <span className="num text-white/60">{i.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        <span className={ch >= 0 ? 'text-profit' : 'text-loss'}>{ch >= 0 ? '▲' : '▼'} {Math.abs(ch).toFixed(2)}%</span>
      </span>
    );
  });

const Backdrop = memo(function Backdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {CARDS.map((c, i) => (
        <div key={i} className="absolute overflow-hidden rounded-xl border border-white/10 opacity-60"
          style={{ left: `${c.l}%`, top: `${c.t}%`, width: 'clamp(140px, 19vw, 260px)', '--r': `${c.r}deg`, '--s': c.s, animation: `tn-float ${c.d}s ease-in-out ${-i * 1.7}s infinite` }}>
          <MiniChart seed={c.seed} kind={c.k} />
        </div>
      ))}
      <svg className="absolute inset-x-0 bottom-[6%] h-[34%] w-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
        <defs><linearGradient id="tn-line" x1="0" x2="1"><stop offset="0" stopColor="#3B82F6" /><stop offset="1" stopColor="#8B5CF6" /></linearGradient></defs>
        <path d={BIG} fill="none" stroke="url(#tn-line)" strokeWidth="3" pathLength="1" strokeDasharray="1" vectorEffect="non-scaling-stroke" style={{ animation: 'tn-draw 7s ease-in-out infinite' }} />
      </svg>
      <div className="absolute inset-x-0 top-3 overflow-hidden whitespace-nowrap opacity-60"><div className="inline-block" style={{ animation: 'tn-marq 55s linear infinite' }}><Row /><Row /></div></div>
      <div className="absolute inset-x-0 bottom-3 overflow-hidden whitespace-nowrap opacity-60"><div className="inline-block" style={{ animation: 'tn-marq 55s linear infinite reverse' }}><Row /><Row /></div></div>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 62% 56% at 50% 50%, rgba(0,0,0,.78), transparent 100%)' }} />
    </div>
  );
});

function Bull({ jump }) {
  const eye = (cx) => (
    <g style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'tn-blink 4s infinite 1.6s' }}>
      <circle cx={cx} cy="96" r="11" fill="#fff" />
      <circle cx={cx + 1} cy="98" r="6" fill="#1b1030" />
      <circle cx={cx + 3} cy="95" r="2.2" fill="#fff" />
    </g>
  );
  return (
    <div style={{ animation: 'tn-in 1.1s cubic-bezier(.2,.9,.3,1.1) both' }}>
      <div style={{ animation: jump ? 'tn-jump .8s ease' : 'tn-bob 3.2s ease-in-out 1.1s infinite' }}>
        <svg viewBox="0 0 200 200" className="h-40 w-40 sm:h-52 sm:w-52" role="img" aria-label="Nova the bull, your guide">
          <defs><linearGradient id="tn-bull" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4f8dfb" /><stop offset="1" stopColor="#8b5cf6" /></linearGradient></defs>
          <ellipse cx="100" cy="188" rx="48" ry="7" fill="#000" opacity=".5" />
          <path d="M58 64 Q28 52 32 22 Q56 34 74 54Z" fill="#f4f2ef" />
          <path d="M142 64 Q172 52 168 22 Q144 34 126 54Z" fill="#f4f2ef" />
          <ellipse cx="40" cy="98" rx="15" ry="9" transform="rotate(-25 40 98)" fill="#6d5df0" />
          <ellipse cx="160" cy="98" rx="15" ry="9" transform="rotate(25 160 98)" fill="#6d5df0" />
          <circle cx="100" cy="105" r="58" fill="url(#tn-bull)" />
          {eye(78)}{eye(122)}
          <circle cx="64" cy="120" r="8" fill="#ff8fb1" opacity=".45" />
          <circle cx="136" cy="120" r="8" fill="#ff8fb1" opacity=".45" />
          <ellipse cx="100" cy="136" rx="30" ry="21" fill="#ffc6d6" />
          <ellipse cx="90" cy="132" rx="3.5" ry="5" fill="#b0476b" />
          <ellipse cx="110" cy="132" rx="3.5" ry="5" fill="#b0476b" />
          <path d="M91 146 Q100 154 109 146" fill="none" stroke="#b0476b" strokeWidth="3" strokeLinecap="round" />
          <g transform="translate(152 160)"><circle r="17" fill={G} /><path d="M-7 4L0 -6L7 4" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /></g>
        </svg>
      </div>
    </div>
  );
}

function Speech({ text, skip, onDone }) {
  const [n, setN] = useState(0);
  const timer = useRef();
  useEffect(() => {
    const t = setTimeout(() => { timer.current = setInterval(() => setN((v) => v + 1), 28); }, 1100);
    return () => { clearTimeout(t); clearInterval(timer.current); };
  }, [text]);
  useEffect(() => { if (skip) setN(text.length); }, [skip, text]);
  useEffect(() => { if (n >= text.length) { clearInterval(timer.current); onDone(); } }, [n, text, onDone]);
  return (
    <span className="relative block">
      <span className="invisible">{text}</span>
      <span className="absolute inset-0" aria-hidden="true">{text.slice(0, n)}</span>
      <span className="sr-only">{text}</span>
    </span>
  );
}

export default function TrackPicker() {
  const { track, setTrack } = useTrack();
  const { user, updateUserTrack } = useAuth();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [skip, setSkip] = useState(false);
  const [picked, setPicked] = useState(null);

  // Skip the picker if track is already chosen or user has a track saved
  if (track || user?.track) return null;

  const choose = (o) => {
    setPicked(o.key);
    setTimeout(() => {
      setTrack(o.key);
      if (user) {
        updateUserTrack(o.key);
      }
      navigate(o.to);
    }, 950);
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black text-[#f4f2ef]" role="dialog" aria-modal="true" aria-label="Choose your path">
      <style>{CSS}</style>
      <Backdrop />
      <p className="absolute left-5 top-12 z-10 text-xl" style={{ fontFamily: SERIF }}>Trade<span className="text-gradient">Nova</span></p>

      <div className="relative z-10 flex min-h-full flex-col items-center justify-center px-4 py-20">
        <div className="flex w-full max-w-3xl flex-col items-center gap-3 sm:flex-row sm:items-end sm:justify-center sm:gap-6">
          <Bull jump={!!picked} />
          <div onClick={() => setSkip(true)} className="relative max-w-md rounded-2xl border border-white/15 bg-[#0b0f1a]/90 px-5 py-4 backdrop-blur-xl" style={{ animation: 'tn-pop .5s ease 1.2s both' }}>
            <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-white/15 bg-[#0b0f1a] sm:hidden" />
            <span className="absolute -left-2 bottom-8 hidden h-4 w-4 rotate-45 border-b border-l border-white/15 bg-[#0b0f1a] sm:block" />
            <p className="text-xl leading-snug sm:text-2xl" style={{ fontFamily: SERIF }}>
              {picked ? "Great choice! Let's go 🚀" : <Speech text={TEXT} skip={skip} onDone={() => setReady(true)} />}
            </p>
          </div>
        </div>

        {ready && !picked && (
          <>
            <div className="mt-8 grid w-full max-w-3xl gap-3 sm:grid-cols-2 animate-slide-up">
              {options.map((o) => (
                <button key={o.key} onClick={() => choose(o)} className="group rounded-2xl border border-white/15 bg-[#0b0f1a]/90 p-5 text-left backdrop-blur-xl transition hover:-translate-y-1 hover:border-ink hover:shadow-lg hover:shadow-primary/25">
                  <span className="text-3xl">{o.emoji}</span>
                  <span className="mt-3 block text-lg font-semibold" style={{ fontFamily: SERIF }}>{o.title}</span>
                  <span className="mt-1 block text-sm text-white/60">{o.text}</span>
                  <span className="mt-3 block text-sm font-medium text-primary transition group-hover:translate-x-1">{o.cta} →</span>
                </button>
              ))}
            </div>
            <p className="mt-5 text-xs text-white/40">You can switch any time from the top bar.</p>
          </>
        )}
      </div>
    </div>
  );
}
