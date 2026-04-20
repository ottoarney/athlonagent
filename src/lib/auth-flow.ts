export type UserRole = 'agent';
export type AuthMode = 'signup' | 'login';

export const ROLE_STORAGE_KEY = 'athlon:selected-role';

export const isUserRole = (value: string | null | undefined): value is UserRole =>
  value === 'agent';

export function getStoredRole(): UserRole | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const role = window.localStorage.getItem(ROLE_STORAGE_KEY);
  return isUserRole(role) ? role : null;
}

export function setStoredRole(role: UserRole = 'agent') {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(ROLE_STORAGE_KEY, role);
}

export function getAuthRoute(mode: AuthMode) {
  return `/${mode}`;
}

export function getDashboardRoute() {
  return '/dashboard';
}
