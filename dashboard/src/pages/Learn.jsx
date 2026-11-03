import { useState } from 'react';
import { Badge, Card } from '../components/ui';
import LessonPlayer from '../components/learn/LessonPlayer';
import { Compound } from '../components/learn/Steps';
import { useTrack } from '../context/TrackContext';
import { lessons, glossary } from '../data/lessons';

export default function Learn() {
  const { progress } = useTrack();
  const [open, setOpen] = useState(null);
  const [term, setTerm] = useState(glossary[0]);
  const level = Math.floor(progress.xp / 100) + 1;

  return (
    <div className="space-y-6">
      <Card className="">
        <p className="text-sm text-mute">Market academy</p>
        <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">Learn the market, one small win at a time 🎓</h2>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Badge tone="info">Level {level}</Badge>
          <span className="num text-sm">{progress.xp} XP</span>
          <span className="text-sm text-mute">{progress.done.length} of {lessons.length} lessons done</span>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-line/40" role="progressbar" aria-valuenow={progress.xp % 100} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to next level">
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all" style={{ width: `${progress.xp % 100}%` }} />
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((l, n) => {
          const done = progress.done.includes(l.id);
          return (
            <button key={l.id} onClick={() => setOpen(l)} className="glass p-5 text-left transition hover:-translate-y-1 hover:border-ink">
              <div className="flex items-start justify-between">
                <span className="text-4xl">{l.emoji}</span>
                {done ? <Badge tone="profit">✓ Done</Badge> : <Badge>+{l.xp} XP</Badge>}
              </div>
              <p className="mt-4 text-xs text-mute">Lesson {n + 1} · {l.mins} min</p>
              <p className="mt-1 font-semibold">{l.title}</p>
              <p className="mt-3 text-sm font-medium text-primary">{done ? 'Replay' : 'Start'} →</p>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="font-semibold">🌱 Playground: watch money grow</h3>
          <div className="mt-4"><Compound /></div>
        </Card>
        <Card>
          <h3 className="font-semibold">📖 Jargon buster</h3>
          <p className="mt-1 text-sm text-mute">Tap a word.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {glossary.map((g) => (
              <button key={g[0]} onClick={() => setTerm(g)} aria-pressed={term[0] === g[0]}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${term[0] === g[0] ? 'border-primary bg-primary/15' : 'border-line text-mute hover:text-ink'}`}>{g[0]}</button>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-line/30 p-4 animate-fade-in" key={term[0]}>
            <p className="font-semibold">{term[0]}</p>
            <p className="mt-1 text-sm text-mute">{term[1]}</p>
          </div>
        </Card>
      </div>

      {open && <LessonPlayer key={open.id} lesson={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
