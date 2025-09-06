import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-state-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="state-badge">
      <i class="pi pi-map-marker"></i>
      <span>{{ stateName }}</span>
    </div>
  `,
  styleUrls: ['./state-badge.component.scss']
})
export class StateBadgeComponent {
  @Input() stateName: string = '';
}