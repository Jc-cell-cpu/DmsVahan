import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'custom-password',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="password-wrapper">
      <input
        [type]="showPassword ? 'text' : inputType"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onBlur()"
        (focus)="onFocus($event)"
        [class]="inputClass"
        [id]="inputId"
        [autocomplete]="autocomplete"
        [name]="name"
        [attr.data-lpignore]="dataLpignore"
        [attr.data-form-type]="dataFormType"
        readonly
        onfocus="this.removeAttribute('readonly')"
      />
      <button
        type="button"
        class="password-toggle"
        (click)="togglePassword()"
        [attr.aria-label]="showPassword ? 'Hide password' : 'Show password'"
      >
        <i [class]="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
      </button>
    </div>
  `,
  styleUrls: ['./custom-password.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomPasswordComponent),
      multi: true
    }
  ]
})
export class CustomPasswordComponent implements ControlValueAccessor {
  @Input() placeholder: string = '';
  @Input() inputClass: string = '';
  @Input() inputId: string = '';
  @Input() autocomplete: string = 'off';
  @Input() name: string = '';
  @Input() dataLpignore: boolean = false;
  @Input() dataFormType: string = 'other';

  value: string = '';
  disabled: boolean = false;
  showPassword: boolean = false;
  inputType: string = 'text'; // Start as text to avoid Chrome detection

  private onChange = (value: string) => {};
  private onTouched = () => {};

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  onFocus(event: Event): void {
    const target = event.target as HTMLInputElement;
    target.removeAttribute('readonly');
    // Change to password type only after focus to avoid Chrome detection
    if (this.inputType === 'text' && !this.showPassword) {
      setTimeout(() => {
        this.inputType = 'password';
      }, 50);
    }
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}