import { Component, Input, forwardRef, HostListener, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: any;
}

@Component({
  selector: 'custom-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="select-wrapper" [class.open]="isOpen" [class.disabled]="disabled">
      <div class="select-trigger" (click)="toggle()" [attr.tabindex]="disabled ? -1 : 0" (keydown)="onKeyDown($event)">
        <span class="select-value">{{ selectedLabel || placeholder }}</span>
        <i class="pi pi-chevron-down select-arrow"></i>
      </div>
      <div class="select-dropdown" *ngIf="isOpen">
        <div class="search-input" *ngIf="searchable">
          <input 
            type="text" 
            [(ngModel)]="searchTerm"
            (input)="onSearch()"
            placeholder="Type to search..."
            class="search-field"
            (click)="$event.stopPropagation()">
          <i class="pi pi-search search-icon"></i>
        </div>
        <div 
          *ngFor="let option of filteredOptions" 
          class="select-option"
          [class.selected]="option.value === value"
          (click)="selectOption(option)"
        >
          {{ option.label }}
        </div>
        <div class="no-options" *ngIf="filteredOptions.length === 0">
          {{ searchTerm ? 'No matching options found' : 'No options available' }}
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./custom-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true
    }
  ]
})
export class CustomSelectComponent implements ControlValueAccessor, OnInit {
  @Input() options: SelectOption[] = [];
  @Input() placeholder: string = 'Select an option';
  @Input() searchable: boolean = false;

  value: any = null;
  disabled: boolean = false;
  isOpen: boolean = false;
  searchTerm: string = '';
  filteredOptions: SelectOption[] = [];

  private onChange = (value: any) => {};
  private onTouched = () => {};

  ngOnInit(): void {
    this.filteredOptions = [...this.options];
  }

  get selectedLabel(): string {
    const selected = this.options.find(option => option.value === this.value);
    return selected ? selected.label : '';
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredOptions = [...this.options];
    } else {
      this.filteredOptions = this.options.filter(option =>
        option.label.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  toggle(): void {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.searchTerm = '';
        this.filteredOptions = [...this.options];
        this.onTouched();
        setTimeout(() => this.adjustDropdownPosition(), 0);
      }
    }
  }

  private adjustDropdownPosition(): void {
    const wrapper = document.querySelector('.select-wrapper.open');
    if (wrapper) {
      const rect = wrapper.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const dropdownHeight = 200; // max-height of dropdown
      
      if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
        wrapper.classList.add('dropdown-up');
      } else {
        wrapper.classList.remove('dropdown-up');
      }
    }
  }

  selectOption(option: SelectOption): void {
    this.value = option.value;
    this.onChange(this.value);
    this.isOpen = false;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggle();
    } else if (event.key === 'Escape') {
      this.isOpen = false;
    }
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.select-wrapper')) {
      this.isOpen = false;
    }
  }
}