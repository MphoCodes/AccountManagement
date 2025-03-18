import { Account } from './account.model';

export interface Person {
  code: number;
  name: string;
  surname: string;
  id_number: string;
  accounts?: Account[];
} 