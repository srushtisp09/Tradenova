import { createContext, useContext, useEffect, useState } from 'react';

// Remembers which track the user chose (beginner or pro) and their learning progress.
const Ctx = createContext(null);
const TRACK_KEY = 'tradenova-track';
const LEARN_KEY = 'tradenova-learn';

const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};
const save = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage can be blocked, ignore */ }
};

export function TrackProvider({ children }) {
  const [track, setTrack] = useState(() => {
    const q = new URLSearchParams(window.location.search).get('track'); // e.g. ?track=beginner from the website
    return q === 'beginner' || q === 'pro' ? q : read(TRACK_KEY, null);
  });
  const [progress, setProgress] = useState(() => read(LEARN_KEY, { done: [], xp: 0 }));

  useEffect(() => {
    if (track) save(TRACK_KEY, track);
  }, [track]);

  useEffect(() => {
    save(LEARN_KEY, progress);
  }, [progress]);

  useEffect(() => {
    if (window.location.search.includes('track=')) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const completeLesson = (id, xp) =>
    setProgress((p) => (p.done.includes(id) ? p : { done: [...p.done, id], xp: p.xp + xp }));

  return <Ctx.Provider value={{ track, setTrack, progress, completeLesson }}>{children}</Ctx.Provider>;
}

export const useTrack = () => useContext(Ctx);
