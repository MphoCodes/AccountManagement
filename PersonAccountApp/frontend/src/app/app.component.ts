import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
          <a class="navbar-brand" routerLink="/">
            <i class="bi bi-bank me-2"></i>Account Management
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto">
              <li class="nav-item">
                <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
                  <i class="bi bi-house me-1"></i>Home
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/about" routerLinkActive="active">
                  <i class="bi bi-info-circle me-1"></i>About
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/contact" routerLinkActive="active">
                  <i class="bi bi-envelope me-1"></i>Contact
                </a>
              </li>
              <li class="nav-item" *ngIf="isLoggedIn">
                <a class="nav-link" routerLink="/persons" routerLinkActive="active">
                  <i class="bi bi-people me-1"></i>Persons
                </a>
              </li>
              <li class="nav-item" *ngIf="isLoggedIn">
                <a class="nav-link" routerLink="/accounts" routerLinkActive="active">
                  <i class="bi bi-wallet2 me-1"></i>Accounts
                </a>
              </li>
              <li class="nav-item" *ngIf="isLoggedIn">
                <a class="nav-link" routerLink="/transactions" routerLinkActive="active">
                  <i class="bi bi-arrow-left-right me-1"></i>Transactions
                </a>
              </li>
            </ul>
            <div class="d-flex" *ngIf="isLoggedIn">
              <span class="navbar-text me-3">
                <i class="bi bi-person-circle me-1"></i>{{ currentUser?.username }}
              </span>
              <button class="btn btn-outline-light" (click)="logout()">
                <i class="bi bi-box-arrow-right me-1"></i>Logout
              </button>
            </div>
            <div class="d-flex" *ngIf="!isLoggedIn">
              <a routerLink="/login" class="btn btn-outline-light">
                <i class="bi bi-box-arrow-in-right me-1"></i>Login
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div class="container mt-4 mb-5">
        <router-outlet></router-outlet>
      </div>

      <footer class="footer bg-light py-3 mt-auto">
        <div class="container text-center">
          <span class="text-muted">© 2025 Account Management System</span>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    .footer {
      margin-top: auto;
    }
    
    .navbar-brand {
      font-weight: 500;
    }
    
    .active {
      font-weight: bold;
      border-bottom: 2px solid white;
    }
  `]
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  currentUser: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 