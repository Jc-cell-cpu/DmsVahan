import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="gov-header">
      <div class="header-container">
        <div class="header-left">
          <div class="emblem-section">
            <div class="emblem-placeholder">
              <img src="logo_e-vahan.png" alt="e-VAHAN Logo">
            </div>
          </div>
        </div>
        
        <div class="header-center">
          <img src="heading.png" alt="Ministry of Road Transport & Highways - Government of India" class="heading-image">
        </div>
        
        <div class="header-right">
          <!-- Placeholder for future actions -->
        </div>
      </div>
    </header>
  `,
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent {}