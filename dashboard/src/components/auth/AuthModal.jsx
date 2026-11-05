import { useState } from 'react';
import { Modal, Button, Input } from '../ui';
import { useAuth } from '../../context/AuthContext';

export default function AuthModal() {
  const { authModalOpen, closeAuthModal, login, signup } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [track, setTrack] = useState('beginner');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) throw new Error('Please enter your name.');
        await signup(name, email, password, track);
      } else {
        await login(email, password);
      }
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={authModalOpen}
      onClose={closeAuthModal}
      title={mode === 'login' ? 'Sign in to TradeNova' : 'Create your Trading Account'}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {mode === 'signup' && (
          <Input
            id="auth-name"
            label="Full Name"
            placeholder="e.g. Alex Morgan"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <Input
          id="auth-email"
          label="Email Address"
          type="email"
          placeholder="trader@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          id="auth-password"
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {mode === 'signup' && (
          <label className="block text-sm">
            <span className="mb-1.5 block text-mute">Experience Track</span>
            <select
              value={track}
              onChange={(e) => setTrack(e.target.value)}
              className="w-full rounded-xl border border-line bg-bg/60 px-4 py-2.5 text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="beginner">Beginner (Guided academy & explanations)</option>
              <option value="pro">Pro (Full market depth & analytics)</option>
            </select>
          </label>
        )}

        {error && <p role="alert" className="text-sm text-loss">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Free Account'}
        </Button>

        <div className="pt-2 text-center text-xs text-mute">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                className="font-semibold text-primary underline"
                onClick={() => {
                  setMode('signup');
                  setError('');
                }}
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                className="font-semibold text-primary underline"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
              >
                Log in
              </button>
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
}
