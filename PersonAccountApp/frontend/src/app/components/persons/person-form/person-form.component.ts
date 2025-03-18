import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Person } from '../../../models/person.model';
import { PersonService } from '../../../services/person.service';

@Component({
  selector: 'app-person-form',
  template: `
    <div class="container">
      <div class="row mb-4">
        <div class="col">
          <h1>
            <i class="bi bi-person me-2"></i>
            {{ isEditMode ? 'Edit Person' : 'New Person' }}
          </h1>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <form [formGroup]="personForm" (ngSubmit)="onSubmit()">
            <div class="row g-3">
              <div class="col-md-6">
                <label for="idNumber" class="form-label">ID Number *</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="idNumber" 
                  formControlName="id_number"
                  [class.is-invalid]="submitted && f['id_number'].errors"
                >
                <div *ngIf="submitted && f['id_number'].errors" class="invalid-feedback">
                  <div *ngIf="f['id_number'].errors['required']">ID Number is required</div>
                </div>
              </div>

              <div class="col-md-6">
                <label for="surname" class="form-label">Surname *</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="surname" 
                  formControlName="surname"
                  [class.is-invalid]="submitted && f['surname'].errors"
                >
                <div *ngIf="submitted && f['surname'].errors" class="invalid-feedback">
                  <div *ngIf="f['surname'].errors['required']">Surname is required</div>
                </div>
              </div>

              <div class="col-md-6">
                <label for="name" class="form-label">First Name</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="name" 
                  formControlName="name"
                >
              </div>

              <div class="col-12 mt-4">
                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary" [disabled]="loading">
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
export class PersonFormComponent implements OnInit {
  personForm: FormGroup;
  isEditMode = false;
  personId: number | null = null;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private personService: PersonService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.personForm = this.formBuilder.group({
      id_number: ['', Validators.required],
      surname: ['', Validators.required],
      name: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.personId = +id;
      this.loadPerson(this.personId);
    }
  }

  get f() {
    return this.personForm.controls;
  }

  loadPerson(id: number): void {
    this.loading = true;
    
    // Use the real API
    this.personService.getPerson(id).subscribe({
      next: (person) => {
        this.personForm.patchValue(person);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading person', error);
        this.loading = false;
        this.router.navigate(['/persons']);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.personForm.invalid) {
      return;
    }

    this.loading = true;
    const personData = this.personForm.value;

    // Call the API
    if (this.isEditMode && this.personId) {
      this.personService.updatePerson(this.personId, personData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/persons']);
        },
        error: (error) => {
          console.error('Error updating person', error);
          this.loading = false;
        }
      });
    } else {
      this.personService.createPerson(personData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/persons']);
        },
        error: (error) => {
          console.error('Error creating person', error);
          this.loading = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/persons']);
  }
} 