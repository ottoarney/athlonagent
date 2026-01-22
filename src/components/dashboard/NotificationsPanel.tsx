import { Bell, Calendar, FileText, DollarSign, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'deadline' | 'event' | 'deal' | 'alert';
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

const notifications: Notification[] = [
  {
    id: 'n1',
    type: 'deadline',
    title: 'Eligibility docs due tomorrow',
    description: 'Emma Rodriguez - NCAA compliance',
    time: '2h ago',
    unread: true,
  },
  {
    id: 'n2',
    type: 'deal',
    title: 'Nike deliverable due in 5 days',
    description: 'Marcus Thompson - Video testimonial',
    time: '4h ago',
    unread: true,
  },
  {
    id: 'n3',
    type: 'event',
    title: 'Game day reminder',
    description: 'USC vs UCLA - Saturday 7:00 PM',
    time: '1d ago',
    unread: false,
  },
  {
    id: 'n4',
    type: 'alert',
    title: 'Contract review pending',
    description: 'Nike agreement needs your signature',
    time: '2d ago',
    unread: true,
  },
];

const iconMap = {
  deadline: FileText,
  event: Calendar,
  deal: DollarSign,
  alert: AlertTriangle,
};

const colorMap = {
  deadline: 'bg-warning/10 text-warning',
  event: 'bg-info/10 text-info',
  deal: 'bg-accent/10 text-accent-foreground',
  alert: 'bg-destructive/10 text-destructive',
};

export function NotificationsPanel() {
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <Card className="card-elevated">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </CardTitle>
          {unreadCount > 0 && (
            <span className="text-xs text-accent font-medium">
              {unreadCount} new
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {notifications.map((notification) => {
          const Icon = iconMap[notification.type];
          
          return (
            <div
              key={notification.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer",
                notification.unread 
                  ? "bg-accent/5 hover:bg-accent/10" 
                  : "hover:bg-surface-elevated"
              )}
            >
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                colorMap[notification.type]
              )}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className={cn(
                    "text-sm truncate",
                    notification.unread ? "font-semibold" : "font-medium"
                  )}>
                    {notification.title}
                  </h4>
                  {notification.unread && (
                    <span className="h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {notification.description}
                </p>
                <span className="text-[10px] text-muted-foreground mt-1 block">
                  {notification.time}
                </span>
              </div>
            </div>
          );
        })}
        
        <button className="w-full text-center text-xs text-muted-foreground hover:text-foreground py-2 transition-colors">
          View all notifications
        </button>
      </CardContent>
    </Card>
  );
}
