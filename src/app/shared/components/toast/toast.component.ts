import { Component, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast" [class.show]="show" [class.success]="type === 'success'" [class.error]="type === 'error'">
      <div class="toast-content">
        <i [class]="iconClass"></i>
        <span class="toast-message">{{ message }}</span>
        <button class="toast-close" (click)="close()">×</button>
      </div>
    </div>
  `,
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnChanges, OnDestroy {
  @Input() show = false;
  @Input() message = '';
  @Input() type: 'success' | 'error' = 'success';
  @Input() duration = 4000;
  @Output() closed = new EventEmitter<void>();

  private timer?: number;

  get iconClass(): string {
    return this.type === 'success' ? 'pi pi-check-circle' : 'pi pi-exclamation-triangle';
  }

  ngOnChanges(): void {
    if (this.show) {
      this.startTimer();
    } else {
      this.clearTimer();
    }
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  private startTimer(): void {
    this.clearTimer();
    this.timer = window.setTimeout(() => {
      this.close();
    }, this.duration);
  }

  private clearTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }

  close(): void {
    this.show = false;
    this.clearTimer();
    this.closed.emit();
  }
}