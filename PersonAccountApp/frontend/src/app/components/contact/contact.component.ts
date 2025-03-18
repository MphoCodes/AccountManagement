import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  template: `
    <div class="container py-5">
      <div class="row mb-5">
        <div class="col-md-8 offset-md-2">
          <div class="card shadow-sm">
            <div class="card-body p-5">
              <h1 class="display-5 mb-4 text-center">Contact</h1>
              
              <div class="text-center mb-5">
                <div class="developer-image mb-3">
                  <img src="https://cdn-icons-png.flaticon.com/512/10169/10169718.png" alt="Mpho Ndlela" class="img-fluid rounded-circle">
                </div>
                <h2 class="mb-2">Mpho Ndlela</h2>
                <p class="lead text-muted">Software Developer</p>
              </div>
              
              <div class="row g-4">
                <div class="col-md-6 offset-md-3">
                  <div class="card">
                    <div class="card-body">
                      <h3 class="card-title mb-4 text-center">
                        <i class="bi bi-envelope-fill text-primary me-2"></i>
                        Get in Touch
                      </h3>
                      
                      <ul class="list-group list-group-flush">
                        <li class="list-group-item d-flex align-items-center">
                          <i class="bi bi-envelope me-3 text-primary fs-4"></i>
                          <div>
                            <strong>Email</strong>
                            <p class="mb-0">mpho.ndlela@example.com</p>
                          </div>
                        </li>
                        <li class="list-group-item d-flex align-items-center">
                          <i class="bi bi-telephone me-3 text-primary fs-4"></i>
                          <div>
                            <strong>Phone</strong>
                            <p class="mb-0">+27 12 345 6789</p>
                          </div>
                        </li>
                        <li class="list-group-item d-flex align-items-center">
                          <i class="bi bi-geo-alt me-3 text-primary fs-4"></i>
                          <div>
                            <strong>Location</strong>
                            <p class="mb-0">Johannesburg, South Africa</p>
                          </div>
                        </li>
                        <li class="list-group-item d-flex align-items-center">
                          <i class="bi bi-linkedin me-3 text-primary fs-4"></i>
                          <div>
                            <strong>LinkedIn</strong>
                            <p class="mb-0">linkedin.com/in/mphondlela</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="text-center mt-5">
                <p class="text-muted">
                  © 2025 Account Management System
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .developer-image {
      width: 150px;
      height: 150px;
      margin: 0 auto;
      overflow: hidden;
    }
    
    .developer-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `]
})
export class ContactComponent {} 