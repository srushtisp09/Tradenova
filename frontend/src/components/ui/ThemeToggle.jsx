import useTheme from '../../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark and light mode"
      className="rounded-xl border border-line px-3 py-2 text-sm text-mute transition hover:text-ink hover:border-primary"
    >
      {theme === 'dark' ? '☀ Light' : '☾ Dark'}
    </button>
  );
}
