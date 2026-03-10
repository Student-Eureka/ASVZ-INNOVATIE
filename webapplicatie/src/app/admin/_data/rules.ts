import type { PageRule } from '../_types/admin';

export const DEFAULT_RULES: PageRule[] = [
  { id: 'r1', label: 'Inloggen', path: '/login', userCan: true, adminCan: true },
  { id: 'r2', label: 'Dashboard', path: '/dashboard', userCan: true, adminCan: true },
  { id: 'r3', label: 'Pompenoverzicht', path: '/pompen', userCan: true, adminCan: true },
  { id: 'r4', label: 'Pompdetail', path: '/pompen/[id]', userCan: true, adminCan: true },
  { id: 'r5', label: 'Documentatie', path: '/docs', userCan: true, adminCan: true },
  { id: 'r6', label: 'Admin panel', path: '/admin', userCan: false, adminCan: true },
];
