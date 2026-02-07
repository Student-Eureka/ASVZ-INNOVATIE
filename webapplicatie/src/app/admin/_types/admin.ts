export type Role = 'user' | 'admin';
export type NavId = 'users' | 'permissions' | 'audit';

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: Role;
  lastLogin?: string;
};

export type PageRule = {
  id: string;
  label: string;
  path: string;
  userCan: boolean;
  adminCan: boolean;
};
