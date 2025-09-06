import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomSelectComponent, SelectOption } from '../../shared/components/custom-select/custom-select.component';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import { SidebarComponent, MenuItem } from '../../shared/components/sidebar/sidebar.component';
import { StateBadgeComponent } from '../../shared/components/state-badge/state-badge.component';

@Component({
  selector: 'app-document-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomSelectComponent, CustomButtonComponent, SidebarComponent, StateBadgeComponent],
  templateUrl: './document-config.component.html',
  styleUrls: ['./document-config.component.scss']
})
export class DocumentConfigComponent implements OnInit {
  configForm!: FormGroup;
  showAlert = true;
  sidebarOpen = true;
  selectedState = 'Andaman & Nicobar Island';
  
  menuItems: MenuItem[] = [
    {
      icon: 'pi pi-folder',
      label: 'Document Configuration',
      expanded: true,
      children: [
        {
          icon: 'pi pi-car',
          label: 'Vahan Related',
          route: '/document-config',
          active: true
        },
        {
          icon: 'pi pi-file-edit',
          label: 'Permit Related',
          expanded: false,
          children: [
            { icon: 'pi pi-file', label: 'Permit', route: '/permit-config' },
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
    { value: 'new_registration', label: 'New Registration' },
    { value: 'renewal', label: 'Renewal' },
    { value: 'transfer', label: 'Transfer of Ownership' },
    { value: 'duplicate', label: 'Duplicate Document' }
  ];

  vehicleTypes: SelectOption[] = [
    { value: 'two_wheeler', label: 'Two Wheeler' },
    { value: 'four_wheeler', label: 'Four Wheeler' },
    { value: 'commercial', label: 'Commercial Vehicle' },
    { value: 'transport', label: 'Transport Vehicle' }
  ];

  documentTypes: SelectOption[] = [
    { value: 'rc', label: 'Registration Certificate (RC)' },
    { value: 'dl', label: 'Driving License (DL)' },
    { value: 'insurance', label: 'Insurance Certificate' },
    { value: 'puc', label: 'Pollution Under Control (PUC)' },
    { value: 'permit', label: 'Permit Document' }
  ];

  ownershipTypes: SelectOption[] = [
    { value: 'individual', label: 'Individual' },
    { value: 'company', label: 'Company' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'government', label: 'Government' }
  ];

  authModes: SelectOption[] = [
    { value: 'aadhaar', label: 'Aadhaar Authentication' },
    { value: 'otp', label: 'OTP Verification' },
    { value: 'biometric', label: 'Biometric Authentication' },
    { value: 'manual', label: 'Manual Verification' }
  ];

  subDocumentTypes: SelectOption[] = [
    { value: 'original', label: 'Original Document' },
    { value: 'copy', label: 'Certified Copy' },
    { value: 'digital', label: 'Digital Copy' },
    { value: 'scanned', label: 'Scanned Document' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.configForm = this.fb.group({
      transactionPurpose: ['', Validators.required],
      vehicleType: [''],
      documentType: ['', Validators.required],
      ownershipType: [''],
      authMode: [''],
      subDocumentType: ['', Validators.required],
      acceptTerms: [false]
    });
  }

  onSubmit(): void {
    if (this.configForm.valid) {
      console.log('Form submitted:', this.configForm.value);
    } else {
      this.configForm.markAllAsTouched();
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
    // Update active state
    this.menuItems.forEach(menuItem => menuItem.active = false);
    item.active = true;
    
    // Handle navigation or actions based on item
    console.log('Menu item clicked:', item.label);
  }
}