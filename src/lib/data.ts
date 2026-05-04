// Athlon - Sports Agent Dashboard Data Models & Seed Data

export type AthleteStatus = 'active' | 'prospect' | 'inactive';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type DealStage = 'lead' | 'negotiation' | 'contracted' | 'deliverables' | 'paid';
export type ContentStatus = 'idea' | 'script' | 'shoot' | 'edit' | 'schedule' | 'posted';
export type EventType = 'training' | 'game' | 'travel' | 'content' | 'deal' | 'admin';

export interface Athlete {
  id: string;
  name: string;
  sport: string;
  team: string;
  position: string;
  classYear: string;
  location: string;
  avatar?: string;
  initials: string;
  status: AthleteStatus;
  agentNotes?: string;
  parentContact?: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  athleteId: string;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  tags: string[];
  owner: 'agent';
  checklist?: { id: string; text: string; completed: boolean }[];
}

export interface Deal {
  id: string;
  brand: string;
  athleteId: string;
  value: number;
  stage: DealStage;
  deliverables: { id: string; title: string; dueDate: Date; completed: boolean }[];
  paymentStatus: 'pending' | 'partial' | 'complete';
  notes?: string;
  nextAction?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  athleteIds: string[];
  type: EventType;
  startDate: Date;
  endDate: Date;
  location?: string;
  notes?: string;
}

export interface ContentItem {
  id: string;
  athleteId: string;
  platform: string;
  hook: string;
  caption?: string;
  dueDate: Date;
  status: ContentStatus;
  assets?: string[];
}

// Seed Data
export const athletes: Athlete[] = [
  {
    id: 'ath-1',
    name: 'Marcus Thompson',
    sport: 'Football',
    team: 'USC Trojans',
    position: 'Quarterback',
    classYear: 'Junior',
    location: 'Los Angeles, CA',
    initials: 'MT',
    status: 'active',
    agentNotes: 'Top QB prospect. Strong social media presence. Focus on national brand deals.',
  },
  {
    id: 'ath-2',
    name: 'Jaylen Carter',
    sport: 'Basketball',
    team: 'Duke Blue Devils',
    position: 'Point Guard',
    classYear: 'Sophomore',
    location: 'Durham, NC',
    initials: 'JC',
    status: 'active',
    agentNotes: 'Rising star. Excellent on-camera presence. Prioritize lifestyle and tech brands.',
  },
  {
    id: 'ath-3',
    name: 'Emma Rodriguez',
    sport: 'Soccer',
    team: 'Stanford Cardinal',
    position: 'Forward',
    classYear: 'Senior',
    location: 'Palo Alto, CA',
    initials: 'ER',
    status: 'active',
    agentNotes: 'National team prospect. Strong academics. Target education and wellness brands.',
    parentContact: {
      name: 'Maria Rodriguez',
      email: 'maria.r@email.com',
      phone: '(555) 123-4567',
    },
  },
];

const today = new Date();
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const tasks: Task[] = [
  {
    id: 'task-1',
    title: 'Review Nike contract terms',
    description: 'Go through the updated terms from Nike legal team',
    athleteId: 'ath-1',
    dueDate: addDays(today, 2),
    priority: 'high',
    status: 'in-progress',
    tags: ['contract', 'nike'],
    owner: 'agent',
  },
  {
    id: 'task-2',
    title: 'Submit eligibility documents',
    description: 'NCAA compliance forms due this week',
    athleteId: 'ath-3',
    dueDate: addDays(today, 1),
    priority: 'urgent',
    status: 'todo',
    tags: ['compliance', 'deadline'],
    owner: 'agent',
  },
  {
    id: 'task-3',
    title: 'Prepare media training session',
    athleteId: 'ath-2',
    dueDate: addDays(today, 5),
    priority: 'medium',
    status: 'todo',
    tags: ['media', 'training'],
    owner: 'agent',
  },
  {
    id: 'task-4',
    title: 'Follow up with Gatorade',
    description: 'Check on campaign deliverables status',
    athleteId: 'ath-1',
    dueDate: addDays(today, 3),
    priority: 'medium',
    status: 'review',
    tags: ['brand', 'gatorade'],
    owner: 'agent',
  },
  {
    id: 'task-5',
    title: 'Schedule photoshoot location scout',
    athleteId: 'ath-2',
    dueDate: addDays(today, 7),
    priority: 'low',
    status: 'todo',
    tags: ['content', 'photoshoot'],
    owner: 'agent',
  },
];

export const deals: Deal[] = [
  {
    id: 'deal-1',
    brand: 'Nike',
    athleteId: 'ath-1',
    value: 250000,
    stage: 'deliverables',
    deliverables: [
      { id: 'd1', title: 'Social media post #1', dueDate: addDays(today, 5), completed: true },
      { id: 'd2', title: 'Video testimonial', dueDate: addDays(today, 10), completed: false },
      { id: 'd3', title: 'Game day appearance', dueDate: addDays(today, 14), completed: false },
    ],
    paymentStatus: 'partial',
    nextAction: 'Coordinate video shoot schedule',
  },
  {
    id: 'deal-2',
    brand: 'Beats by Dre',
    athleteId: 'ath-2',
    value: 75000,
    stage: 'negotiation',
    deliverables: [],
    paymentStatus: 'pending',
    nextAction: 'Counter-offer on exclusivity terms',
  },
  {
    id: 'deal-3',
    brand: 'Gatorade',
    athleteId: 'ath-1',
    value: 150000,
    stage: 'contracted',
    deliverables: [
      { id: 'd4', title: 'Commercial filming', dueDate: addDays(today, 21), completed: false },
    ],
    paymentStatus: 'pending',
    nextAction: 'Review final script',
  },
  {
    id: 'deal-4',
    brand: 'Adidas',
    athleteId: 'ath-3',
    value: 50000,
    stage: 'lead',
    deliverables: [],
    paymentStatus: 'pending',
    nextAction: 'Initial meeting scheduled for Friday',
  },
];

export const events: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Weekly Training Session',
    athleteIds: ['ath-1'],
    type: 'training',
    startDate: new Date(today.setHours(9, 0)),
    endDate: new Date(today.setHours(11, 0)),
    location: 'USC Practice Facility',
  },
  {
    id: 'evt-2',
    title: 'Game vs UCLA',
    athleteIds: ['ath-1'],
    type: 'game',
    startDate: addDays(today, 3),
    endDate: addDays(today, 3),
    location: 'Rose Bowl, Pasadena',
  },
  {
    id: 'evt-3',
    title: 'Nike Photoshoot',
    athleteIds: ['ath-1'],
    type: 'content',
    startDate: addDays(today, 5),
    endDate: addDays(today, 5),
    location: 'Downtown LA Studio',
  },
  {
    id: 'evt-4',
    title: 'Flight to Durham',
    athleteIds: ['ath-2'],
    type: 'travel',
    startDate: addDays(today, 1),
    endDate: addDays(today, 1),
    location: 'LAX → RDU',
  },
  {
    id: 'evt-5',
    title: 'Beats Partnership Meeting',
    athleteIds: ['ath-2'],
    type: 'deal',
    startDate: addDays(today, 2),
    endDate: addDays(today, 2),
    location: 'Virtual',
  },
  {
    id: 'evt-6',
    title: 'Stanford vs Cal Game',
    athleteIds: ['ath-3'],
    type: 'game',
    startDate: addDays(today, 4),
    endDate: addDays(today, 4),
    location: 'Stanford Stadium',
  },
];

export const contentItems: ContentItem[] = [
  {
    id: 'cnt-1',
    athleteId: 'ath-1',
    platform: 'Instagram',
    hook: 'Game day prep routine',
    dueDate: addDays(today, 2),
    status: 'edit',
  },
  {
    id: 'cnt-2',
    athleteId: 'ath-2',
    platform: 'TikTok',
    hook: 'Day in the life at Duke',
    dueDate: addDays(today, 4),
    status: 'shoot',
  },
  {
    id: 'cnt-3',
    athleteId: 'ath-1',
    platform: 'YouTube',
    hook: 'Training with the team',
    caption: 'Behind the scenes at practice',
    dueDate: addDays(today, 7),
    status: 'script',
  },
  {
    id: 'cnt-4',
    athleteId: 'ath-3',
    platform: 'Instagram',
    hook: 'Pre-match nutrition tips',
    dueDate: addDays(today, 1),
    status: 'schedule',
  },
];

// Helper functions
export const getAthlete = (id: string) => athletes.find(a => a.id === id);
export const getAthletesByIds = (ids: string[]) => athletes.filter(a => ids.includes(a.id));
export const getTasksByAthlete = (athleteId: string) => tasks.filter(t => t.athleteId === athleteId);
export const getDealsByAthlete = (athleteId: string) => deals.filter(d => d.athleteId === athleteId);
export const getEventsByAthlete = (athleteId: string) => events.filter(e => e.athleteIds.includes(athleteId));
export const getContentByAthlete = (athleteId: string) => contentItems.filter(c => c.athleteId === athleteId);

export const formatCurrency = (value: number) => 
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

const toSafeDate = (value: Date | string | number) => {
  const normalized = value instanceof Date ? value : new Date(value);
  return Number.isNaN(normalized.getTime()) ? null : normalized;
};

export const formatDate = (date: Date | string | number) => {
  const safeDate = toSafeDate(date);
  if (!safeDate) return 'Invalid date';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(safeDate);
};

export const formatTime = (date: Date | string | number) => {
  const safeDate = toSafeDate(date);
  if (!safeDate) return 'Invalid time';
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(safeDate);
};

export const isToday = (date: Date | string | number) => {
  const safeDate = toSafeDate(date);
  if (!safeDate) return false;
  const today = new Date();
  return safeDate.toDateString() === today.toDateString();
};

export const isPastDue = (date: Date | string | number) => {
  const safeDate = toSafeDate(date);
  if (!safeDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return safeDate < today;
};
