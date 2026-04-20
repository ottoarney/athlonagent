export function AgentAthleteToggle() {
  const operationalHighlights = [
    'Oversee athlete rosters with clear ownership across staff',
    'Track deal stages, obligations, and campaign deliverables in one view',
    'Coordinate calendars, files, and conversations without context switching',
  ];

  return (
    <section className="container px-4 md:px-6 py-16 md:py-24">
      <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-3xl md:text-5xl">One unified operating system for agency execution.</h2>
          <div className="inline-flex rounded-full bg-surface px-4 py-2 text-sm text-muted-foreground">
            Agent / Agency Workspace
          </div>
        </div>

        <div className="mt-6 grid lg:grid-cols-[1.05fr_0.95fr] gap-6">
          <div>
            <h3 className="text-2xl">Run every moving part with confidence</h3>
            <div className="mt-4 space-y-2 text-muted-foreground">
              {operationalHighlights.map((point) => <p key={point}>• {point}</p>)}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-sm font-medium">Preview • Agency Console</p>
            <div className="mt-3 grid gap-3">
              <div className="rounded-lg border border-border bg-background p-3 text-sm">18 athlete roster</div>
              <div className="rounded-lg border border-border bg-background p-3 text-sm">9 deals in negotiation</div>
              <div className="rounded-lg border border-border bg-background p-3 text-sm">Canvas thread with due dates and notes</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
