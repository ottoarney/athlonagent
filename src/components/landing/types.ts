import { UserRole } from '@/lib/auth-flow';

export interface RolePath {
  role: UserRole;
  title: string;
  description: string;
  signupPath: string;
  loginPath: string;
}

export const rolePaths: RolePath[] = [
  {
    role: 'agent',
    title: 'Agent / Agency',
    description: 'Control athlete operations, deal timelines, obligations, and team accountability.',
    signupPath: '/signup/agent',
    loginPath: '/login/agent',
  },
  {
    role: 'athlete',
    title: 'Athlete',
    description: 'See what is due, what is next, and what your team needs in one clear portal.',
    signupPath: '/signup/athlete',
    loginPath: '/login/athlete',
  },
];
