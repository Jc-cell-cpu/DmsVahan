import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SidebarComponent, MenuItem } from '../../shared/components/sidebar/sidebar.component';
import { StateBadgeComponent } from '../../shared/components/state-badge/state-badge.component';
import { CustomInputComponent } from '../../shared/components/custom-input/custom-input.component';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import { MenuService } from '../../shared/services/menu.service';
import { AuthService } from '../../shared/services/auth.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

interface DocumentRecord {
  serial: number;
  name: string;
  statuses: { verified: boolean; approved: boolean; received: boolean };
  uploadDate: Date;
  verifyDate?: Date | null;
  approveDate?: Date | null;
  receiveDate?: Date | null;
}

@Component({
  selector: 'app-document-view-by-application',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent, StateBadgeComponent, CustomInputComponent, CustomButtonComponent, ConfirmDialogComponent],
  templateUrl: './document-view-by-application.component.html',
  styleUrls: ['./document-view-by-application.component.scss']
})
export class DocumentViewByApplicationComponent implements OnInit {
  sidebarOpen = window.innerWidth >= 768;
  selectedState = 'Andaman & Nicobar Island';
  menuItems: MenuItem[] = [];

  searchForm!: FormGroup;
  appNo?: string;
  results: DocumentRecord[] = [];
  searched = false;
  
  // Confirm dialog state
  confirm = {
    open: false,
    title: 'Please Confirm',
    message: '',
    variant: 'info' as 'info' | 'warning' | 'danger',
    onConfirm: () => {},
    onCancel: () => {}
  };

  constructor(private fb: FormBuilder, private menuService: MenuService, private authService: AuthService) {}

  ngOnInit(): void {
    this.menuItems = this.menuService.getMenuItems('/document-view-by-application');
    this.searchForm = this.fb.group({
      applicationNo: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{6,}$/i)]]
    });
    
    // Set sidebar appropriately on initial load
    this.onResize();
  }

  toggleSidebar(): void { this.sidebarOpen = !this.sidebarOpen; }
  closeSidebar(): void { this.sidebarOpen = false; }
  
  onMenuItemClick(item: MenuItem): void {
    this.menuItems.forEach(m => m.active = false);
    item.active = true;
    
    // Auto-close sidebar on mobile when a route is clicked
    if (window.innerWidth < 768 && item.route) {
      this.closeSidebar();
    }
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

  onSearch(): void {
    this.searched = true;
    if (this.searchForm.invalid) return;

    this.appNo = (this.searchForm.value.applicationNo || '').toUpperCase();

    // Mock dataset: in real app, replace with API call returning documents for this.appNo
    const baseNow = new Date('2023-08-11T10:51:21');
    this.results = [
      {
        serial: 1,
        name: `${this.appNo}-1 Photographs Of Vehicle With Consignment Front Rear Left And Right - Aadhaar Card - IMG20230707020227397.jpg`,
        statuses: { verified: false, approved: false, received: false },
        uploadDate: baseNow
      },
      {
        serial: 2,
        name: `${this.appNo}-2 Registration Certificate Scan - IMG20230707020227398.pdf`,
        statuses: { verified: true, approved: false, received: false },
        uploadDate: new Date(baseNow.getTime() + 60_000),
        verifyDate: new Date(baseNow.getTime() + 120_000)
      },
      {
        serial: 3,
        name: `${this.appNo}-3 Insurance Policy - IMG20230707020227410.pdf`,
        statuses: { verified: true, approved: true, received: true },
        uploadDate: new Date(baseNow.getTime() + 180_000),
        verifyDate: new Date(baseNow.getTime() + 240_000),
        approveDate: new Date(baseNow.getTime() + 300_000),
        receiveDate: new Date(baseNow.getTime() + 360_000)
      }
    ];
  }
}