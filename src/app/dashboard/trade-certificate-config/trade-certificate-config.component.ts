import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomSelectComponent, SelectOption } from '../../shared/components/custom-select/custom-select.component';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import { SidebarComponent, MenuItem } from '../../shared/components/sidebar/sidebar.component';
import { StateBadgeComponent } from '../../shared/components/state-badge/state-badge.component';
import { MenuService } from '../../shared/services/menu.service';

@Component({
  selector: 'app-trade-certificate-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomSelectComponent, CustomButtonComponent, SidebarComponent, StateBadgeComponent],
  templateUrl: './trade-certificate-config.component.html',
  styleUrls: ['./trade-certificate-config.component.scss']
})
export class TradeCertificateConfigComponent implements OnInit {
  configForm!: FormGroup;
  showAlert = true;
  sidebarOpen = true;
  selectedState = 'Andaman & Nicobar Island';
  menuItems: MenuItem[] = [];

  transactionPurposes: SelectOption[] = [
    { value: 'new_certificate', label: 'New Trade Certificate' },
    { value: 'renewal', label: 'Certificate Renewal' },
    { value: 'modification', label: 'Certificate Modification' },
    { value: 'duplicate', label: 'Duplicate Certificate' }
  ];

  documentTypes: SelectOption[] = [
    { value: 'trade_license', label: 'Trade License' },
    { value: 'shop_establishment', label: 'Shop & Establishment Certificate' },
    { value: 'gst_certificate', label: 'GST Registration Certificate' },
    { value: 'fire_safety', label: 'Fire Safety Certificate' },
    { value: 'pollution_clearance', label: 'Pollution Clearance Certificate' }
  ];

  applicantTypes: SelectOption[] = [
    { value: 'individual', label: 'Individual' },
    { value: 'proprietorship', label: 'Proprietorship' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'company', label: 'Private Limited Company' },
    { value: 'public_company', label: 'Public Limited Company' },
    { value: 'trust', label: 'Trust/NGO' }
  ];

  appTypes: SelectOption[] = [
    { value: 'online', label: 'Online Application' },
    { value: 'offline', label: 'Offline Application' },
    { value: 'mobile', label: 'Mobile Application' }
  ];

  ownerTypes: SelectOption[] = [
    { value: 'sole_owner', label: 'Sole Owner' },
    { value: 'joint_owner', label: 'Joint Owner' },
    { value: 'authorized_signatory', label: 'Authorized Signatory' },
    { value: 'power_of_attorney', label: 'Power of Attorney Holder' }
  ];

  constructor(private fb: FormBuilder, private menuService: MenuService) {}

  ngOnInit(): void {
    this.menuItems = this.menuService.getMenuItems('/trade-certificate-config');
    this.initializeForm();
  }

  initializeForm(): void {
    this.configForm = this.fb.group({
      transactionPurpose: ['', Validators.required],
      documentType: ['', Validators.required],
      applicantType: ['', Validators.required],
      appType: [''],
      ownerType: [''],
      documentDescription: [''],
      acceptTerms: [false]
    });

    // Update document description when document type changes
    this.configForm.get('documentType')?.valueChanges.subscribe(value => {
      this.updateDocumentDescription(value);
    });
  }

  updateDocumentDescription(documentType: string): void {
    const descriptions: { [key: string]: string } = {
      'trade_license': 'A trade license is a document/certificate that gives permission to the applicant (person seeking to open a business) to commence a particular trade or business in a particular area/location.',
      'shop_establishment': 'Shop and Establishment Act is a state legislation that regulates the working conditions of workers in shops, commercial establishments, restaurants, hotels, theatres, and other establishments.',
      'gst_certificate': 'GST Registration Certificate is issued to businesses that are registered under the Goods and Services Tax (GST) system in India.',
      'fire_safety': 'Fire Safety Certificate is issued by the Fire Department to ensure that the building/establishment complies with fire safety norms and regulations.',
      'pollution_clearance': 'Pollution Clearance Certificate is issued by the State Pollution Control Board to ensure that the establishment complies with environmental norms.'
    };
    
    this.configForm.patchValue({
      documentDescription: descriptions[documentType] || ''
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
}