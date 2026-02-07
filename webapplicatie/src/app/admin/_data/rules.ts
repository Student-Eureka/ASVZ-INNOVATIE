import type { PageRule } from '../_types/admin';

export const DEFAULT_RULES: PageRule[] = [
  { id: 'r1', label: 'Inloggen', path: '/login', userCan: true, adminCan: true },
  { id: 'r2', label: 'Dashboard', path: '/', userCan: true, adminCan: true },
  { id: 'r3', label: 'Selecteer pomp', path: '/select-pomp', userCan: true, adminCan: true },
  { id: 'r4', label: 'Pompscherm', path: '/pomp', userCan: true, adminCan: true },
  { id: 'r5', label: 'Status & logboek', path: '/logboek', userCan: true, adminCan: true },
  { id: 'r6', label: 'Admin panel', path: '/admin', userCan: false, adminCan: true },
];
