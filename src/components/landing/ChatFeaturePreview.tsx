export function ChatFeaturePreview() {
  return (
    <section className="container px-4 md:px-6 py-16 md:py-24">
      <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-6 items-start">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Canvas communication</p>
          <h2 className="text-3xl md:text-5xl mt-3">Messaging built into operations.</h2>
          <p className="mt-4 text-muted-foreground">Stop managing athlete relationships across scattered text threads. Athlon keeps shared updates, reminders, notes, tasks, and files in one conversation layer.</p>
          <div className="mt-5 space-y-2 text-sm text-muted-foreground">
            <p>• Conversation list by athlete, campaign, or deal</p>
            <p>• Thread view with pinned system updates</p>
            <p>• Message composer with attachments and linked tasks</p>
            <p>• Expandable real-time architecture powered by Supabase</p>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5">
          <div className="grid md:grid-cols-[0.8fr_1.2fr] gap-4">
            <div className="rounded-2xl border border-border bg-surface p-3 text-sm">
              <p className="font-medium">Conversations</p>
              <div className="mt-3 space-y-2">
                {['A. Brooks / Adidas', 'A. Brooks / Content', 'Jordan Lee / Travel', 'Team Ops / Deadlines'].map((thread) => (
                  <div key={thread} className="rounded-lg border border-border bg-background px-3 py-2">{thread}</div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-3 text-sm">
              <p className="font-medium">Canvas thread • A. Brooks / Adidas</p>
              <div className="mt-3 space-y-2 text-xs">
                <div className="rounded-lg border border-border bg-background p-2"><span className="font-medium">Agent:</span> Need revised caption approval by Thursday.</div>
                <div className="rounded-lg border border-accent/40 bg-accent/10 p-2"><span className="font-medium">Pinned update:</span> Deliverable due Apr 22 • 4PM ET.</div>
                <div className="rounded-lg border border-border bg-background p-2"><span className="font-medium">Athlete:</span> Uploaded revised draft and media cut.</div>
                <div className="rounded-lg border border-border bg-background p-2">Linked files: Campaign brief.pdf • Shot list.docx</div>
              </div>
              <div className="mt-3 rounded-lg border border-border bg-background px-3 py-2 text-muted-foreground">Write an update…</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
