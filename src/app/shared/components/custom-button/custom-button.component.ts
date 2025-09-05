import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'custom-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
      [class]="'btn ' + variant + (buttonClass ? ' ' + buttonClass : '')"
      (click)="onClick()"
    >
      <i *ngIf="icon" [class]="icon"></i>
      <span *ngIf="label">{{ label }}</span>
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./custom-button.component.scss']
})
export class CustomButtonComponent {
  @Input() type: string = 'button';
  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() disabled: boolean = false;
  @Input() variant: string = 'primary';
  @Input() buttonClass: string = '';
  @Output() buttonClick = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled) {
      this.buttonClick.emit();
    }
  }
}