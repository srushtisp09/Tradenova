import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Input, Button } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useTrack } from '../context/TrackContext';

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { setTrack } = useTrack();

  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res?.user?.track) {
        setTrack(res.user.track);
      }
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await login('demo@tradenova.dev', 'Demo@1234');
      if (res?.user?.track) {
        setTrack(res.user.track);
      }
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Demo login failed');
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
            Welcome back
          </h1>
          <p className="mt-1.5 text-xs text-white/50">
            Sign in to access your portfolio and market instruments
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
                id="login-email"
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
                  id="login-password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
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

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <span className="relative bg-[#07090e] px-3 text-[11px] uppercase tracking-wider text-white/40">
              or
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full border-white/15 hover:bg-white/5"
            onClick={handleDemoLogin}
            disabled={loading}
          >
            Try the demo account
          </Button>

          <p className="mt-6 text-center text-xs text-white/50">
            Don't have an account?{' '}
            <Link to="/register" className="text-white hover:underline">
              Create an account
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
