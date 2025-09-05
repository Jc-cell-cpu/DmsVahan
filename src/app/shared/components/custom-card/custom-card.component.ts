import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'custom-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <!-- <div class="card-header" *ngIf="hasHeaderContent">
        <ng-content select="[slot=header]"></ng-content>
      </div> -->
      <div class="card-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./custom-card.component.scss']
})
export class CustomCardComponent {
  hasHeaderContent = true;
}