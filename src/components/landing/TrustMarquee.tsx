const agencies = ['Klutch Sports Group', 'Wasserman', 'CAA Sports', 'Excel Sports Management', 'WME Sports', 'Octagon', 'Athletes First', 'Roc Nation Sports', 'Range Sports', 'Gersh Sports'];

function Row({ reverse = false }: { reverse?: boolean }) {
  const items = [...agencies, ...agencies];

  return (
    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
      <div className={`marquee-track ${reverse ? 'marquee-reverse' : ''}`}>
        {items.map((agency, index) => (
          <div key={`${agency}-${index}`} className="marquee-item">{agency}</div>
        ))}
      </div>
    </div>
  );
}

export function TrustMarquee() {
  return (
    <section className="border-y border-border bg-surface/80 py-10 md:py-14">
      <div className="container px-4 md:px-6">
        <p className="text-center text-sm uppercase tracking-[0.14em] text-muted-foreground">Designed for the next era of sports representation</p>
        <h3 className="text-center text-2xl md:text-4xl mt-3">Trusted by the future of athlete management</h3>
        <div className="mt-8 space-y-3 group">
          <Row />
          <Row reverse />
        </div>
      </div>
    </section>
  );
}
