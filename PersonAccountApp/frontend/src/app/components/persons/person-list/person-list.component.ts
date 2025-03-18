import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Person } from '../../../models/person.model';
import { PersonService } from '../../../services/person.service';

@Component({
  selector: 'app-person-list',
  template: `
    <div class="container py-4">
      <!-- Header with soft shadow and gradient background -->
      <div class="row align-items-center mb-4 p-3 rounded-3 bg-gradient">
        <div class="col">
          <h1 class="d-flex align-items-center mb-0 text-primary">
            <i class="bi bi-people-fill me-2"></i>
            <span>People Directory</span>
          </h1>
        </div>
        <div class="col-auto">
          <button class="btn btn-primary shadow-sm" routerLink="/persons/new">
            <i class="bi bi-plus-circle-fill me-2"></i>
            Add New Person
          </button>
        </div>
      </div>

      <!-- Search card with soft shadow -->
      <div class="card shadow-sm border-0 rounded-3 mb-4">
        <div class="card-body p-4">
          <div class="row g-3">
            <div class="col-md-6">
              <div class="input-group input-group-lg">
                <span class="input-group-text bg-light border-end-0">
                  <i class="bi bi-search text-primary"></i>
                </span>
                <input 
                  type="text" 
                  class="form-control border-start-0 ps-0" 
                  placeholder="Search by ID, surname or account number" 
                  [formControl]="searchControl"
                  aria-label="Search persons"
                >
                <button 
                  *ngIf="searchControl.value" 
                  class="btn btn-outline-secondary border-start-0" 
                  type="button"
                  (click)="clearSearch()"
                >
                  <i class="bi bi-x-lg"></i>
                </button>
              </div>
            </div>
            <div class="col-md-6">
              <div class="d-flex justify-content-md-end">
                <div class="btn-group">
                  <button class="btn btn-outline-secondary" (click)="toggleView('table')" [class.active]="viewMode === 'table'">
                    <i class="bi bi-table me-1"></i> Table
                  </button>
                  <button class="btn btn-outline-secondary" (click)="toggleView('grid')" [class.active]="viewMode === 'grid'">
                    <i class="bi bi-grid-3x3-gap me-1"></i> Grid
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading spinner -->
      <div *ngIf="loading" class="text-center my-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Loading people...</p>
      </div>

      <!-- Empty state -->
      <div *ngIf="!loading && persons.length === 0" class="card shadow-sm border-0 rounded-3 p-5 text-center">
        <div class="my-5">
          <i class="bi bi-person-slash text-muted" style="font-size: 3rem;"></i>
          <h3 class="mt-3">No people found</h3>
          <p class="text-muted">Try adjusting your search or add a new person.</p>
          <button class="btn btn-primary mt-2" routerLink="/persons/new">
            <i class="bi bi-plus-circle me-2"></i>
            Add New Person
          </button>
        </div>
      </div>

      <!-- Table view -->
      <div *ngIf="!loading && persons.length > 0 && viewMode === 'table'" class="card shadow-sm border-0 rounded-3 overflow-hidden">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th class="px-4 py-3">ID</th>
                <th class="px-4 py-3">ID Number</th>
                <th class="px-4 py-3">Name</th>
                <th class="px-4 py-3">Surname</th>
                <th class="px-4 py-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let person of persons" class="align-middle">
                <td class="px-4 py-3 fw-bold">{{ person.code }}</td>
                <td class="px-4 py-3">{{ person.id_number }}</td>
                <td class="px-4 py-3">{{ person.name || '-' }}</td>
                <td class="px-4 py-3">{{ person.surname }}</td>
                <td class="px-4 py-3 text-end">
                  <div class="btn-group">
                    <button class="btn btn-sm btn-outline-primary" (click)="viewPerson(person)" title="View details">
                      <i class="bi bi-eye-fill"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" (click)="editPerson(person)" title="Edit">
                      <i class="bi bi-pencil-fill"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" (click)="deletePerson(person)" [disabled]="hasAccounts(person)" title="Delete">
                      <i class="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Grid view -->
      <div *ngIf="!loading && persons.length > 0 && viewMode === 'grid'" class="row g-4">
        <div *ngFor="let person of persons" class="col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm border-0 rounded-3 hover-card">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <div class="avatar-circle me-3 bg-primary text-white">
                  {{ person.name?.charAt(0) || person.surname.charAt(0) }}
                </div>
                <div>
                  <h5 class="card-title mb-0">{{ person.surname }}, {{ person.name || '-' }}</h5>
                  <p class="card-subtitle text-muted small">ID: {{ person.code }}</p>
                </div>
              </div>
              <div class="mb-3">
                <span class="badge bg-light text-dark me-2">
                  <i class="bi bi-fingerprint me-1"></i>
                  {{ person.id_number }}
                </span>
                <span *ngIf="hasAccounts(person)" class="badge bg-info text-dark">
                  <i class="bi bi-wallet2 me-1"></i>
                  Has Accounts
                </span>
              </div>
              <div class="d-flex justify-content-end mt-3">
                <button class="btn btn-sm btn-outline-primary me-2" (click)="viewPerson(person)">
                  <i class="bi bi-eye-fill me-1"></i> View
                </button>
                <button class="btn btn-sm btn-outline-secondary me-2" (click)="editPerson(person)">
                  <i class="bi bi-pencil-fill me-1"></i> Edit
                </button>
                <button class="btn btn-sm btn-outline-danger" (click)="deletePerson(person)" [disabled]="hasAccounts(person)">
                  <i class="bi bi-trash-fill me-1"></i> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bg-gradient {
      background: linear-gradient(to right, #f8f9fa, #e9ecef);
    }
    
    .hover-card {
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }
    
    .hover-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
    }
    
    .avatar-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 1.2rem;
    }
    
    .table th {
      white-space: nowrap;
    }
    
    .btn-group .btn {
      border-radius: 0.25rem;
      margin-right: 0.25rem;
    }
    
    .btn-group .btn:last-child {
      margin-right: 0;
    }
  `]
})
export class PersonListComponent implements OnInit {
  persons: Person[] = [];
  loading = true;
  searchControl = new FormControl('');
  viewMode: 'table' | 'grid' = 'table';

  constructor(
    private personService: PersonService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPersons();

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.loadPersons(value || '');
    });
  }

  loadPersons(searchTerm?: string): void {
    this.loading = true;
    
    // For demo purposes, use mock data
    // setTimeout(() => {
    //   this.persons = this.personService.getMockPersons();
    //   
    //   if (searchTerm) {
    //     const term = searchTerm.toLowerCase();
    //     this.persons = this.persons.filter(person => 
    //       person.id_number.toLowerCase().includes(term) || 
    //       person.surname.toLowerCase().includes(term) ||
    //       (person.name && person.name.toLowerCase().includes(term))
    //     );
    //   }
    //   
    //   this.loading = false;
    // }, 500);
    
    // In a real application, use the API
    this.personService.getPersons(searchTerm).subscribe({
      next: (data) => {
        this.persons = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading persons', error);
        this.loading = false;
      }
    });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  viewPerson(person: Person): void {
    this.router.navigate(['/persons', person.code]);
  }

  editPerson(person: Person): void {
    this.router.navigate(['/persons', person.code, 'edit']);
  }

  deletePerson(person: Person): void {
    if (confirm(`Are you sure you want to delete ${person.surname}, ${person.name || ''}?`)) {
      this.personService.deletePerson(person.code).subscribe({
        next: () => {
          this.loadPersons(this.searchControl.value || '');
        },
        error: (error) => {
          console.error('Error deleting person', error);
        }
      });
    }
  }

  hasAccounts(person: Person): boolean {
    // For now, we'll continue to use the same logic
    // In a real application, we would check if the person has accounts
    // by calling the accountService.getAccountsByPerson(person.code)
    return person.code % 2 === 0;
  }

  toggleView(view: 'table' | 'grid'): void {
    this.viewMode = view;
  }
}