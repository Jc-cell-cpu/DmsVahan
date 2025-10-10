import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cdk-overlay" *ngIf="open">
      <div class="dialog" role="dialog" aria-modal="true" [attr.aria-labelledby]="title">
        <div class="dialog-header" [class.warn]="variant==='warning'" [class.danger]="variant==='danger'">
          <i class="pi" [ngClass]="iconClass"></i>
          <h3 class="dialog-title">{{ title }}</h3>
        </div>
        <div class="dialog-body">
          <p class="dialog-message">{{ message }}</p>
        </div>
        <div class="dialog-actions">
          <button type="button" class="btn ghost" (click)="onCancel()">{{ cancelText }}</button>
          <button type="button" class="btn primary" (click)="onConfirm()">{{ confirmText }}</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  @Input() open = false;
  @Input() title = 'Please Confirm';
  @Input() message = 'Are you sure you want to proceed?';
  @Input() confirmText = 'OK';
  @Input() cancelText = 'Cancel';
  @Input() variant: 'info' | 'warning' | 'danger' = 'info';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  get iconClass(): string {
    switch (this.variant) {
      case 'warning':
        return 'pi-exclamation-triangle';
      case 'danger':
        return 'pi-times-circle';
      default:
        return 'pi-question-circle';
    }
  }

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}