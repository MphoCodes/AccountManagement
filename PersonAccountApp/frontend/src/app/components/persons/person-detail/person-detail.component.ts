import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Person } from '../../../models/person.model';
import { Account } from '../../../models/account.model';
import { PersonService } from '../../../services/person.service';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-person-detail',
  template: `
    <div class="container" *ngIf="person">
      <div class="row mb-4">
        <div class="col">
          <h1>
            <i class="bi bi-person me-2"></i>
            Person Details
          </h1>
        </div>
        <div class="col-auto">
          <div class="btn-group">
            <button class="btn btn-outline-primary" (click)="editPerson()">
              <i class="bi bi-pencil me-1"></i>
              Edit
            </button>
            <button class="btn btn-outline-danger" (click)="deletePerson()" [disabled]="hasAccounts()">
              <i class="bi bi-trash me-1"></i>
              Delete
            </button>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="card-title mb-0">Personal Information</h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label class="form-label text-muted">ID</label>
                <p class="form-control-plaintext">{{ person.code }}</p>
              </div>
              <div class="mb-3">
                <label class="form-label text-muted">ID Number</label>
                <p class="form-control-plaintext">{{ person.id_number }}</p>
              </div>
              <div class="mb-3">
                <label class="form-label text-muted">Name</label>
                <p class="form-control-plaintext">{{ person.name || '-' }}</p>
              </div>
              <div class="mb-3">
                <label class="form-label text-muted">Surname</label>
                <p class="form-control-plaintext">{{ person.surname }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0">Accounts</h5>
              <button class="btn btn-sm btn-primary" (click)="addAccount()">
                <i class="bi bi-plus-circle me-1"></i>
                Add Account
              </button>
            </div>
            <div class="card-body p-0">
              <div *ngIf="loading" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
              <div *ngIf="!loading && (!accounts || accounts.length === 0)" class="text-center py-4">
                <i class="bi bi-credit-card text-muted fs-1"></i>
                <p class="text-muted mt-2">No accounts found</p>
              </div>
              <ul *ngIf="!loading && accounts && accounts.length > 0" class="list-group list-group-flush">
                <li *ngFor="let account of accounts" class="list-group-item">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 class="mb-1">{{ account.account_number }}</h6>
                      <p class="mb-0 text-muted">
                        <span [class]="account.status_code === 1 ? 'badge bg-success' : 'badge bg-danger'">
                          {{ account.status_code === 1 ? 'Open' : 'Closed' }}
                        </span>
                      </p>
                    </div>
                    <div>
                      <h5 class="mb-0" [class.text-danger]="account.outstanding_balance < 0" [class.text-success]="account.outstanding_balance > 0">
                        {{ account.outstanding_balance | currency:'USD' }}
                      </h5>
                      <button class="btn btn-sm btn-link" (click)="viewAccount(account)">
                        View Details
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="!person && !loading" class="container text-center py-5">
      <i class="bi bi-exclamation-triangle text-warning fs-1"></i>
      <h3 class="mt-3">Person not found</h3>
      <p class="text-muted">The person you are looking for does not exist or has been removed.</p>
      <button class="btn btn-primary mt-3" routerLink="/persons">
        Back to Persons List
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
export class PersonDetailComponent implements OnInit {
  person: Person | null = null;
  accounts: Account[] = [];
  loading = true;

  constructor(
    private personService: PersonService,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPerson(+id);
    } else {
      this.router.navigate(['/persons']);
    }
  }

  loadPerson(id: number): void {
    this.loading = true;
    
    // Use the real API
    this.personService.getPerson(id).subscribe({
      next: (person) => {
        this.person = person;
        this.loadAccounts();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading person', error);
        this.loading = false;
      }
    });
  }

  loadAccounts(): void {
    // Use the real API to fetch accounts
    if (this.person) {
      this.accountService.getAccountsByPerson(this.person.code).subscribe({
        next: (accounts) => {
          this.accounts = accounts;
        },
        error: (error) => {
          console.error('Error loading accounts', error);
        }
      });
    }
  }

  editPerson(): void {
    if (this.person) {
      this.router.navigate(['/persons', this.person.code, 'edit']);
    }
  }

  deletePerson(): void {
    if (this.person && !this.hasAccounts()) {
      if (confirm(`Are you sure you want to delete ${this.person.surname}, ${this.person.name || ''}?`)) {
        this.personService.deletePerson(this.person.code).subscribe({
          next: () => {
            this.router.navigate(['/persons']);
          },
          error: (error) => {
            console.error('Error deleting person', error);
          }
        });
      }
    }
  }

  hasAccounts(): boolean {
    return this.accounts.length > 0;
  }

  addAccount(): void {
    if (this.person) {
      this.router.navigate(['/accounts/new'], { queryParams: { personId: this.person.code } });
    }
  }

  viewAccount(account: Account): void {
    this.router.navigate(['/accounts', account.code]);
  }
} 