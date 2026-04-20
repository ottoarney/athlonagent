import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Waitlist() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-surface grid place-items-center p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-8">
        <h1 className="text-4xl">Join the Athlon waitlist</h1>
        <p className="mt-3 text-muted-foreground">Get notified when new agency tools and workspace collaboration releases ship.</p>
        <form className="mt-6 flex flex-col sm:flex-row gap-3" onSubmit={onSubmit}>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@agency.com" />
          <Button type="submit">Join waitlist</Button>
        </form>
        {submitted && <p className="mt-4 text-sm text-accent-foreground bg-accent/20 rounded-lg p-3">Thanks — we saved your interest for priority access.</p>}
        <Button asChild variant="link" className="mt-4 px-0"><Link to="/">Back to landing page</Link></Button>
      </div>
    </div>
  );
}
