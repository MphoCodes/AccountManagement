import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = `${environment.apiUrl}/Transactions`;

  constructor(private http: HttpClient) { }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  getTransactionsByAccount(accountId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${environment.apiUrl}/accounts/${accountId}/transactions`);
  }

  getTransaction(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  createTransaction(transaction: Partial<Transaction>): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transaction);
  }

  // For demo purposes only - comment out when connecting to real API
  // getMockTransactions(): Transaction[] {
  //   return [
  //     {
  //       code: 1,
  //       account_code: 1,
  //       amount: 150.00,
  //       description: 'Salary deposit',
  //       transaction_date: new Date('2023-05-15T09:30:00')
  //     },
  //     {
  //       code: 2,
  //       account_code: 1,
  //       amount: -45.50,
  //       description: 'Grocery shopping',
  //       transaction_date: new Date('2023-05-16T14:20:00')
  //     },
  //     {
  //       code: 3,
  //       account_code: 2,
  //       amount: 200.00,
  //       description: 'Bonus payment',
  //       transaction_date: new Date('2023-05-17T10:15:00')
  //     },
  //     {
  //       code: 4,
  //       account_code: 2,
  //       amount: -75.25,
  //       description: 'Utility bill payment',
  //       transaction_date: new Date('2023-05-18T16:45:00')
  //     },
  //     {
  //       code: 5,
  //       account_code: 3,
  //       amount: 100.00,
  //       description: 'Refund',
  //       transaction_date: new Date('2023-05-19T11:30:00')
  //     },
  //     {
  //       code: 6,
  //       account_code: 3,
  //       amount: -30.00,
  //       description: 'Online subscription',
  //       transaction_date: new Date('2023-05-20T08:10:00')
  //     },
  //     {
  //       code: 7,
  //       account_code: 4,
  //       amount: 300.00,
  //       description: 'Client payment',
  //       transaction_date: new Date('2023-05-21T13:25:00')
  //     },
  //     {
  //       code: 8,
  //       account_code: 4,
  //       amount: -120.75,
  //       description: 'Restaurant bill',
  //       transaction_date: new Date('2023-05-22T19:50:00')
  //     }
  //   ];
  // }
} 