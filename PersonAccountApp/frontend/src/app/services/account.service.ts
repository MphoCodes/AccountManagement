import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Account } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = `${environment.apiUrl}/Accounts`;

  constructor(private http: HttpClient) { }

  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.apiUrl);
  }

  getAccountsByPerson(personId: number): Observable<Account[]> {
    return this.http.get<Account[]>(`${environment.apiUrl}/persons/${personId}/accounts`);
  }

  getAccount(id: number): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/${id}`);
  }

  createAccount(account: Account): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, account);
  }

  updateAccount(id: number, account: Account): Observable<Account> {
    return this.http.put<Account>(`${this.apiUrl}/${id}`, account);
  }

  // For demo purposes only - comment out when connecting to real API
  // getMockAccounts(): Account[] {
  //   return [
  //     {
  //       code: 1,
  //       person_code: 2,
  //       account_number: '10001085',
  //       outstanding_balance: 267.61,
  //       status_code: 1
  //     },
  //     {
  //       code: 2,
  //       person_code: 4,
  //       account_number: '10007792',
  //       outstanding_balance: 328.7,
  //       status_code: 1
  //     },
  //     {
  //       code: 3,
  //       person_code: 6,
  //       account_number: '10012044',
  //       outstanding_balance: 157.6,
  //       status_code: 1
  //     },
  //     {
  //       code: 4,
  //       person_code: 8,
  //       account_number: '10014357',
  //       outstanding_balance: 440.87,
  //       status_code: 1
  //     },
  //     {
  //       code: 5,
  //       person_code: 10,
  //       account_number: '10016473',
  //       outstanding_balance: 663.77,
  //       status_code: 2
  //     }
  //   ];
  // }
} 