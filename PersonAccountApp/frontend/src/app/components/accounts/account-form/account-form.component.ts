import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from '../../../models/account.model';
import { Person } from '../../../models/person.model';
import { AccountService } from '../../../services/account.service';
import { PersonService } from '../../../services/person.service';
import { StatusService } from '../../../services/status.service';
import { Status } from '../../../models/status.model';

@Component({
  selector: 'app-account-form',
  template: `
    <div class="container">
      <div class="row mb-4">
        <div class="col">
          <h1>
            <i class="bi bi-wallet2 me-2"></i>
            {{ isEditMode ? 'Edit Account' : 'New Account' }}
          </h1>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <form [formGroup]="accountForm" (ngSubmit)="onSubmit()">
            <div class="row g-3">
              <div class="col-md-6" *ngIf="!isEditMode">
                <label for="personCode" class="form-label">Person *</label>
                <select 
                  class="form-select" 
                  id="personCode" 
                  formControlName="person_code"
                  [class.is-invalid]="submitted && f['person_code'].errors"
                >
                  <option value="">Select a person</option>
                  <option *ngFor="let person of persons" [value]="person.code">
                    {{ person.surname }}, {{ person.name || '' }} ({{ person.id_number }})
                  </option>
                </select>
                <div *ngIf="submitted && f['person_code'].errors" class="invalid-feedback">
                  <div *ngIf="f['person_code'].errors['required']">Person is required</div>
                </div>
              </div>

              <div class="col-md-6" *ngIf="isEditMode">
                <label class="form-label">Person</label>
                <p class="form-control-plaintext">{{ getPersonName(accountForm.get('person_code')?.value) }}</p>
              </div>

              <div class="col-md-6">
                <label for="accountNumber" class="form-label">Account Number *</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="accountNumber" 
                  formControlName="account_number"
                  [class.is-invalid]="submitted && f['account_number'].errors"
                  [readonly]="isEditMode"
                >
                <div *ngIf="submitted && f['account_number'].errors" class="invalid-feedback">
                  <div *ngIf="f['account_number'].errors['required']">Account number is required</div>
                  <div *ngIf="f['account_number'].errors['pattern']">Account number must be numeric</div>
                </div>
              </div>

              <div class="col-md-6" *ngIf="!isEditMode">
                <label for="outstandingBalance" class="form-label">Initial Balance *</label>
                <div class="input-group">
                  <span class="input-group-text">R</span>
                  <input 
                    type="number" 
                    class="form-control" 
                    id="outstandingBalance" 
                    formControlName="outstanding_balance"
                    [class.is-invalid]="submitted && f['outstanding_balance'].errors"
                    step="0.01"
                  >
                  <div *ngIf="submitted && f['outstanding_balance'].errors" class="invalid-feedback">
                    <div *ngIf="f['outstanding_balance'].errors['required']">Initial balance is required</div>
                  </div>
                </div>
              </div>

              <div class="col-md-6" *ngIf="isEditMode">
                <label class="form-label">Current Balance</label>
                <p class="form-control-plaintext">{{ accountForm.get('outstanding_balance')?.value | currency:'ZAR' }}</p>
                <small class="text-muted">Balance can only be modified through transactions</small>
              </div>

              <div class="col-md-6">
                <label for="statusCode" class="form-label">Status *</label>
                <select 
                  class="form-select" 
                  id="statusCode" 
                  formControlName="status_code"
                  [class.is-invalid]="submitted && f['status_code'].errors"
                >
                  <option [value]="1">Open</option>
                  <option [value]="2">Closed</option>
                </select>
                <div *ngIf="submitted && f['status_code'].errors" class="invalid-feedback">
                  <div *ngIf="f['status_code'].errors['required']">Status is required</div>
                </div>
                <div *ngIf="isEditMode && accountForm.get('outstanding_balance')?.value !== 0 && accountForm.get('status_code')?.value === 2" class="text-danger mt-1">
                  <small>Cannot close an account with non-zero balance</small>
                </div>
              </div>

              <div class="col-12 mt-4">
                <div class="d-flex gap-2">
                  <button 
                    type="submit" 
                    class="btn btn-primary" 
                    [disabled]="loading || (isEditMode && accountForm.get('outstanding_balance')?.value !== 0 && accountForm.get('status_code')?.value === 2)"
                  >
                    <span *ngIf="loading" class="spinner-border spinner-border-sm me-1"></span>
                    {{ isEditMode ? 'Update' : 'Create' }}
                  </button>
                  <button type="button" class="btn btn-outline-secondary" (click)="goBack()">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AccountFormComponent implements OnInit {
  accountForm: FormGroup;
  isEditMode = false;
  accountId: number | null = null;
  loading = false;
  submitted = false;
  persons: Person[] = [];
  statuses: Status[] = [];
  account: Account | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private personService: PersonService,
    private statusService: StatusService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.accountForm = this.formBuilder.group({
      person_code: ['', Validators.required],
      account_number: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      outstanding_balance: [0, Validators.required],
      status_code: [1, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadPersons();
    this.loadStatuses();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.accountId = +id;
      this.loadAccount(this.accountId);
    } else {
      // Check if we have a personId query parameter
      const personId = this.route.snapshot.queryParamMap.get('personId');
      if (personId) {
        this.accountForm.patchValue({ person_code: +personId });
      }
    }
  }

  get f() {
    return this.accountForm.controls;
  }

  loadPersons(): void {
    this.personService.getPersons().subscribe({
      next: (data) => {
        this.persons = data;
      },
      error: (error) => {
        console.error('Error loading persons', error);
      }
    });
  }

  loadStatuses(): void {
    this.statusService.getStatuses().subscribe({
      next: (data: Status[]) => {
        this.statuses = data;
      },
      error: (error: any) => {
        console.error('Error loading statuses', error);
      }
    });
  }

  loadAccount(id: number): void {
    this.loading = true;
    
    this.accountService.getAccount(id).subscribe({
      next: (data) => {
        this.account = data;
        this.populateForm();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading account', error);
        this.loading = false;
        this.router.navigate(['/accounts']);
      }
    });
  }

  populateForm(): void {
    if (this.account) {
      this.accountForm.patchValue(this.account);
      
      // Disable person_code and account_number fields in edit mode
      this.accountForm.get('person_code')?.disable();
      this.accountForm.get('account_number')?.disable();
      
      // Disable balance field in edit mode (can only be changed via transactions)
      this.accountForm.get('outstanding_balance')?.disable();
    }
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.accountForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    const account: Account = {
      ...this.accountForm.value,
      code: this.isEditMode ? this.account!.code : 0
    };
    
    if (this.isEditMode) {
      this.accountService.updateAccount(account.code, account).subscribe({
        next: (data) => {
          this.loading = false;
          alert('Account updated successfully!');
          this.router.navigate(['/accounts', data.code]);
        },
        error: (error) => {
          console.error('Error updating account', error);
          this.loading = false;
          alert('Error updating account. Please try again.');
        }
      });
    } else {
      this.accountService.createAccount(account).subscribe({
        next: (data) => {
          this.loading = false;
          alert('Account created successfully!');
          this.router.navigate(['/accounts', data.code]);
        },
        error: (error) => {
          console.error('Error creating account', error);
          this.loading = false;
          alert('Error creating account. Please try again.');
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/accounts']);
  }

  getPersonName(personCode: number | null): string {
    if (!personCode) return 'Unknown';
    
    // For demo purposes, find the person in the mock data
    const person = this.persons.find(p => p.code === personCode);
    return person ? `${person.surname}, ${person.name || ''}` : `Person ${personCode}`;
  }
} 