import type { ReactNode } from 'react';

export type TopicId =
  | 'login'
  | 'dashboard'
  | 'select-pomp'
  | 'pomp'
  | 'logboek'
  | 'waarom'
  | 'architectuur';

export interface Topic {
  id: TopicId;
  titel: string;
  subtitel: string;
}

export interface ContentBlock {
  title: string;
  body: ReactNode;
}
