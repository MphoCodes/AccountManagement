import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <div class="login-wrapper">
        <div class="login-card">
          <div class="login-header">
            <div class="logo-container">
              <div class="logo-circle">
                <mat-icon class="logo-icon">lock</mat-icon>
              </div>
            </div>
            <h1 class="login-title">Welcome Back</h1>
            <p class="login-subtitle">Sign in to your account to continue</p>
          </div>
          
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Username</mat-label>
              <mat-icon matPrefix class="form-icon">person</mat-icon>
              <input matInput formControlName="username" required>
              <mat-error *ngIf="loginForm.get('username')?.errors?.['required']">
                Username is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <mat-icon matPrefix class="form-icon">lock</mat-icon>
              <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" required>
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" [attr.aria-label]="'Hide password'" [attr.aria-pressed]="hidePassword" type="button">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.errors?.['required']">
                Password is required
              </mat-error>
            </mat-form-field>

            <div class="remember-forgot">
              <mat-checkbox color="primary">Remember me</mat-checkbox>
            </div>

            <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid || isLoading" class="login-button">
              <span *ngIf="!isLoading">Login</span>
              <mat-progress-spinner *ngIf="isLoading" diameter="20" mode="indeterminate" color="accent" class="spinner"></mat-progress-spinner>
            </button>

            <div class="demo-credentials">
              <mat-icon class="info-icon">info</mat-icon>
              <span>For testing, use: <strong>admin / admin123</strong></span>
            </div>

            <div *ngIf="error" class="error-message">
              <mat-icon>error_outline</mat-icon>
              <span>{{ error }}</span>
            </div>
          </form>
          
          <div class="login-footer">
            <p>Don't have an account? <a href="#" class="signup-link">Sign up</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 20px;
    }

    .login-wrapper {
      width: 100%;
      max-width: 450px;
    }

    .login-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }

    .login-header {
      text-align: center;
      padding: 30px 30px 0;
    }

    .logo-container {
      display: flex;
      justify-content: center;
      margin-bottom: 24px;
    }

    .logo-circle {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: linear-gradient(45deg, #3f51b5, #7986cb);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .logo-icon {
      font-size: 30px;
      color: white;
      width: 30px;
      height: 30px;
    }

    .login-title {
      font-size: 24px;
      font-weight: 500;
      margin: 0 0 8px;
      color: #333;
    }

    .login-subtitle {
      color: #777;
      margin: 0 0 24px;
    }

    .login-form {
      padding: 0 30px 30px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }

    .form-icon {
      color: #777;
      margin-right: 8px;
    }

    .remember-forgot {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .forgot-link {
      color: #3f51b5;
      text-decoration: none;
      font-size: 14px;
    }

    .forgot-link:hover {
      text-decoration: underline;
    }

    .login-button {
      width: 100%;
      padding: 10px;
      font-size: 16px;
      border-radius: 4px;
      position: relative;
      height: 40px;
    }

    .spinner {
      display: inline-block;
      margin: 0 auto;
    }

    .divider {
      position: relative;
      text-align: center;
      margin: 20px 0;
    }

    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background-color: #e0e0e0;
    }

    .divider-text {
      position: relative;
      background-color: white;
      padding: 0 10px;
      color: #777;
      font-size: 14px;
    }

    .social-login {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 20px;
    }

    .social-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 8px;
      border-radius: 4px;
    }

    .social-icon {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }

    .demo-credentials {
      background-color: #f0f4ff;
      border-radius: 4px;
      padding: 10px;
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      font-size: 14px;
      color: #3f51b5;
    }

    .info-icon {
      font-size: 18px;
      margin-right: 8px;
      color: #3f51b5;
    }

    .error-message {
      background-color: #fdecea;
      color: #d32f2f;
      padding: 10px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      margin-top: 15px;
    }

    .error-message mat-icon {
      margin-right: 8px;
    }

    .login-footer {
      text-align: center;
      padding: 20px 30px;
      background-color: #f5f5f5;
      border-top: 1px solid #e0e0e0;
    }

    .signup-link {
      color: #3f51b5;
      text-decoration: none;
      font-weight: 500;
    }

    .signup-link:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    const loginRequest = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };
    
    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.error = error.message || 'Invalid username or password';
        this.isLoading = false;
      }
    });
  }
}