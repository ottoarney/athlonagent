import { ReactNode } from 'react';

interface DashboardPageHeaderProps {
  title: string;
  subtitle: string;
  actions?: ReactNode;
}

export function DashboardPageHeader({ title, subtitle, actions }: DashboardPageHeaderProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-display font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-muted-foreground">{subtitle}</p>
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </header>
  );
}
