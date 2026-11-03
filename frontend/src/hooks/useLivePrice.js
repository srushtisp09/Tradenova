import { useEffect, useState } from 'react';

// Fake "live" price for the hero chart: a random walk that moves every 1.2 seconds.
// It is simulated demo data, not a real market feed.
export default function useLivePrice(start = 2450, points = 48) {
  const [series, setSeries] = useState(() => {
    const arr = [start];
    for (let i = 1; i < points; i++) arr.push(arr[i - 1] + (Math.random() - 0.46) * 9);
    return arr;
  });

  useEffect(() => {
    const id = setInterval(() => {
      setSeries((prev) => [...prev.slice(1), prev[prev.length - 1] + (Math.random() - 0.48) * 9]);
    }, 1200);
    return () => clearInterval(id);
  }, []);

  return series;
}
