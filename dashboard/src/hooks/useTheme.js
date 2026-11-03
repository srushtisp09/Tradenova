import { useEffect, useState } from 'react';

// Dark/light mode. Saves the choice in localStorage and adds a "dark" class to <html>.
export default function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('tn-theme') || 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('tn-theme', theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  return { theme, toggle };
}
