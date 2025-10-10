import { Component, Input, forwardRef, HostListener, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: any;
}

@Component({
  selector: 'custom-multi-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="multi-select-wrapper" [class.open]="isOpen" [class.disabled]="disabled">
      <div class="multi-select-trigger" (click)="toggle()" [attr.tabindex]="disabled ? -1 : 0">
        <div class="selected-values" *ngIf="selectedOptions.length > 0">
          <span 
            *ngFor="let option of selectedOptions" 
            class="selected-tag">
            {{ option.label }}
            <i class="pi pi-times remove-tag" (click)="removeOption(option, $event)"></i>
          </span>
        </div>
        <span class="placeholder" *ngIf="selectedOptions.length === 0">{{ placeholder }}</span>
        <i class="pi pi-chevron-down select-arrow"></i>
      </div>
      
      <div class="multi-select-dropdown" *ngIf="isOpen">
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
          class="multi-select-option"
          [class.selected]="isSelected(option)"
          (click)="toggleOption(option)">
          <input 
            type="checkbox" 
            [checked]="isSelected(option)"
            (click)="$event.stopPropagation()"
            (change)="onCheckboxChange(option, $event)"
            class="option-checkbox">
          <span class="option-label">{{ option.label }}</span>
        </div>
        
        <div class="no-options" *ngIf="filteredOptions.length === 0">
          {{ searchTerm ? 'No matching options found' : 'No options available' }}
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./custom-multi-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomMultiSelectComponent),
      multi: true
    }
  ]
})
export class CustomMultiSelectComponent implements ControlValueAccessor, OnInit {
  @Input() options: SelectOption[] = [];
  @Input() placeholder: string = 'Select options';
  @Input() searchable: boolean = true;

  value: any[] = [];
  disabled: boolean = false;
  isOpen: boolean = false;
  searchTerm: string = '';
  filteredOptions: SelectOption[] = [];

  private onChange = (value: any) => {};
  private onTouched = () => {};

  ngOnInit(): void {
    this.filteredOptions = [...this.options];
  }

  get selectedOptions(): SelectOption[] {
    return this.options.filter(option => 
      Array.isArray(this.value) && this.value.includes(option.value)
    );
  }

  isSelected(option: SelectOption): boolean {
    return Array.isArray(this.value) && this.value.includes(option.value);
  }

  isAllSelected(): boolean {
    return this.filteredOptions.length > 0 && 
           this.filteredOptions.every(option => this.isSelected(option));
  }

  isPartiallySelected(): boolean {
    const selectedCount = this.filteredOptions.filter(option => this.isSelected(option)).length;
    return selectedCount > 0 && selectedCount < this.filteredOptions.length;
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
      }
    }
  }

  toggleOption(option: SelectOption): void {
    const currentValue = Array.isArray(this.value) ? [...this.value] : [];
    const index = currentValue.indexOf(option.value);
    
    if (index > -1) {
      currentValue.splice(index, 1);
    } else {
      currentValue.push(option.value);
    }
    
    this.value = currentValue;
    this.onChange(this.value);
  }
  
  onCheckboxChange(option: SelectOption, event: Event): void {
    event.stopPropagation();
    this.toggleOption(option);
  }

  toggleSelectAll(): void {
    if (this.isAllSelected()) {
      // Deselect all filtered options
      const filteredValues = this.filteredOptions.map(opt => opt.value);
      this.value = (this.value || []).filter(v => !filteredValues.includes(v));
    } else {
      // Select all filtered options
      const filteredValues = this.filteredOptions.map(opt => opt.value);
      const currentValue = Array.isArray(this.value) ? [...this.value] : [];
      
      filteredValues.forEach(val => {
        if (!currentValue.includes(val)) {
          currentValue.push(val);
        }
      });
      
      this.value = currentValue;
    }
    
    this.onChange(this.value);
  }

  removeOption(option: SelectOption, event: Event): void {
    event.stopPropagation();
    const currentValue = Array.isArray(this.value) ? [...this.value] : [];
    const index = currentValue.indexOf(option.value);
    
    if (index > -1) {
      currentValue.splice(index, 1);
      this.value = currentValue;
      this.onChange(this.value);
    }
  }

  writeValue(value: any): void {
    this.value = Array.isArray(value) ? value : [];
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
    if (!target.closest('.multi-select-wrapper')) {
      this.isOpen = false;
    }
  }
}
