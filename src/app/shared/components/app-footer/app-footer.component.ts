import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="gov-footer">
      <div class="footer-container">
        <p class="footer-line1">Powered by National Informatics Centre. All Rights Reserved.</p>
        <p class="footer-line2">Copyright ©2024</p>
      </div>
    </footer>
  `,
  styleUrls: ['./app-footer.component.scss']
})
export class AppFooterComponent {}