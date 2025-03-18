import { Person } from './person.model';
import { Transaction } from './transaction.model';
import { Status } from './status.model';

export interface Account {
  code: number;
  person_code: number;
  account_number: string;
  outstanding_balance: number;
  status_code: number;
  person?: Person;
  transactions?: Transaction[];
  status?: Status;
} 