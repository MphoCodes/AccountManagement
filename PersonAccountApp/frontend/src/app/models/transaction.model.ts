import { Account } from './account.model';

export interface Transaction {
  code: number;
  account_code: number;
  transaction_date: Date;
  capture_date: Date;
  amount: number;
  description: string;
  account?: Account;
} 