import { useEffect, useState } from 'react';
import { Button, Modal } from '../ui';
import { useTrack } from '../../context/TrackContext';
import { Tug, Candle, Quiz, Compound } from './Steps';

// Shows one lesson, one small step at a time. Quiz steps must be answered correctly to continue.
export default function LessonPlayer({ lesson, onClose }) {
  const { completeLesson, progress } = useTrack();
  const [firstTime] = useState(() => !progress.done.includes(lesson.id));
  const [i, setI] = useState(0);
  const total = lesson.steps.length;
  const [ok, setOk] = useState(lesson.steps[0].type !== 'quiz');
  const finished = i >= total;
  const step = lesson.steps[i];

  const go = (n) => { setI(n); setOk(n >= total || lesson.steps[n].type !== 'quiz'); };
  useEffect(() => { if (finished) completeLesson(lesson.id, lesson.xp); }, [finished]); // eslint-disable-line

  return (
    <Modal open onClose={onClose} title={`${lesson.emoji} ${lesson.title}`}>
      <div className="mb-4 flex gap-1.5" aria-label={`Step ${Math.min(i + 1, total)} of ${total}`}>
        {lesson.steps.map((_, k) => <span key={k} className={`h-1.5 flex-1 rounded-full ${k <= i ? 'bg-gradient-to-r from-primary to-accent' : 'bg-line/50'}`} />)}
      </div>

      {finished ? (
        <div className="py-4 text-center animate-slide-up">
          <p className="text-6xl">🎉</p>
          <p className="mt-3 text-xl font-bold">Lesson complete!</p>
          <p className="mt-1 text-mute">{firstTime ? `+${lesson.xp} XP earned` : 'Great revision. XP is only given the first time.'}</p>
          <Button className="mt-6 w-full" onClick={onClose}>Back to the academy</Button>
        </div>
      ) : (
        <>
          <div key={i} className="min-h-48 animate-fade-in">
            {step.type === 'text' && (<div><p className="text-5xl">{step.emoji}</p><p className="mt-3 text-lg font-semibold">{step.title}</p><p className="mt-2 text-mute">{step.body}</p></div>)}
            {step.type === 'tug' && <Tug />}
            {step.type === 'candle' && <Candle />}
            {step.type === 'calc' && <Compound />}
            {step.type === 'quiz' && <Quiz step={step} onOk={() => setOk(true)} />}
          </div>
          <div className="mt-5 flex gap-3">
            {i > 0 && <Button variant="outline" onClick={() => go(i - 1)}>Back</Button>}
            <Button className="flex-1" disabled={!ok} onClick={() => go(i + 1)}>{i === total - 1 ? 'Finish' : 'Next →'}</Button>
          </div>
        </>
      )}
    </Modal>
  );
}
