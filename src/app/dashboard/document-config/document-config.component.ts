import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomSelectComponent, SelectOption } from '../../shared/components/custom-select/custom-select.component';
import { CustomMultiSelectComponent } from '../../shared/components/custom-multi-select/custom-multi-select.component';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import { SidebarComponent, MenuItem } from '../../shared/components/sidebar/sidebar.component';
import { StateBadgeComponent } from '../../shared/components/state-badge/state-badge.component';
import { MenuService } from '../../shared/services/menu.service';
import { AuthService } from '../../shared/services/auth.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-document-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomSelectComponent, CustomMultiSelectComponent, CustomButtonComponent, SidebarComponent, StateBadgeComponent, ConfirmDialogComponent],
  templateUrl: './document-config.component.html',
  styleUrls: ['./document-config.component.scss']
})
export class DocumentConfigComponent implements OnInit {
  configForm!: FormGroup;
  showAlert = true;
  sidebarOpen = window.innerWidth >= 768;
  selectedState = 'Andaman & Nicobar Island';
  menuItems: MenuItem[] = [];
  
  // Confirm dialog state
  confirm = {
    open: false,
    title: 'Please Confirm',
    message: '',
    variant: 'info' as 'info' | 'warning' | 'danger',
    onConfirm: () => {},
    onCancel: () => {}
  };

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

  constructor(private fb: FormBuilder, private menuService: MenuService, private authService: AuthService) {}

  ngOnInit(): void {
    this.menuItems = this.menuService.getMenuItems('/document-config');
    this.configForm = this.fb.group({
      transactionPurpose: ['', Validators.required],
      vehicleType: [''],
      documentType: ['', Validators.required],
      ownershipType: [''],
      authMode: [''],
      subDocumentType: [[], Validators.required],
      acceptTerms: [false]
    });
    
    // Set sidebar appropriately on initial load
    this.onResize();
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
    
    // Auto-close sidebar on mobile when a route is clicked
    if (window.innerWidth < 768 && item.route) {
      this.closeSidebar();
    }
    
    // Handle navigation or actions based on item
    console.log('Menu item clicked:', item.label);
  }
  
  @HostListener('window:resize')
  onResize(): void {
    // Auto-expand sidebar on larger viewports, close on mobile
    if (window.innerWidth >= 768) {
      this.sidebarOpen = true;
    } else {
      this.sidebarOpen = false;
    }
  }
  
  onLogoutRequest(): void {
    this.openConfirm({
      title: 'Confirm Logout',
      message: 'Are you sure you want to logout?',
      variant: 'warning',
      onConfirm: () => this.performLogout()
    });
  }
  
  private performLogout(): void {
    this.authService.logout();
  }
  
  private openConfirm(opts: { title?: string; message: string; variant?: 'info' | 'warning' | 'danger'; onConfirm: () => void; onCancel?: () => void }): void {
    this.confirm.title = opts.title ?? 'Please Confirm';
    this.confirm.message = opts.message;
    this.confirm.variant = opts.variant ?? 'info';
    this.confirm.onConfirm = opts.onConfirm;
    this.confirm.onCancel = opts.onCancel ?? (() => {});
    this.confirm.open = true;
  }
  
  onConfirmDialog(): void {
    this.confirm.open = false;
    try {
      this.confirm.onConfirm();
    } finally {
      this.confirm.onConfirm = () => {};
    }
  }
  
  onCancelDialog(): void {
    this.confirm.open = false;
    try {
      this.confirm.onCancel();
    } finally {
      this.confirm.onCancel = () => {};
    }
  }
}
