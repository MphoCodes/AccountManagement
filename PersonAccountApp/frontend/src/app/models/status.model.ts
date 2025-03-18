import { Account } from './account.model';

export interface Status {
  code: number;
  name: string;
  accounts?: Account[];
} 