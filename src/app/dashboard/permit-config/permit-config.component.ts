import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomSelectComponent, SelectOption } from '../../shared/components/custom-select/custom-select.component';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import { SidebarComponent, MenuItem } from '../../shared/components/sidebar/sidebar.component';
import { StateBadgeComponent } from '../../shared/components/state-badge/state-badge.component';

@Component({
  selector: 'app-permit-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomSelectComponent, CustomButtonComponent, SidebarComponent, StateBadgeComponent],
  templateUrl: './permit-config.component.html',
  styleUrls: ['./permit-config.component.scss']
})
export class PermitConfigComponent implements OnInit {
  configForm!: FormGroup;
  showAlert = true;
  sidebarOpen = true;
  selectedState = 'Andaman & Nicobar Island';
  permitDropdownOpen = false;
  
  menuItems: MenuItem[] = [
    {
      icon: 'pi pi-folder',
      label: 'Document Configuration',
      expanded: true,
      children: [
        {
          icon: 'pi pi-car',
          label: 'Vahan Related',
          route: '/document-config'
        },
        {
          icon: 'pi pi-file-edit',
          label: 'Permit Related',
          expanded: true,
          active: true,
          children: [
            { icon: 'pi pi-file', label: 'Permit', route: '/permit-config', active: true },
            { icon: 'pi pi-cog', label: 'Permit Category Configuration' }
          ]
        },
        {
          icon: 'pi pi-briefcase',
          label: 'Trade Certificate Related'
        },
        {
          icon: 'pi pi-shop',
          label: 'Dealer End Related'
        }
      ]
    },
    {
      icon: 'pi pi-plus',
      label: 'Addition of Document Category'
    },
    {
      icon: 'pi pi-plus-circle',
      label: 'Addition of Document Sub-Category'
    },
    {
      icon: 'pi pi-link',
      label: 'Addition of Category to Sub-Category'
    },
    {
      icon: 'pi pi-eye',
      label: 'View Assign Document'
    },
    {
      icon: 'pi pi-wrench',
      label: 'DMS Utility',
      children: [
        { icon: 'pi pi-search', label: 'Document View By Application No.' }
      ]
    },
    {
      icon: 'pi pi-sign-out',
      label: 'Logout'
    }
  ];

  transactionPurposes: SelectOption[] = [
    { value: 'new_permit', label: 'New Permit' },
    { value: 'renewal', label: 'Permit Renewal' },
    { value: 'duplicate', label: 'Duplicate Permit' }
  ];

  vehicleTypes: SelectOption[] = [
    { value: 'goods', label: 'Goods Vehicle' },
    { value: 'passenger', label: 'Passenger Vehicle' },
    { value: 'contract_carriage', label: 'Contract Carriage' }
  ];

  transportTypes: SelectOption[] = [
    { value: 'public', label: 'Public Transport' },
    { value: 'private', label: 'Private Transport' },
    { value: 'commercial', label: 'Commercial Transport' }
  ];

  documentTypes: SelectOption[] = [
    { value: 'permit_application', label: 'Permit Application Form' },
    { value: 'fitness_certificate', label: 'Fitness Certificate' },
    { value: 'insurance_policy', label: 'Insurance Policy' },
    { value: 'route_permit', label: 'Route Permit' }
  ];

  permits: SelectOption[] = [
    { value: 'stage_carriage', label: 'Stage Carriage Permit' },
    { value: 'contract_carriage', label: 'Contract Carriage Permit' },
    { value: 'goods_carriage', label: 'Goods Carriage Permit' },
    { value: 'tourist_permit', label: 'Tourist Permit' },
    { value: 'temporary_permit', label: 'Temporary Permit' }
  ];

  registrationTypes: SelectOption[] = [
    { value: 'fresh', label: 'Fresh Registration' },
    { value: 'transfer', label: 'Transfer of Registration' },
    { value: 'renewal', label: 'Registration Renewal' }
  ];

  subDocumentTypes: SelectOption[] = [
    { value: 'permit_sub_1', label: 'Permit Application Sub-Type 1' },
    { value: 'permit_sub_2', label: 'Permit Application Sub-Type 2' },
    { value: 'fitness_sub_1', label: 'Fitness Certificate Sub-Type 1' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.configForm = this.fb.group({
      transactionPurpose: ['', Validators.required],
      vehicleType: [''],
      transportType: ['', Validators.required],
      documentType: ['', Validators.required],
      permit: [[]],
      registrationType: [''],
      subDocumentType: ['', Validators.required],
      acceptTerms: [false]
    });
  }

  onSubmit(): void {
    if (this.configForm.valid) {
      console.log('Form submitted:', this.configForm.value);
    }
  }

  onCancel(): void {
    this.configForm.reset();
  }

  dismissAlert(): void {
    this.showAlert = false;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }
  
  onMenuItemClick(item: MenuItem): void {
    this.menuItems.forEach(menuItem => menuItem.active = false);
    item.active = true;
    console.log('Menu item clicked:', item.label);
  }

  togglePermitDropdown(): void {
    this.permitDropdownOpen = !this.permitDropdownOpen;
  }

  onPermitChange(event: any, permitValue: string): void {
    const currentPermits = this.configForm.get('permit')?.value || [];
    if (event.target.checked) {
      this.configForm.patchValue({
        permit: [...currentPermits, permitValue]
      });
    } else {
      this.configForm.patchValue({
        permit: currentPermits.filter((p: string) => p !== permitValue)
      });
    }
  }

  isPermitSelected(permitValue: string): boolean {
    const currentPermits = this.configForm.get('permit')?.value || [];
    return currentPermits.includes(permitValue);
  }

  getSelectedPermits(): string[] {
    const selectedValues = this.configForm.get('permit')?.value || [];
    return selectedValues.map((value: string) => {
      const permit = this.permits.find(p => p.value === value);
      return permit ? permit.label : value;
    });
  }

  removePermit(permitLabel: string, event: Event): void {
    event.stopPropagation();
    const permit = this.permits.find(p => p.label === permitLabel);
    if (permit) {
      const currentPermits = this.configForm.get('permit')?.value || [];
      this.configForm.patchValue({
        permit: currentPermits.filter((p: string) => p !== permit.value)
      });
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.multi-select-container')) {
      this.permitDropdownOpen = false;
    }
  }


}