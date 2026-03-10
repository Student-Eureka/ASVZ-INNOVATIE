export interface Pomp {
  uniqueId: string;
  id: string;
  woning: string;
  status: string;
}

export interface DashboardEvent {
  id: string;
  uniqueId: string;
  pompId: string;
  woning: string;
  kind: 'status' | 'command' | 'info';
  status?: string;
  message: string;
  createdAt: string;
  topic: string;
}
