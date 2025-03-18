import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  template: `
    <div class="container py-5">
      <div class="row mb-5">
        <div class="col-md-8 offset-md-2 text-center">
          <h1 class="display-4 mb-3">Account Management System</h1>
          <p class="lead mb-4">Developed for Traq Software</p>
          <div class="card shadow-sm">
            <div class="card-body p-5">
              <div class="mb-4">
                <i class="bi bi-bank display-1 text-primary"></i>
              </div>
              <p class="mb-4">A comprehensive solution for managing accounts, transactions, and customer information.</p>
              <div *ngIf="!isLoggedIn" class="d-grid gap-2 d-sm-flex justify-content-sm-center">
                <a routerLink="/login" class="btn btn-primary btn-lg px-4 gap-3">
                  <i class="bi bi-box-arrow-in-right me-2"></i>Login
                </a>
                <a routerLink="/about" class="btn btn-outline-secondary btn-lg px-4">
                  <i class="bi bi-info-circle me-2"></i>Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4 py-5">
        <div class="col-md-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <div class="feature-icon bg-primary bg-gradient text-white rounded-3 mb-3">
                <i class="bi bi-people"></i>
              </div>
              <h3>Person Management</h3>
              <p>Efficiently manage customer information with comprehensive profiles and easy-to-use interfaces.</p>
              <ul class="list-unstyled">
                <li><i class="bi bi-check-circle-fill text-success me-2"></i>Customer registration</li>
                <li><i class="bi bi-check-circle-fill text-success me-2"></i>Profile management</li>
                <li><i class="bi bi-check-circle-fill text-success me-2"></i>Search and filtering</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <div class="feature-icon bg-primary bg-gradient text-white rounded-3 mb-3">
                <i class="bi bi-wallet2"></i>
              </div>
              <h3>Account Management</h3>
              <p>Create and manage customer accounts with real-time balance tracking and status monitoring.</p>
              <ul class="list-unstyled">
                <li><i class="bi bi-check-circle-fill text-success me-2"></i>Account creation</li>
                <li><i class="bi bi-check-circle-fill text-success me-2"></i>Balance tracking</li>
                <li><i class="bi bi-check-circle-fill text-success me-2"></i>Status management</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <div class="feature-icon bg-primary bg-gradient text-white rounded-3 mb-3">
                <i class="bi bi-arrow-left-right"></i>
              </div>
              <h3>Transaction Processing</h3>
              <p>Record and track financial transactions with detailed history and reporting capabilities.</p>
              <ul class="list-unstyled">
                <li><i class="bi bi-check-circle-fill text-success me-2"></i>Deposits and withdrawals</li>
                <li><i class="bi bi-check-circle-fill text-success me-2"></i>Transaction history</li>
                <li><i class="bi bi-check-circle-fill text-success me-2"></i>Receipt generation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .feature-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 4rem;
      height: 4rem;
      font-size: 2rem;
    }
  `]
})
export class HomeComponent {
  isLoggedIn = false;

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }
} 