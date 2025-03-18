import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Transaction } from '../../../models/transaction.model';
import { TransactionService } from '../../../services/transaction.service';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-transaction-list',
  template: `
    <div class="container">
      <div class="row mb-4">
        <div class="col">
          <h1>
            <i class="bi bi-arrow-left-right me-2"></i>
            Transactions
          </h1>
        </div>
        <div class="col-auto">
          <button class="btn btn-primary" routerLink="/transactions/new">
            <i class="bi bi-plus-circle me-1"></i>
            New Transaction
          </button>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <div class="input-group">
                <span class="input-group-text">
                  <i class="bi bi-search"></i>
                </span>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Search by description" 
                  [formControl]="searchControl"
                >
                <button 
                  *ngIf="searchControl.value" 
                  class="btn btn-outline-secondary" 
                  type="button"
                  (click)="clearSearch()"
                >
                  <i class="bi bi-x"></i>
                </button>
              </div>
            </div>
            <div class="col-md-3">
              <select class="form-select" [(ngModel)]="typeFilter" (change)="applyFilters()">
                <option value="all">All Types</option>
                <option value="deposit">Deposits</option>
                <option value="withdrawal">Withdrawals</option>
              </select>
            </div>
            <div class="col-md-3">
              <select class="form-select" [(ngModel)]="dateFilter" (change)="applyFilters()">
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <div class="col-md-2">
              <button class="btn btn-outline-secondary w-100" (click)="toggleSortOrder()">
                <i class="bi" [ngClass]="sortOrder === 'asc' ? 'bi-sort-down' : 'bi-sort-up'"></i>
                {{ sortOrder === 'asc' ? 'Oldest First' : 'Newest First' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="table table-striped table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Account</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngIf="loading">
                <td colspan="6" class="text-center py-4">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
              <tr *ngIf="!loading && filteredTransactions.length === 0">
                <td colspan="6" class="text-center py-4">
                  <i class="bi bi-exclamation-circle text-muted me-2"></i>
                  No transactions found
                </td>
              </tr>
              <tr *ngFor="let transaction of filteredTransactions">
                <td>{{ transaction.code }}</td>
                <td>{{ transaction.transaction_date | date:'medium' }}</td>
                <td>{{ getAccountNumber(transaction.account_code) }}</td>
                <td>{{ transaction.description }}</td>
                <td [ngClass]="transaction.amount >= 0 ? 'text-success' : 'text-danger'">
                  {{ transaction.amount | currency:'ZAR' }}
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" (click)="viewTransaction(transaction)">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-secondary" (click)="viewAccount(transaction.account_code)">
                      <i class="bi bi-wallet2"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card mt-4" *ngIf="filteredTransactions.length > 0">
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <div class="card bg-light">
                <div class="card-body text-center">
                  <h6 class="card-title text-muted">Total Transactions</h6>
                  <h3 class="mb-0">{{ filteredTransactions.length }}</h3>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card bg-light">
                <div class="card-body text-center">
                  <h6 class="card-title text-muted">Total Deposits</h6>
                  <h3 class="text-success mb-0">{{ getTotalDeposits() | currency:'ZAR' }}</h3>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card bg-light">
                <div class="card-body text-center">
                  <h6 class="card-title text-muted">Total Withdrawals</h6>
                  <h3 class="text-danger mb-0">{{ getTotalWithdrawals() | currency:'ZAR' }}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table th {
      white-space: nowrap;
    }
  `]
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  loading = true;
  searchControl = new FormControl('');
  typeFilter = 'all';
  dateFilter = 'all';
  sortOrder: 'asc' | 'desc' = 'desc';

  constructor(
    private transactionService: TransactionService,
    private accountService: AccountService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadTransactions();

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.applyFilters();
    });
  }

  loadTransactions(): void {
    this.loading = true;
    
    // Use the real API
    this.transactionService.getTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading transactions', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.transactions];
    
    // Apply search filter
    const searchTerm = this.searchControl.value?.toLowerCase();
    if (searchTerm) {
      filtered = filtered.filter(transaction => 
        transaction.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply type filter
    if (this.typeFilter !== 'all') {
      if (this.typeFilter === 'deposit') {
        filtered = filtered.filter(transaction => transaction.amount > 0);
      } else if (this.typeFilter === 'withdrawal') {
        filtered = filtered.filter(transaction => transaction.amount < 0);
      }
    }
    
    // Apply date filter
    if (this.dateFilter !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.transaction_date);
        transactionDate.setHours(0, 0, 0, 0);
        
        if (this.dateFilter === 'today') {
          return transactionDate.getTime() === today.getTime();
        } else if (this.dateFilter === 'week') {
          return transactionDate >= weekStart;
        } else if (this.dateFilter === 'month') {
          return transactionDate >= monthStart;
        }
        
        return true;
      });
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.transaction_date).getTime();
      const dateB = new Date(b.transaction_date).getTime();
      
      return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    
    this.filteredTransactions = filtered;
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  viewTransaction(transaction: Transaction): void {
    this.router.navigate(['/transactions', transaction.code]);
  }

  viewAccount(accountCode: number): void {
    this.router.navigate(['/accounts', accountCode]);
  }

  getAccountNumber(accountCode: number): string {
    if (!accountCode) return 'Unknown';
    
    // Find the account in the transaction's account property if available
    const transaction = this.transactions.find(t => t.account_code === accountCode);
    if (transaction && transaction.account) {
      return transaction.account.account_number;
    }
    
    // If we don't have the account data, return a generic label
    return `Account ID: ${accountCode}`;
  }

  getTotalDeposits(): number {
    return this.filteredTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getTotalWithdrawals(): number {
    return this.filteredTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }
} 