import { useState } from 'react';
import { Button, Card, Input } from '../ui';

const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || 'http://localhost:5174';
const empty = { name: '', email: '', mobile: '' };

export default function OpenAccount() {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = 'Enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = 'Enter a valid email address.';
    if (!/^[6-9]\d{9}$/.test(form.mobile)) err.mobile = 'Enter a 10-digit mobile number.';
    return err;
  };

  const submit = (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length === 0) {
      // Direct visitor to the dashboard registration page with URL-encoded parameters
      const params = new URLSearchParams({
        name: form.name.trim(),
        email: form.email.trim(),
      });
      window.location.href = `${DASHBOARD_URL}/register?${params.toString()}`;
    }
  };

  return (
    <section id="open-account" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
      <Card className="grid gap-8 p-6 sm:p-10 lg:grid-cols-2">
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Open your free account</h2>
          <p className="mt-3 max-w-md text-mute">
            Takes under a minute. You get ₹10,00,000 in virtual cash the moment you sign up.
          </p>
        </div>
        <form onSubmit={submit} noValidate className="space-y-4">
          <div>
            <Input id="oa-name" label="Full name" value={form.name} onChange={set('name')} autoComplete="name" />
            {errors.name && <p className="mt-1 text-sm text-loss">{errors.name}</p>}
          </div>
          <div>
            <Input id="oa-email" label="Email" type="email" value={form.email} onChange={set('email')} autoComplete="email" />
            {errors.email && <p className="mt-1 text-sm text-loss">{errors.email}</p>}
          </div>
          <div>
            <Input id="oa-mobile" label="Mobile number" inputMode="numeric" maxLength={10} value={form.mobile} onChange={set('mobile')} autoComplete="tel" />
            {errors.mobile && <p className="mt-1 text-sm text-loss">{errors.mobile}</p>}
          </div>
          <Button type="submit" size="lg" className="w-full">Create account</Button>
        </form>
      </Card>
    </section>
  );
}
