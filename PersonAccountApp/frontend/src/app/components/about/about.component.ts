import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  template: `
    <div class="about-container">
      <div class="container py-5">
        <div class="row mb-5">
          <div class="col-lg-10 offset-lg-1">
            <div class="card shadow border-0 rounded-4 overflow-hidden">
              <!-- Header with gradient background -->
              <div class="card-header bg-gradient p-4 text-center">
                <h1 class="display-4 fw-bold text-white mb-0">About This Project</h1>
              </div>
              
              <div class="card-body p-5">
                <!-- Developer badge with animation -->
                <div class="text-center mb-5">
                  <div class="developer-badge mx-auto mb-4 animate__animated animate__fadeIn">
                    <i class="bi bi-code-slash display-1 text-primary"></i>
                  </div>
                  <p class="lead fw-bold text-primary animate__animated animate__fadeIn animate__delay-1s">
                    Account Management System
                  </p>
                  <p class="lead mb-0 animate__animated animate__fadeIn animate__delay-1s">
                    Developed by Mpho Ndlela as a comprehensive solution for managing financial accounts and transactions.
                  </p>
                </div>
                
                <!-- Features section with icons -->
                <div class="row g-4 mb-5">
                  <div class="col-md-4 animate__animated animate__fadeInUp">
                    <div class="feature-card text-center p-4 h-100">
                      <div class="feature-icon mb-3">
                        <i class="bi bi-people-fill text-primary"></i>
                      </div>
                      <h3 class="h4 mb-3">Person Management</h3>
                      <p class="text-muted mb-0">Create and manage customer profiles with ease, keeping all personal information organized.</p>
                    </div>
                  </div>
                  
                  <div class="col-md-4 animate__animated animate__fadeInUp animate__delay-1s">
                    <div class="feature-card text-center p-4 h-100">
                      <div class="feature-icon mb-3">
                        <i class="bi bi-wallet2 text-primary"></i>
                      </div>
                      <h3 class="h4 mb-3">Account Management</h3>
                      <p class="text-muted mb-0">Open, close, and monitor accounts with real-time balance tracking and status updates.</p>
                    </div>
                  </div>
                  
                  <div class="col-md-4 animate__animated animate__fadeInUp animate__delay-2s">
                    <div class="feature-card text-center p-4 h-100">
                      <div class="feature-icon mb-3">
                        <i class="bi bi-arrow-left-right text-primary"></i>
                      </div>
                      <h3 class="h4 mb-3">Transaction Processing</h3>
                      <p class="text-muted mb-0">Record deposits, withdrawals, and other financial transactions with detailed history.</p>
                    </div>
                  </div>
                </div>
                
                <!-- Technology stack and goals -->
                <div class="row g-4 mb-5">
                  <div class="col-md-6 animate__animated animate__fadeInLeft">
                    <div class="card h-100 border-0 shadow-sm">
                      <div class="card-body">
                        <h3 class="card-title d-flex align-items-center mb-4">
                          <span class="tech-icon me-3">
                            <i class="bi bi-stack text-primary"></i>
                          </span>
                          Technology Stack
                        </h3>
                        <ul class="list-group list-group-flush">
                          <li class="list-group-item border-0 ps-0">
                            <i class="bi bi-check-circle-fill text-success me-2"></i>
                            <strong>Frontend:</strong> Angular with Bootstrap and Material Design
                          </li>
                          <li class="list-group-item border-0 ps-0">
                            <i class="bi bi-check-circle-fill text-success me-2"></i>
                            <strong>Backend:</strong> ASP.NET Core Web API
                          </li>
                          <li class="list-group-item border-0 ps-0">
                            <i class="bi bi-check-circle-fill text-success me-2"></i>
                            <strong>Database:</strong> SQL Server
                          </li>
                          <li class="list-group-item border-0 ps-0">
                            <i class="bi bi-check-circle-fill text-success me-2"></i>
                            <strong>Authentication:</strong> JWT-based authentication
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div class="col-md-6 animate__animated animate__fadeInRight">
                    <div class="card h-100 border-0 shadow-sm">
                      <div class="card-body">
                        <h3 class="card-title d-flex align-items-center mb-4">
                          <span class="tech-icon me-3">
                            <i class="bi bi-lightbulb text-primary"></i>
                          </span>
                          Project Goals
                        </h3>
                        <ul class="list-group list-group-flush">
                          <li class="list-group-item border-0 ps-0">
                            <i class="bi bi-check-circle-fill text-success me-2"></i>
                            Provide a user-friendly interface for account management
                          </li>
                          <li class="list-group-item border-0 ps-0">
                            <i class="bi bi-check-circle-fill text-success me-2"></i>
                            Ensure secure and reliable transaction processing
                          </li>
                          <li class="list-group-item border-0 ps-0">
                            <i class="bi bi-check-circle-fill text-success me-2"></i>
                            Maintain accurate customer records and account balances
                          </li>
                          <li class="list-group-item border-0 ps-0">
                            <i class="bi bi-check-circle-fill text-success me-2"></i>
                            Deliver a scalable solution for financial management
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Footer with contact info -->
                <div class="text-center mt-5 animate__animated animate__fadeIn animate__delay-3s">
                  <div class="d-flex justify-content-center gap-4 mb-4">
                    <a href="#" class="social-icon">
                      <i class="bi bi-github"></i>
                    </a>
                    <a href="#" class="social-icon">
                      <i class="bi bi-linkedin"></i>
                    </a>
                    <a href="#" class="social-icon">
                      <i class="bi bi-envelope-fill"></i>
                    </a>
                  </div>
                  <p class="text-muted mb-1">
                    Developed by Mpho Ndlela for Traq Software
                  </p>
                  <p class="text-muted">
                    © 2025 Account Management System
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .about-container {
      background-color: #f8f9fa;
      min-height: 100vh;
    }
    
    .card-header.bg-gradient {
      background: linear-gradient(135deg, #007bff, #6610f2);
    }
    
    .developer-badge {
      width: 120px;
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f8f9fa;
      border-radius: 50%;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
    }
    
    .developer-badge:hover {
      transform: scale(1.05);
      box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.15);
    }
    
    .feature-card {
      border-radius: 0.75rem;
      background-color: #fff;
      box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
    }
    
    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1);
    }
    
    .feature-icon {
      font-size: 2.5rem;
      height: 70px;
      width: 70px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background-color: rgba(13, 110, 253, 0.1);
      margin-bottom: 1rem;
    }
    
    .tech-icon {
      width: 40px;
      height: 40px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background-color: rgba(13, 110, 253, 0.1);
      font-size: 1.25rem;
    }
    
    .social-icon {
      width: 40px;
      height: 40px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background-color: #f8f9fa;
      color: #007bff;
      font-size: 1.25rem;
      transition: all 0.3s ease;
      text-decoration: none;
    }
    
    .social-icon:hover {
      background-color: #007bff;
      color: white;
      transform: translateY(-3px);
    }
    
    /* Animation classes */
    .animate__animated {
      animation-duration: 1s;
    }
    
    .animate__fadeIn {
      animation-name: fadeIn;
    }
    
    .animate__fadeInUp {
      animation-name: fadeInUp;
    }
    
    .animate__fadeInLeft {
      animation-name: fadeInLeft;
    }
    
    .animate__fadeInRight {
      animation-name: fadeInRight;
    }
    
    .animate__delay-1s {
      animation-delay: 0.3s;
    }
    
    .animate__delay-2s {
      animation-delay: 0.6s;
    }
    
    .animate__delay-3s {
      animation-delay: 0.9s;
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translate3d(0, 30px, 0);
      }
      to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }
    
    @keyframes fadeInLeft {
      from {
        opacity: 0;
        transform: translate3d(-30px, 0, 0);
      }
      to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }
    
    @keyframes fadeInRight {
      from {
        opacity: 0;
        transform: translate3d(30px, 0, 0);
      }
      to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }
  `]
})
export class AboutComponent {} 