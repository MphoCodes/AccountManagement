import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Account } from '../../../models/account.model';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-account-list',
  template: `
    <div class="container">
      <div class="row mb-4">
        <div class="col">
          <h1>
            <i class="bi bi-wallet2 me-2"></i>
            Accounts
          </h1>
        </div>
        <div class="col-auto">
          <button class="btn btn-primary" routerLink="/accounts/new">
            <i class="bi bi-plus-circle me-1"></i>
            New Account
          </button>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <div class="input-group">
                <span class="input-group-text">
                  <i class="bi bi-search"></i>
                </span>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Search by account number" 
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
              <select class="form-select" [(ngModel)]="statusFilter" (change)="applyFilters()">
                <option value="all">All Statuses</option>
                <option value="1">Open</option>
                <option value="2">Closed</option>
              </select>
            </div>
            <div class="col-md-3">
              <select class="form-select" [(ngModel)]="balanceFilter" (change)="applyFilters()">
                <option value="all">All Balances</option>
                <option value="positive">Positive Balance</option>
                <option value="negative">Negative Balance</option>
                <option value="zero">Zero Balance</option>
              </select>
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
                <th>Account Number</th>
                <th>Person</th>
                <th>
                  <div class="d-flex align-items-center">
                    Balance
                    <button class="btn btn-sm btn-link p-0 ms-1" (click)="toggleSortOrder()">
                      <i class="bi" [ngClass]="sortOrder === 'asc' ? 'bi-sort-numeric-down' : 'bi-sort-numeric-up'"></i>
                    </button>
                  </div>
                </th>
                <th>Status</th>
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
              <tr *ngIf="!loading && filteredAccounts.length === 0">
                <td colspan="6" class="text-center py-4">
                  <i class="bi bi-exclamation-circle text-muted me-2"></i>
                  No accounts found
                </td>
              </tr>
              <tr *ngFor="let account of filteredAccounts">
                <td>{{ account.code }}</td>
                <td>{{ account.account_number }}</td>
                <td>{{ getPersonName(account.person_code) }}</td>
                <td [ngClass]="{
                  'text-success': account.outstanding_balance > 0,
                  'text-danger': account.outstanding_balance < 0
                }">
                  {{ account.outstanding_balance | currency:'ZAR' }}
                </td>
                <td>
                  <span [ngClass]="account.status_code === 1 ? 'badge bg-success' : 'badge bg-danger'">
                    {{ account.status_code === 1 ? 'Open' : 'Closed' }}
                  </span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" (click)="viewAccount(account)">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-secondary" (click)="editAccount(account)">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button 
                      class="btn btn-outline-success" 
                      (click)="addTransaction(account)"
                      [disabled]="account.status_code === 2"
                    >
                      <i class="bi bi-plus-circle"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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
export class AccountListComponent implements OnInit {
  accounts: Account[] = [];
  filteredAccounts: Account[] = [];
  loading = true;
  searchControl = new FormControl('');
  statusFilter = 'all';
  balanceFilter = 'all';
  sortOrder: 'asc' | 'desc' = 'desc';

  constructor(
    private accountService: AccountService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAccounts();

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.applyFilters();
    });
  }

  loadAccounts(): void {
    this.loading = true;
    
    this.accountService.getAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading accounts', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.accounts];
    
    // Apply search filter
    const searchTerm = this.searchControl.value?.toLowerCase();
    if (searchTerm) {
      filtered = filtered.filter(account => 
        account.account_number.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply status filter
    if (this.statusFilter !== 'all') {
      const statusCode = parseInt(this.statusFilter);
      filtered = filtered.filter(account => account.status_code === statusCode);
    }
    
    // Apply balance filter
    if (this.balanceFilter !== 'all') {
      switch (this.balanceFilter) {
        case 'positive':
          filtered = filtered.filter(account => account.outstanding_balance > 0);
          break;
        case 'negative':
          filtered = filtered.filter(account => account.outstanding_balance < 0);
          break;
        case 'zero':
          filtered = filtered.filter(account => account.outstanding_balance === 0);
          break;
      }
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (this.sortOrder === 'asc') {
        return a.outstanding_balance - b.outstanding_balance;
      } else {
        return b.outstanding_balance - a.outstanding_balance;
      }
    });
    
    this.filteredAccounts = filtered;
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  viewAccount(account: Account): void {
    this.router.navigate(['/accounts', account.code]);
  }

  editAccount(account: Account): void {
    this.router.navigate(['/accounts', account.code, 'edit']);
  }

  addTransaction(account: Account): void {
    this.router.navigate(['/transactions/new'], { queryParams: { accountId: account.code } });
  }

  getPersonName(personCode: number): string {
    if (!personCode) return 'Unknown';
    
    // Find the person in the account's person property if available
    const account = this.accounts.find(a => a.person_code === personCode);
    if (account && account.person) {
      return `${account.person.surname}, ${account.person.name || ''}`;
    }
    
    // If we don't have the person data, return a generic label
    return `Person ID: ${personCode}`;
  }
} 