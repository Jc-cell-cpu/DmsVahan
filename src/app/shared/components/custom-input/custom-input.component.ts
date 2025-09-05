import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'custom-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <input
      [type]="type"
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
  `,
  styleUrls: ['./custom-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    }
  ]
})
export class CustomInputComponent implements ControlValueAccessor {
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() inputClass: string = '';
  @Input() inputId: string = '';
  @Input() autocomplete: string = 'off';
  @Input() name: string = '';
  @Input() dataLpignore: boolean = false;
  @Input() dataFormType: string = 'other';

  value: string = '';
  disabled: boolean = false;

  private onChange = (value: string) => {};
  private onTouched = () => {};

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