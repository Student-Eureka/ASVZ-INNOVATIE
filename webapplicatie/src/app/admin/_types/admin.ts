export type Role = 'user' | 'admin';
export type NavId = 'users' | 'new-pumps' | 'audit';

export type UserRow = {
  id: string;
  name: string;
  role: Role;
  lastLogin?: string;
  woningCode: string;
};

export type NewPumpRow = {
  uniqueId: string;
  id: string;
  woning: string;
  status: string;
  lastUpdate: string;
  statusTopic: string;
  commandTopic: string;
};

export type AuditRow = {
  id: string;
  uniqueId: string;
  pompId: string;
  woning: string;
  kind: 'status' | 'command' | 'info';
  status?: string;
  message: string;
  createdAt: string;
  topic: string;
};

export type PageRule = {
  id: string;
  label: string;
  path: string;
  userCan: boolean;
  adminCan: boolean;
};
