import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Demo() {
  return (
    <div className="min-h-screen bg-surface grid place-items-center p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-8 text-center">
        <h1 className="text-4xl">Request an Athlon Demo</h1>
        <p className="mt-4 text-muted-foreground">Book a guided product walkthrough tailored for agencies, athlete teams, or solo reps.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild><a href="mailto:demo@athlon.app?subject=Athlon%20Demo%20Request">Email Demo Team</a></Button>
          <Button asChild variant="outline"><Link to="/">Back to landing page</Link></Button>
        </div>
      </div>
    </div>
  );
}
