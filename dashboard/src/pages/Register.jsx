import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Input, Button } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useTrack } from '../context/TrackContext';

export default function Register() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { register } = useAuth();
  const { setTrack: setContextTrack } = useTrack();

  const [name, setName] = useState(searchParams.get('name') || '');
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [track, setTrack] = useState('beginner');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Valid email is required');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await register(name, email, password, track);
      if (res?.user?.track) {
        setContextTrack(res.user.track);
      }
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-12 text-[#f4f2ef]">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link to="/" className="font-serif text-3xl font-normal tracking-tight text-white">
            Trade<em className="not-italic text-white/70">Nova</em>
          </Link>
          <h1 className="mt-4 font-serif text-2xl font-normal tracking-tight sm:text-3xl">
            Create your account
          </h1>
          <p className="mt-1.5 text-xs text-white/50">
            Start paper trading with ₹10,00,000 in virtual funds
          </p>
        </div>

        <Card className="border border-white/10 bg-[#07090e]/90 p-6 backdrop-blur-xl sm:p-8">
          {error && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <Input
                id="reg-name"
                label="Full name"
                placeholder="Rohan Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>

            <div>
              <Input
                id="reg-email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div>
              <div className="relative">
                <Input
                  id="reg-password"
                  label="Password (min 8 characters)"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-[34px] text-xs text-white/50 hover:text-white"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div>
              <span className="mb-2 block text-xs text-mute">Choose your track</span>
              <div className="grid grid-cols-2 gap-3" role="radiogroup">
                <button
                  type="button"
                  onClick={() => setTrack('beginner')}
                  className={`flex flex-col items-start rounded-xl border p-3.5 text-left transition ${
                    track === 'beginner'
                      ? 'border-white bg-white/10 text-white'
                      : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/25 hover:text-white'
                  }`}
                >
                  <span className="text-base">🌱</span>
                  <span className="mt-1 font-semibold text-xs text-white">Beginner</span>
                  <span className="mt-0.5 text-[11px] text-white/50">Guided lessons & basics</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTrack('pro')}
                  className={`flex flex-col items-start rounded-xl border p-3.5 text-left transition ${
                    track === 'pro'
                      ? 'border-white bg-white/10 text-white'
                      : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/25 hover:text-white'
                  }`}
                >
                  <span className="text-base">📈</span>
                  <span className="mt-1 font-semibold text-xs text-white">Pro</span>
                  <span className="mt-0.5 text-[11px] text-white/50">Insights, orders & tools</span>
                </button>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-white/50">
            Already have an account?{' '}
            <Link to="/login" className="text-white hover:underline">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
