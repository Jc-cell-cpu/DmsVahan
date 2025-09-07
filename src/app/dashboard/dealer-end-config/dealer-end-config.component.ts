import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomSelectComponent, SelectOption } from '../../shared/components/custom-select/custom-select.component';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import { SidebarComponent, MenuItem } from '../../shared/components/sidebar/sidebar.component';
import { StateBadgeComponent } from '../../shared/components/state-badge/state-badge.component';
import { MenuService } from '../../shared/services/menu.service';

@Component({
  selector: 'app-dealer-end-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomSelectComponent, CustomButtonComponent, SidebarComponent, StateBadgeComponent],
  templateUrl: './dealer-end-config.component.html',
  styleUrls: ['./dealer-end-config.component.scss']
})
export class DealerEndConfigComponent implements OnInit {
  configForm!: FormGroup;
  showAlert = true;
  sidebarOpen = true;
  selectedState = 'Andaman & Nicobar Island';
  menuItems: MenuItem[] = [];

  transactionPurposes: SelectOption[] = [
    { value: 'dealer_registration', label: 'Dealer Registration' },
    { value: 'dealer_renewal', label: 'Dealer License Renewal' },
    { value: 'dealer_modification', label: 'Dealer Details Modification' },
    { value: 'dealer_transfer', label: 'Dealer License Transfer' },
    { value: 'dealer_cancellation', label: 'Dealer License Cancellation' }
  ];

  vehicleTypes: SelectOption[] = [
    { value: 'two_wheeler', label: 'Two Wheeler' },
    { value: 'three_wheeler', label: 'Three Wheeler' },
    { value: 'four_wheeler', label: 'Four Wheeler' },
    { value: 'commercial', label: 'Commercial Vehicle' },
    { value: 'heavy_vehicle', label: 'Heavy Vehicle' },
    { value: 'all_vehicles', label: 'All Vehicle Types' }
  ];

  documentTypes: SelectOption[] = [
    { value: 'dealer_license', label: 'Dealer License Certificate' },
    { value: 'showroom_certificate', label: 'Showroom Registration Certificate' },
    { value: 'service_center', label: 'Service Center Certificate' },
    { value: 'trade_certificate', label: 'Trade Certificate' },
    { value: 'gst_registration', label: 'GST Registration Certificate' },
    { value: 'pan_card', label: 'PAN Card' },
    { value: 'bank_guarantee', label: 'Bank Guarantee' }
  ];

  subDocumentTypes: SelectOption[] = [
    { value: 'original', label: 'Original Document' },
    { value: 'certified_copy', label: 'Certified Copy' },
    { value: 'self_attested', label: 'Self Attested Copy' },
    { value: 'notarized', label: 'Notarized Copy' },
    { value: 'digital_copy', label: 'Digital Copy' }
  ];

  constructor(private fb: FormBuilder, private menuService: MenuService) {}

  ngOnInit(): void {
    this.menuItems = this.menuService.getMenuItems('/dealer-end-config');
    this.initializeForm();
  }

  initializeForm(): void {
    this.configForm = this.fb.group({
      transactionPurpose: ['', Validators.required],
      vehicleType: [''],
      documentType: ['', Validators.required],
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
}