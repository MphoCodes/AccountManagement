import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  template: `
    <div class="container py-5">
      <div class="row mb-5">
        <div class="col-md-8 offset-md-2">
          <div class="card shadow rounded-3">
            <div class="card-body p-5">
              <h1 class="display-4 mb-4 text-center fw-bold text-primary">Get in Touch</h1>
              
              <div class="text-center mb-5">
                <div class="developer-image mb-4">
                  <img src="https://cdn-icons-png.flaticon.com/512/10169/10169718.png" alt="Mpho Ndlela" class="img-fluid rounded-circle border border-3 border-primary">
                </div>
                <h2 class="mb-2 fw-bold">Mpho Ndlela</h2>
                <p class="lead">Software Developer</p>
                <hr class="my-4 w-50 mx-auto" />
              </div>
              
              <div class="row justify-content-center">
                <div class="col-lg-8">
                  <div class="card bg-light border-0 rounded-3">
                    <div class="card-body p-4">
                      <div class="contact-info">
                        <div class="contact-item d-flex align-items-center mb-4">
                          <div class="icon-wrapper">
                            <i class="bi bi-envelope-fill text-primary fs-3"></i>
                          </div>
                          <div class="ms-3">
                            <h5 class="mb-1">Email</h5>
                            <p class="mb-0">
                              <a href="mailto:mpho.ndlela&#64;example.com" class="text-decoration-none">mpho.ndlela&#64;gmail.com</a>
                            </p>
                          </div>
                        </div>
                        
                        <div class="contact-item d-flex align-items-center mb-4">
                          <div class="icon-wrapper">
                            <i class="bi bi-telephone-fill text-primary fs-3"></i>
                          </div>
                          <div class="ms-3">
                            <h5 class="mb-1">Phone</h5>
                            <p class="mb-0">
                              <a href="tel:+27621711265" class="text-decoration-none">+2762 171 1265</a>
                            </p>
                          </div>
                        </div>
                        
                        <div class="contact-item d-flex align-items-center">
                          <div class="icon-wrapper">
                            <i class="bi bi-linkedin text-primary fs-3"></i>
                          </div>
                          <div class="ms-3">
                            <h5 class="mb-1">LinkedIn</h5>
                            <p class="mb-0">
                              <a href="https://linkedin.com/in/mphondlela" class="text-decoration-none" target="_blank">linkedin.com/in/mphondlela</a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="text-center mt-5">
                    <button class="btn btn-primary btn-lg px-5 rounded-pill">
                      <i class="bi bi-chat-dots-fill me-2"></i>Send Message
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="text-center mt-5">
                <p class="text-muted small">
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
      width: 160px;
      height: 160px;
      margin: 0 auto;
      overflow: hidden;
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
    
    .developer-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    .developer-image img:hover {
      transform: scale(1.05);
    }
    
    .icon-wrapper {
      width: 50px;
      height: 50px;
      background-color: rgba(13, 110, 253, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .contact-item {
      transition: transform 0.2s ease;
    }
    
    .contact-item:hover {
      transform: translateX(5px);
    }
    
    a {
      color: #333;
    }
    
    a:hover {
      color: #0d6efd;
    }
    
    .card {
      box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    }
  `]
})
export class ContactComponent {}