import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from '../../../models/account.model';
import { Transaction } from '../../../models/transaction.model';
import { AccountService } from '../../../services/account.service';
import { TransactionService } from '../../../services/transaction.service';

@Component({
  selector: 'app-transaction-form',
  template: `
    <div class="container">
      <div class="row mb-4">
        <div class="col">
          <h1>
            <i class="bi bi-plus-circle me-2"></i>
            New Transaction
          </h1>
        </div>
        <div class="col-auto">
          <button class="btn btn-outline-secondary" (click)="goBack()">
            <i class="bi bi-arrow-left me-1"></i>
            Back
          </button>
        </div>
      </div>

      <div class="row">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Transaction Details</h5>
            </div>
            <div class="card-body">
              <form [formGroup]="transactionForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="accountSelect" class="form-label">Account</label>
                  <select 
                    id="accountSelect" 
                    class="form-select" 
                    formControlName="account_code"
                    (change)="onAccountChange()"
                  >
                    <option value="" disabled>Select an account</option>
                    <option *ngFor="let account of accounts" [value]="account.code">
                      {{ account.account_number }} - Balance: {{ account.outstanding_balance | currency:'ZAR' }}
                    </option>
                  </select>
                  <div *ngIf="submitted && f['account_code'].errors" class="text-danger mt-1">
                    <small *ngIf="f['account_code'].errors?.['required']">Account is required</small>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="transactionType" class="form-label">Transaction Type</label>
                  <select 
                    id="transactionType" 
                    class="form-select" 
                    formControlName="transaction_type"
                    (change)="onTransactionTypeChange()"
                  >
                    <option value="" disabled>Select transaction type</option>
                    <option value="deposit">Deposit</option>
                    <option value="withdrawal">Withdrawal</option>
                  </select>
                  <div *ngIf="submitted && f['transaction_type'].errors" class="text-danger mt-1">
                    <small *ngIf="f['transaction_type'].errors?.['required']">Transaction type is required</small>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="amount" class="form-label">Amount</label>
                  <div class="input-group">
                    <span class="input-group-text">R</span>
                    <input 
                      type="number" 
                      id="amount" 
                      class="form-control" 
                      formControlName="amount"
                      min="0.01"
                      step="0.01"
                    >
                  </div>
                  <div *ngIf="submitted && f['amount'].errors" class="text-danger mt-1">
                    <small *ngIf="f['amount'].errors?.['required']">Amount is required</small>
                    <small *ngIf="f['amount'].errors?.['min']">Amount must be greater than 0</small>
                  </div>
                  <div *ngIf="insufficientFunds" class="text-danger mt-1">
                    <small>Insufficient funds for this withdrawal</small>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="description" class="form-label">Description</label>
                  <input 
                    type="text" 
                    id="description" 
                    class="form-control" 
                    formControlName="description"
                    placeholder="Enter transaction description"
                  >
                  <div *ngIf="submitted && f['description'].errors" class="text-danger mt-1">
                    <small *ngIf="f['description'].errors?.['required']">Description is required</small>
                    <small *ngIf="f['description'].errors?.['minlength']">Description must be at least 3 characters</small>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="transactionDate" class="form-label">Transaction Date</label>
                  <input 
                    type="datetime-local" 
                    id="transactionDate" 
                    class="form-control" 
                    formControlName="transaction_date"
                  >
                  <div *ngIf="submitted && f['transaction_date'].errors" class="text-danger mt-1">
                    <small *ngIf="f['transaction_date'].errors?.['required']">Transaction date is required</small>
                  </div>
                </div>

                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button type="button" class="btn btn-outline-secondary" (click)="goBack()">Cancel</button>
                  <button type="submit" class="btn btn-primary" [disabled]="loading">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                    Create Transaction
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card mb-4" *ngIf="selectedAccount">
            <div class="card-header">
              <h5 class="mb-0">Account Information</h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label class="form-label text-muted">Account Number</label>
                <div class="form-control-plaintext">{{ selectedAccount.account_number }}</div>
              </div>
              
              <div class="mb-3">
                <label class="form-label text-muted">Current Balance</label>
                <div class="form-control-plaintext">
                  <span [ngClass]="selectedAccount.outstanding_balance >= 0 ? 'text-success' : 'text-danger'">
                    <strong>{{ selectedAccount.outstanding_balance | currency:'ZAR' }}</strong>
                  </span>
                </div>
              </div>
              
              <div class="mb-3">
                <label class="form-label text-muted">Status</label>
                <div class="form-control-plaintext">
                  <span class="badge" [ngClass]="selectedAccount.status_code === 1 ? 'bg-success' : 'bg-danger'">
                    {{ selectedAccount.status_code === 1 ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">Transaction Preview</h5>
            </div>
            <div class="card-body">
              <div *ngIf="!transactionForm.valid" class="text-center text-muted py-4">
                <i class="bi bi-info-circle fs-3 d-block mb-2"></i>
                Complete the form to see a preview of your transaction
              </div>
              
              <div *ngIf="transactionForm.valid">
                <div class="mb-3">
                  <label class="form-label text-muted">Transaction Type</label>
                  <div class="form-control-plaintext">
                    <span class="badge" [ngClass]="getTransactionTypeBadgeClass()">
                      {{ getTransactionTypeLabel() }}
                    </span>
                  </div>
                </div>
                
                <div class="mb-3">
                  <label class="form-label text-muted">Amount</label>
                  <div class="form-control-plaintext">
                    <span [ngClass]="getTransactionAmountClass()">
                      <strong>{{ getTransactionAmount() | currency:'ZAR' }}</strong>
                    </span>
                  </div>
                </div>
                
                <div class="mb-3">
                  <label class="form-label text-muted">New Balance After Transaction</label>
                  <div class="form-control-plaintext">
                    <span [ngClass]="getNewBalanceClass()">
                      <strong>{{ getNewBalance() | currency:'ZAR' }}</strong>
                    </span>
                  </div>
                </div>
                
                <div class="mb-3">
                  <label class="form-label text-muted">Description</label>
                  <div class="form-control-plaintext">{{ f['description'].value || 'No description' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class TransactionFormComponent implements OnInit {
  transactionForm: FormGroup;
  accounts: Account[] = [];
  selectedAccount: Account | null = null;
  loading = false;
  submitted = false;
  insufficientFunds = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private transactionService: TransactionService
  ) {
    this.transactionForm = this.formBuilder.group({
      account_code: ['', Validators.required],
      transaction_type: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      transaction_date: [this.formatDateForInput(new Date()), Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAccounts();
  }

  // Convenience getter for easy access to form fields
  get f() { return this.transactionForm.controls; }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe({
      next: (data) => {
        this.accounts = data.filter(a => a.status_code === 1);
      },
      error: (error) => {
        console.error('Error loading accounts', error);
      }
    });
  }

  onAccountChange(): void {
    const accountCode = this.f['account_code'].value;
    if (accountCode) {
      this.selectedAccount = this.accounts.find(a => a.code === Number(accountCode)) || null;
    } else {
      this.selectedAccount = null;
    }
    this.validateWithdrawal();
  }

  onTransactionTypeChange(): void {
    this.validateWithdrawal();
  }

  validateWithdrawal(): void {
    this.insufficientFunds = false;
    
    if (this.f['transaction_type'].value === 'withdrawal' && 
        this.selectedAccount && 
        this.f['amount'].value) {
      const amount = Number(this.f['amount'].value);
      this.insufficientFunds = amount > this.selectedAccount.outstanding_balance;
    }
  }

  getTransactionTypeLabel(): string {
    return this.f['transaction_type'].value === 'deposit' ? 'Deposit' : 'Withdrawal';
  }

  getTransactionTypeBadgeClass(): string {
    return this.f['transaction_type'].value === 'deposit' ? 'bg-success' : 'bg-danger';
  }

  getTransactionAmount(): number {
    const amount = Number(this.f['amount'].value) || 0;
    return this.f['transaction_type'].value === 'deposit' ? amount : -amount;
  }

  getTransactionAmountClass(): string {
    return this.f['transaction_type'].value === 'deposit' ? 'text-success' : 'text-danger';
  }

  getNewBalance(): number {
    if (!this.selectedAccount) return 0;
    
    const currentBalance = this.selectedAccount.outstanding_balance;
    const transactionAmount = this.getTransactionAmount();
    
    return currentBalance + transactionAmount;
  }

  getNewBalanceClass(): string {
    const newBalance = this.getNewBalance();
    return newBalance >= 0 ? 'text-success' : 'text-danger';
  }

  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  onSubmit(): void {
    this.submitted = true;
    
    // Stop here if form is invalid
    if (this.transactionForm.invalid) {
      return;
    }
    
    // Check for insufficient funds
    this.validateWithdrawal();
    if (this.insufficientFunds) {
      return;
    }
    
    this.loading = true;
    
    // Prepare transaction object
    const transaction: Partial<Transaction> = {
      account_code: Number(this.f['account_code'].value),
      amount: this.getTransactionAmount(),
      description: this.f['description'].value,
      transaction_date: new Date(this.f['transaction_date'].value)
    };
    
    this.transactionService.createTransaction(transaction).subscribe({
      next: (data) => {
        this.loading = false;
        alert('Transaction created successfully!');
        this.router.navigate(['/transactions']);
      },
      error: (error) => {
        console.error('Error creating transaction', error);
        this.loading = false;
        alert('Error creating transaction. Please try again.');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/transactions']);
  }
} 