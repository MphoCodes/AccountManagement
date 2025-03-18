import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from '../../../models/account.model';
import { Transaction } from '../../../models/transaction.model';
import { AccountService } from '../../../services/account.service';
import { TransactionService } from '../../../services/transaction.service';

@Component({
  selector: 'app-account-detail',
  template: `
    <div class="container" *ngIf="account">
      <div class="row mb-4">
        <div class="col">
          <h1>
            <i class="bi bi-wallet2 me-2"></i>
            Account Details
          </h1>
        </div>
        <div class="col-auto">
          <div class="btn-group">
            <button class="btn btn-outline-primary" (click)="editAccount()">
              <i class="bi bi-pencil me-1"></i>
              Edit
            </button>
            <button 
              class="btn btn-outline-success" 
              (click)="addTransaction()"
              [disabled]="account.status_code === 2"
            >
              <i class="bi bi-plus-circle me-1"></i>
              Add Transaction
            </button>
            <button 
              class="btn btn-outline-warning" 
              (click)="toggleAccountStatus()"
              [disabled]="account.outstanding_balance !== 0 && account.status_code === 1"
            >
              <i class="bi" [ngClass]="account.status_code === 1 ? 'bi-lock' : 'bi-unlock'"></i>
              {{ account.status_code === 1 ? 'Close Account' : 'Reopen Account' }}
            </button>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-5">
          <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0">Account Information</h5>
              <span [ngClass]="account.status_code === 1 ? 'badge bg-success' : 'badge bg-danger'">
                {{ account.status_code === 1 ? 'Open' : 'Closed' }}
              </span>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label class="form-label text-muted">Account ID</label>
                <p class="form-control-plaintext">{{ account.code }}</p>
              </div>
              <div class="mb-3">
                <label class="form-label text-muted">Account Number</label>
                <p class="form-control-plaintext">{{ account.account_number }}</p>
              </div>
              <div class="mb-3">
                <label class="form-label text-muted">Person</label>
                <p class="form-control-plaintext">
                  <a [routerLink]="['/persons', account.person_code]">
                    {{ getPersonName(account.person_code) }}
                  </a>
                </p>
              </div>
              <div class="mb-3">
                <label class="form-label text-muted">Outstanding Balance</label>
                <h3 [ngClass]="{
                  'text-success': account.outstanding_balance > 0,
                  'text-danger': account.outstanding_balance < 0,
                  'text-muted': account.outstanding_balance === 0
                }">
                  {{ account.outstanding_balance | currency:'ZAR' }}
                </h3>
              </div>
            </div>
          </div>

          <div class="card mb-4">
            <div class="card-header">
              <h5 class="card-title mb-0">Balance Summary</h5>
            </div>
            <div class="card-body p-0">
              <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  <span>Total Credits</span>
                  <span class="text-success">{{ getTotalCredits() | currency:'ZAR' }}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  <span>Total Debits</span>
                  <span class="text-danger">{{ getTotalDebits() | currency:'ZAR' }}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  <span>Transaction Count</span>
                  <span class="badge bg-primary rounded-pill">{{ transactions.length }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="col-md-7">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0">Transaction History</h5>
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-secondary" (click)="sortTransactions('date')">
                  <i class="bi bi-calendar"></i>
                </button>
                <button class="btn btn-outline-secondary" (click)="sortTransactions('amount')">
                  <i class="bi bi-currency-dollar"></i>
                </button>
              </div>
            </div>
            <div class="card-body p-0">
              <div *ngIf="loading" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
              <div *ngIf="!loading && (!transactions || transactions.length === 0)" class="text-center py-4">
                <i class="bi bi-receipt text-muted fs-1"></i>
                <p class="text-muted mt-2">No transactions found</p>
              </div>
              <div *ngIf="!loading && transactions && transactions.length > 0" class="list-group list-group-flush">
                <div *ngFor="let transaction of transactions" class="list-group-item">
                  <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">{{ transaction.description }}</h6>
                    <small>{{ transaction.transaction_date | date:'mediumDate' }}</small>
                  </div>
                  <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted">Transaction #{{ transaction.code }}</small>
                    <h5 [ngClass]="transaction.amount >= 0 ? 'text-success' : 'text-danger'">
                      {{ transaction.amount | currency:'ZAR' }}
                    </h5>
                  </div>
                  <small class="text-muted">Captured: {{ transaction.capture_date | date:'medium' }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="!account && !loading" class="container text-center py-5">
      <i class="bi bi-exclamation-triangle text-warning fs-1"></i>
      <h3 class="mt-3">Account not found</h3>
      <p class="text-muted">The account you are looking for does not exist or has been removed.</p>
      <button class="btn btn-primary mt-3" routerLink="/accounts">
        Back to Accounts List
      </button>
    </div>

    <div *ngIf="loading" class="container text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `,
  styles: []
})
export class AccountDetailComponent implements OnInit {
  account: Account | null = null;
  transactions: Transaction[] = [];
  loading = true;
  sortField: 'date' | 'amount' = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor(
    private accountService: AccountService,
    private transactionService: TransactionService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAccount();
  }

  loadAccount(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading = false;
      return;
    }

    this.accountService.getAccount(Number(id)).subscribe({
      next: (data) => {
        this.account = data;
        this.loadTransactions(this.account.code);
      },
      error: (error) => {
        console.error('Error loading account', error);
        this.loading = false;
      }
    });
  }

  loadTransactions(accountId: number): void {
    this.transactionService.getTransactionsByAccount(accountId).subscribe({
      next: (data) => {
        this.transactions = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading transactions', error);
        this.loading = false;
      }
    });
  }

  sortTransactions(field: 'date' | 'amount'): void {
    this.sortField = field;
    
    if (field === this.sortField) {
      // Toggle direction if clicking the same field
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Default to descending for dates, ascending for amounts
      this.sortDirection = field === 'date' ? 'desc' : 'asc';
    }
    
    this.transactions.sort((a, b) => {
      let comparison = 0;
      
      if (field === 'date') {
        comparison = new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime();
      } else {
        comparison = a.amount - b.amount;
      }
      
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  getTotalCredits(): number {
    return this.transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getTotalDebits(): number {
    return this.transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0);
  }

  editAccount(): void {
    if (this.account) {
      this.router.navigate(['/accounts', this.account.code, 'edit']);
    }
  }

  addTransaction(): void {
    if (this.account && this.account.status_code === 1) {
      this.router.navigate(['/transactions/new'], { queryParams: { accountId: this.account.code } });
    }
  }

  toggleAccountStatus(): void {
    if (!this.account) return;
    
    if (this.account.status_code === 1 && this.account.outstanding_balance !== 0) {
      alert('Cannot close account with non-zero balance');
      return;
    }
    
    const newStatus = this.account.status_code === 1 ? 2 : 1;
    const updatedAccount = { ...this.account, status_code: newStatus };
    
    this.accountService.updateAccount(this.account.code, updatedAccount).subscribe({
      next: (updatedAccount) => {
        this.account = updatedAccount;
      },
      error: (error) => {
        console.error('Error updating account status', error);
      }
    });
  }

  getPersonName(personCode: number): string {
    if (!personCode) return 'Unknown';
    
    // Find the person in the account's person property if available
    if (this.account && this.account.person) {
      return `${this.account.person.surname}, ${this.account.person.name || ''}`;
    }
    
    // If we don't have the person data, return a generic label
    return `Person ${personCode}`;
  }
} 