import { ArrowRight, Instagram, Youtube } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { contentItems, getAthlete, formatDate, ContentStatus } from '@/lib/data';
import { cn } from '@/lib/utils';

const statusColors: Record<ContentStatus, string> = {
  idea: 'bg-muted text-muted-foreground',
  script: 'bg-purple-100 text-purple-700',
  shoot: 'bg-warning/10 text-warning',
  edit: 'bg-info/10 text-info',
  schedule: 'bg-accent/10 text-accent-foreground',
  posted: 'bg-success/10 text-success',
};

const platformIcons: Record<string, React.ElementType> = {
  Instagram: Instagram,
  TikTok: () => (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
    </svg>
  ),
  YouTube: Youtube,
};

export function ContentPreview() {
  const thisWeekContent = contentItems.slice(0, 4);

  return (
    <Card className="card-elevated">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">This Week's Content</CardTitle>
          <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
            View all <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {thisWeekContent.map((item) => {
          const athlete = getAthlete(item.athleteId);
          const PlatformIcon = platformIcons[item.platform] || Instagram;
          
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-surface hover:bg-surface-elevated transition-colors cursor-pointer group"
            >
              {/* Platform icon */}
              <div className="h-9 w-9 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                <PlatformIcon className="h-4 w-4 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-medium text-sm truncate">{item.hook}</h4>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{athlete?.name}</span>
                  <span>•</span>
                  <span>{item.platform}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {formatDate(item.dueDate)}
                </span>
                <Badge 
                  variant="outline" 
                  className={cn("text-[10px] capitalize", statusColors[item.status])}
                >
                  {item.status}
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
