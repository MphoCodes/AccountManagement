import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  template: `
    <div class="about-container">
      <div class="hero-section">
        <div class="overlay"></div>
        <div class="hero-content">
          <h1 class="hero-title">About This Project</h1>
          <div class="hero-badge">
            <i class="bi bi-code-slash"></i>
          </div>
        </div>
      </div>
      
      <div class="content-container">
        <div class="description-section">
          <p class="lead-text">
            This Account Management System was developed by Mpho Ndlela as a comprehensive solution for managing financial accounts and transactions.
          </p>
          
          <div class="divider">
            <span class="divider-icon"><i class="bi bi-arrow-down-circle-fill"></i></span>
          </div>
        </div>
        
        <div class="info-cards">
          <div class="info-card tech-stack">
            <div class="card-header">
              <i class="bi bi-stack"></i>
              <h3>Technology Stack</h3>
            </div>
            <ul class="feature-list">
              <li>
                <span class="feature-icon"><i class="bi bi-laptop"></i></span>
                <div class="feature-text">
                  <strong>Frontend:</strong> Angular with Bootstrap and Material Design
                </div>
              </li>
              <li>
                <span class="feature-icon"><i class="bi bi-server"></i></span>
                <div class="feature-text">
                  <strong>Backend:</strong> ASP.NET Core Web API
                </div>
              </li>
              <li>
                <span class="feature-icon"><i class="bi bi-database"></i></span>
                <div class="feature-text">
                  <strong>Database:</strong> SQL Server
                </div>
              </li>
              <li>
                <span class="feature-icon"><i class="bi bi-shield-lock"></i></span>
                <div class="feature-text">
                  <strong>Authentication:</strong> JWT-based authentication
                </div>
              </li>
            </ul>
          </div>
          
          <div class="info-card project-goals">
            <div class="card-header">
              <i class="bi bi-lightbulb"></i>
              <h3>Project Goals</h3>
            </div>
            <ul class="feature-list">
              <li>
                <span class="feature-icon"><i class="bi bi-person-check"></i></span>
                <div class="feature-text">
                  Provide a user-friendly interface for account management
                </div>
              </li>
              <li>
                <span class="feature-icon"><i class="bi bi-shield-check"></i></span>
                <div class="feature-text">
                  Ensure secure and reliable transaction processing
                </div>
              </li>
              <li>
                <span class="feature-icon"><i class="bi bi-graph-up"></i></span>
                <div class="feature-text">
                  Maintain accurate customer records and account balances
                </div>
              </li>
              <li>
                <span class="feature-icon"><i class="bi bi-arrows-angle-expand"></i></span>
                <div class="feature-text">
                  Deliver a scalable solution for financial management
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <footer class="about-footer">
        <div class="footer-content">
          <div class="developer-info">
            <span class="developer-logo"><i class="bi bi-person-circle"></i></span>
            <p>Developed by Mpho Ndlela for Traq Software</p>
          </div>
          <p class="copyright">© 2025 Account Management System</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .about-container {
      font-family: 'Poppins', sans-serif;
      color: #333;
      background-color: #f8f9fa;
      position: relative;
    }
    
    .hero-section {
      height: 300px;
      background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
      position: relative;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 0 0 30px 30px;
      margin-bottom: 40px;
    }
    
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.1);
      opacity: 0.1;
    }
    
    .hero-content {
      position: relative;
      z-index: 2;
      text-align: center;
      color: white;
    }
    
    .hero-title {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 20px;
      text-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }
    
    .hero-badge {
      width: 100px;
      height: 100px;
      background-color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      box-shadow: 0 15px 35px rgba(0,0,0,0.1);
    }
    
    .hero-badge i {
      font-size: 3rem;
      color: #6a11cb;
    }
    
    .content-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    .description-section {
      text-align: center;
      margin-bottom: 60px;
    }
    
    .lead-text {
      font-size: 1.5rem;
      font-weight: 300;
      color: #555;
      max-width: 800px;
      margin: 0 auto 40px;
      line-height: 1.6;
    }
    
    .divider {
      position: relative;
      height: 20px;
      text-align: center;
    }
    
    .divider:before {
      content: '';
      position: absolute;
      top: 50%;
      left: 20%;
      right: 20%;
      height: 1px;
      background: #ddd;
      z-index: 1;
    }
    
    .divider-icon {
      background: #f8f9fa;
      padding: 0 20px;
      position: relative;
      z-index: 2;
    }
    
    .divider-icon i {
      color: #6a11cb;
      font-size: 1.5rem;
    }
    
    .info-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      margin-bottom: 60px;
    }
    
    .info-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.05);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .info-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 40px rgba(0,0,0,0.1);
    }
    
    .tech-stack {
      border-top: 5px solid #2575fc;
    }
    
    .project-goals {
      border-top: 5px solid #6a11cb;
    }
    
    .card-header {
      padding: 25px 30px 15px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .card-header i {
      font-size: 2rem;
      margin-right: 15px;
      color: #6a11cb;
    }
    
    .card-header h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
      color: #333;
    }
    
    .feature-list {
      list-style: none;
      padding: 20px 30px;
      margin: 0;
    }
    
    .feature-list li {
      display: flex;
      align-items: center;
      padding: 15px 0;
      border-bottom: 1px dashed #f0f0f0;
    }
    
    .feature-list li:last-child {
      border-bottom: none;
    }
    
    .feature-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
      flex-shrink: 0;
    }
    
    .feature-text {
      flex-grow: 1;
      font-size: 1rem;
      line-height: 1.4;
    }
    
    .about-footer {
      background: #333;
      color: white;
      padding: 40px 0;
      border-radius: 30px 30px 0 0;
    }
    
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      text-align: center;
    }
    
    .developer-info {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
    }
    
    .developer-logo {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: white;
      color: #333;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
    }
    
    .developer-logo i {
      font-size: 1.5rem;
    }
    
    .copyright {
      font-size: 0.9rem;
      opacity: 0.7;
    }
    
    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }
      
      .lead-text {
        font-size: 1.2rem;
      }
      
      .hero-section {
        height: 250px;
      }
      
      .hero-badge {
        width: 80px;
        height: 80px;
      }
      
      .hero-badge i {
        font-size: 2.5rem;
      }
      
      .divider:before {
        left: 10%;
        right: 10%;
      }
    }
  `]
})
export class AboutComponent {}