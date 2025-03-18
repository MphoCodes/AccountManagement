import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Transaction } from '../../../models/transaction.model';
import { Account } from '../../../models/account.model';
import { TransactionService } from '../../../services/transaction.service';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-transaction-detail',
  template: `
    <div class="container" *ngIf="!loading && transaction">
      <div class="row mb-4">
        <div class="col">
          <h1>
            <i class="bi bi-receipt me-2"></i>
            Transaction Details
          </h1>
        </div>
        <div class="col-auto">
          <button class="btn btn-outline-secondary me-2" (click)="goBack()">
            <i class="bi bi-arrow-left me-1"></i>
            Back
          </button>
          <button class="btn btn-primary" routerLink="/transactions/new">
            <i class="bi bi-plus-circle me-1"></i>
            New Transaction
          </button>
        </div>
      </div>

      <div class="row">
        <div class="col-md-8">
          <div class="card mb-4">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Transaction Information</h5>
              <span class="badge" [ngClass]="getTransactionTypeBadgeClass()">
                {{ getTransactionTypeLabel() }}
              </span>
            </div>
            <div class="card-body">
              <div class="row mb-3">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label text-muted">Transaction ID</label>
                    <div class="form-control-plaintext">{{ transaction.code }}</div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label text-muted">Date & Time</label>
                    <div class="form-control-plaintext">{{ transaction.transaction_date | date:'medium' }}</div>
                  </div>
                </div>
              </div>
              
              <div class="mb-3">
                <label class="form-label text-muted">Description</label>
                <div class="form-control-plaintext">{{ transaction.description }}</div>
              </div>
              
              <div class="row mb-3">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label text-muted">Amount</label>
                    <div class="form-control-plaintext">
                      <span [ngClass]="transaction.amount >= 0 ? 'text-success' : 'text-danger'">
                        <strong>{{ transaction.amount | currency:'ZAR' }}</strong>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label text-muted">Account</label>
                    <div class="form-control-plaintext">
                      <a [routerLink]="['/accounts', transaction.account_code]">
                        {{ getAccountNumber(transaction.account_code) }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">Transaction Receipt</h5>
            </div>
            <div class="card-body">
              <div class="receipt p-4 border rounded bg-light">
                <div class="text-center mb-4">
                  <h4 class="mb-1">Account Management System</h4>
                  <p class="text-muted small mb-0">Transaction Receipt</p>
                  <hr>
                </div>
                
                <div class="row mb-2">
                  <div class="col-6 text-muted">Transaction ID:</div>
                  <div class="col-6 text-end">{{ transaction.code }}</div>
                </div>
                
                <div class="row mb-2">
                  <div class="col-6 text-muted">Date:</div>
                  <div class="col-6 text-end">{{ transaction.transaction_date | date:'shortDate' }}</div>
                </div>
                
                <div class="row mb-2">
                  <div class="col-6 text-muted">Time:</div>
                  <div class="col-6 text-end">{{ transaction.transaction_date | date:'shortTime' }}</div>
                </div>
                
                <div class="row mb-2">
                  <div class="col-6 text-muted">Account:</div>
                  <div class="col-6 text-end">{{ getAccountNumber(transaction.account_code) }}</div>
                </div>
                
                <div class="row mb-2">
                  <div class="col-6 text-muted">Description:</div>
                  <div class="col-6 text-end">{{ transaction.description }}</div>
                </div>
                
                <hr>
                
                <div class="row mb-0">
                  <div class="col-6"><strong>Amount:</strong></div>
                  <div class="col-6 text-end">
                    <strong [ngClass]="transaction.amount >= 0 ? 'text-success' : 'text-danger'">
                      {{ transaction.amount | currency:'ZAR' }}
                    </strong>
                  </div>
                </div>
                
                <div class="text-center mt-4">
                  <p class="text-muted small mb-0">Thank you for using our services</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">Account Information</h5>
            </div>
            <div class="card-body" *ngIf="account">
              <div class="mb-3">
                <label class="form-label text-muted">Account Number</label>
                <div class="form-control-plaintext">
                  <a [routerLink]="['/accounts', account.code]">
                    {{ account.account_number }}
                  </a>
                </div>
              </div>
              
              <div class="mb-3">
                <label class="form-label text-muted">Account Holder</label>
                <div class="form-control-plaintext">
                  <a [routerLink]="['/persons', account.person_code]">
                    {{ getPersonName(account.person_code) }}
                  </a>
                </div>
              </div>
              
              <div class="mb-3">
                <label class="form-label text-muted">Current Balance</label>
                <div class="form-control-plaintext">
                  <span [ngClass]="account.outstanding_balance >= 0 ? 'text-success' : 'text-danger'">
                    <strong>{{ account.outstanding_balance | currency:'ZAR' }}</strong>
                  </span>
                </div>
              </div>
              
              <div class="mb-3">
                <label class="form-label text-muted">Status</label>
                <div class="form-control-plaintext">
                  <span class="badge" [ngClass]="account.status_code === 1 ? 'bg-success' : 'bg-danger'">
                    {{ account.status_code === 1 ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </div>
              
              <div class="d-grid">
                <a [routerLink]="['/accounts', account.code]" class="btn btn-outline-primary">
                  <i class="bi bi-wallet2 me-1"></i>
                  View Account Details
                </a>
              </div>
            </div>
          </div>
          
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Actions</h5>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <button class="btn btn-outline-primary" (click)="printReceipt()">
                  <i class="bi bi-printer me-1"></i>
                  Print Receipt
                </button>
                <button class="btn btn-outline-secondary" (click)="downloadPDF()">
                  <i class="bi bi-file-pdf me-1"></i>
                  Download PDF
                </button>
                <button class="btn btn-outline-info" (click)="emailReceipt()">
                  <i class="bi bi-envelope me-1"></i>
                  Email Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="container" *ngIf="loading">
      <div class="d-flex justify-content-center my-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
    
    <div class="container" *ngIf="!loading && !transaction">
      <div class="alert alert-warning">
        <i class="bi bi-exclamation-triangle me-2"></i>
        Transaction not found. The transaction may have been deleted or you may not have permission to view it.
      </div>
      <button class="btn btn-primary" routerLink="/transactions">
        <i class="bi bi-arrow-left me-1"></i>
        Back to Transactions
      </button>
    </div>
  `,
  styles: [`
    .receipt {
      font-family: 'Courier New', monospace;
    }
  `]
})
export class TransactionDetailComponent implements OnInit {
  transaction: Transaction | null = null;
  account: Account | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transactionService: TransactionService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.loadTransaction();
  }

  loadTransaction(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading = false;
      return;
    }

    this.transactionService.getTransaction(Number(id)).subscribe({
      next: (data) => {
        this.transaction = data;
        if (this.transaction) {
          this.loadAccount(this.transaction.account_code);
        } else {
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error loading transaction', error);
        this.loading = false;
      }
    });
  }

  loadAccount(accountCode: number): void {
    this.accountService.getAccount(accountCode).subscribe({
      next: (data) => {
        this.account = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading account', error);
        this.loading = false;
      }
    });
  }

  getTransactionTypeLabel(): string {
    if (!this.transaction) return '';
    
    if (this.transaction.amount > 0) {
      return 'Deposit';
    } else if (this.transaction.amount < 0) {
      return 'Withdrawal';
    } else {
      return 'Transfer';
    }
  }

  getTransactionTypeBadgeClass(): string {
    if (!this.transaction) return '';
    
    if (this.transaction.amount > 0) {
      return 'bg-success';
    } else if (this.transaction.amount < 0) {
      return 'bg-danger';
    } else {
      return 'bg-info';
    }
  }

  getAccountNumber(accountCode: number): string {
    if (this.account) {
      return this.account.account_number;
    }
    
    // Fallback if account not loaded yet
    return `Account ${accountCode}`;
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

  goBack(): void {
    this.router.navigate(['/transactions']);
  }

  printReceipt(): void {
    window.print();
  }

  downloadPDF(): void {
    // In a real application, this would generate and download a PDF
    alert('PDF download functionality would be implemented here');
  }

  emailReceipt(): void {
    // In a real application, this would send an email with the receipt
    alert('Email functionality would be implemented here');
  }
} 