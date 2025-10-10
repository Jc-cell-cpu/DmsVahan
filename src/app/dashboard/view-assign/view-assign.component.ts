import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomSelectComponent, SelectOption } from '../../shared/components/custom-select/custom-select.component';
import { SidebarComponent, MenuItem } from '../../shared/components/sidebar/sidebar.component';
import { StateBadgeComponent } from '../../shared/components/state-badge/state-badge.component';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import { MenuService } from '../../shared/services/menu.service';
import { AuthService } from '../../shared/services/auth.service';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

interface DocumentNode {
  id: string;
  label: string;
  mandatory: boolean;
  deletable?: boolean;
  children?: DocumentNode[];
  expanded?: boolean;
}

@Component({
  selector: 'app-view-assign',
  standalone: true,
imports: [CommonModule, ReactiveFormsModule, FormsModule, CustomSelectComponent, SidebarComponent, StateBadgeComponent, CustomButtonComponent, ToastComponent, ConfirmDialogComponent],
  templateUrl: './view-assign.component.html',
  styleUrls: ['./view-assign.component.scss']
})
export class ViewAssignComponent implements OnInit {
  sidebarOpen = window.innerWidth >= 768;
  selectedState = 'Andaman & Nicobar Island';
  menuItems: MenuItem[] = [];

  filterForm!: FormGroup;

  // Dropdown data aligned to app theme
  serviceOptions: SelectOption[] = [
    { value: 'vahan', label: 'Vahan Related' },
    { value: 'permit', label: 'Permit Related' },
    { value: 'trade', label: 'Trade Certificate Related' },
    { value: 'dealer', label: 'Dealer End Related' }
  ];

  purposeOptions: SelectOption[] = [
    { value: 'transfer_ownership', label: 'Transfer of Ownership' },
    { value: 'new_registration', label: 'New Registration' },
    { value: 'renewal', label: 'Renewal' },
    { value: 'duplicate', label: 'Duplicate' }
  ];

  authModes: SelectOption[] = [
    { value: 'aadhaar', label: 'Aadhaar Authentication' },
    { value: 'otp', label: 'OTP Verification' },
    { value: 'biometric', label: 'Biometric' },
    { value: 'manual', label: 'Manual Verification' }
  ];

  serviceReasons: SelectOption[] = [
    { value: '0', label: '0 (Common)' },
    { value: '1', label: '1 (Specific)' },
    { value: '2', label: '2 (Other)' }
  ];

  // Controls which extra fields to show per purpose
  extraFieldsByPurpose: Record<string, Array<'authMode' | 'serviceReason'>> = {
    transfer_ownership: ['authMode', 'serviceReason'],
    renewal: ['authMode']
  };

  // Documents data to render
  documentsTree: DocumentNode[] = [];

  // Toast state
  toast = {
    show: false,
    message: '',
    type: 'success' as 'success' | 'error'
  };

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
    this.menuItems = this.menuService.getMenuItems('/view-assign');

    this.filterForm = this.fb.group({
      service: [''],
      purpose: [''],
      authMode: [''],
      serviceReason: [''],
      markAllMandatory: [false]
    });

    this.filterForm.valueChanges.subscribe(() => {
      const { service, purpose } = this.filterForm.value;
      if (service && purpose) {
        this.loadConfiguredDocuments(service, purpose);
      } else {
        this.documentsTree = [];
      }
    });

    // Set sidebar appropriately on initial load
    this.onResize();
  }

  shouldShow(controlName: 'authMode' | 'serviceReason'): boolean {
    const purpose = this.filterForm.get('purpose')?.value;
    const extras = this.extraFieldsByPurpose[purpose] || [];
    return extras.includes(controlName);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  onMenuItemClick(item: MenuItem): void {
    this.menuItems.forEach(menu => (menu.active = false));
    item.active = true;
    
    // Auto-close sidebar on mobile when a route is clicked
    if (window.innerWidth < 768 && item.route) {
      this.closeSidebar();
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

  // Mock loader - in real app, replace with API call
  private loadConfiguredDocuments(service: string, purpose: string): void {
    // Sample configured documents dataset (expanded for better demo)
    if (service === 'vahan' && purpose === 'transfer_ownership') {
      this.documentsTree = [
        {
          id: 'doc_address',
          label: 'Address Proof',
          mandatory: false,
          deletable: true,
          children: [
            { id: 'sub_addr_transferee', label: 'Address proof of transferee', mandatory: false, deletable: true },
            { id: 'sub_addr_legalheir', label: 'Address Proof Of Legal Heir 1 In Case Of Death Of Permit Holder', mandatory: false, deletable: true },
            { id: 'sub_addr_rent', label: 'Rent Agreement/Allotment Letter', mandatory: false, deletable: true }
          ]
        },
        {
          id: 'doc_identity',
          label: 'Identity Proof',
          mandatory: false,
          deletable: true,
          children: [
            { id: 'sub_id_aadhaar', label: 'Aadhaar Card', mandatory: false, deletable: true },
            { id: 'sub_id_pan', label: 'PAN Card', mandatory: false, deletable: true },
            { id: 'sub_id_passport', label: 'Passport', mandatory: false, deletable: true }
          ]
        },
        {
          id: 'doc_ownership',
          label: 'Ownership Proof',
          mandatory: false,
          deletable: true,
          children: [
            { id: 'sub_owner_sale', label: 'Sale Letter/Form 29/30', mandatory: false, deletable: true },
            { id: 'sub_owner_affidavit', label: 'Ownership Affidavit', mandatory: false, deletable: true }
          ]
        },
        {
          id: 'doc_vehicle',
          label: 'Vehicle Documents',
          mandatory: false,
          deletable: true,
          children: [
            { id: 'sub_vehicle_rc', label: 'Registration Certificate (RC)', mandatory: false, deletable: true },
            { id: 'sub_vehicle_insurance', label: 'Insurance Certificate', mandatory: false, deletable: true },
            { id: 'sub_vehicle_puc', label: 'PUC Certificate', mandatory: false, deletable: true }
          ]
        },
        {
          id: 'doc_noc',
          label: 'No Objection Certificate (NOC)',
          mandatory: false,
          deletable: true,
          children: [
            { id: 'sub_noc_rto', label: 'NOC from RTO', mandatory: false, deletable: true },
            { id: 'sub_noc_bank', label: 'NOC from Financier (if hypothecated)', mandatory: false, deletable: true }
          ]
        }
      ];
    } else {
      this.documentsTree = [
        {
          id: 'doc_identity',
          label: 'Identity Proof',
          mandatory: false,
          deletable: true,
          children: [
            { id: 'sub_id_aadhaar', label: 'Aadhaar Card', mandatory: false, deletable: true },
            { id: 'sub_id_pan', label: 'PAN Card', mandatory: false, deletable: true },
            { id: 'sub_id_voter', label: 'Voter ID', mandatory: false, deletable: true }
          ]
        },
        {
          id: 'doc_address_generic',
          label: 'Address Proof',
          mandatory: false,
          deletable: true,
          children: [
            { id: 'sub_addr_bill', label: 'Electricity/Water Bill', mandatory: false, deletable: true },
            { id: 'sub_addr_bank', label: 'Bank Passbook (Address page)', mandatory: false, deletable: true }
          ]
        },
        {
          id: 'doc_income',
          label: 'Income Proof',
          mandatory: false,
          deletable: true,
          children: [
            { id: 'sub_income_salary', label: 'Salary Slip', mandatory: false, deletable: true },
            { id: 'sub_income_itr', label: 'ITR Acknowledgement', mandatory: false, deletable: true }
          ]
        }
      ];
    }
  }

  // UI actions
  toggleExpand(node: DocumentNode): void {
    node.expanded = !node.expanded;
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

  onMandatoryToggleRequested(node: DocumentNode, checked: boolean, ev: Event): void {
    // Immediately revert visual state until confirmed
    const input = ev.target as HTMLInputElement;
    input.checked = node.mandatory;
    this.openConfirm({
      title: 'Confirm Change',
      message: `Set \"${node.label}\" as ${checked ? 'Mandatory' : 'Non-mandatory'}?`,
      variant: 'warning',
      onConfirm: () => this.toggleMandatoryForNode(node, checked)
    });
  }

  private toggleMandatoryForNode(node: DocumentNode, checked: boolean): void {
    // Only document (parent) level can be mandatory/non-mandatory
    node.mandatory = checked;
    this.showActionToast(`${checked ? 'Marked' : 'Set'} "${node.label}" ${checked ? 'as Mandatory' : 'as Non-mandatory'}.`);
  }

  onMarkAllRequest(checked: boolean): void {
    this.openConfirm({
      title: 'Confirm Bulk Change',
      message: `Set all documents as ${checked ? 'Mandatory' : 'Non-mandatory'}?`,
      variant: 'warning',
      onConfirm: () => this.markAllChanged(checked),
      onCancel: () => this.filterForm.patchValue({ markAllMandatory: !checked }, { emitEvent: false })
    });
  }

  onApplyMarkAllClick(): void {
    const checked = !!this.filterForm.get('markAllMandatory')?.value;
    if (checked) {
      this.onMarkAllRequest(true);
    }
  }

  private markAllChanged(checked: boolean): void {
    // Apply only to document (parent) nodes
    this.documentsTree.forEach(node => (node.mandatory = checked));
    this.showActionToast(`${checked ? 'Marked' : 'Set'} all documents ${checked ? 'as Mandatory' : 'as Non-mandatory'}.`);
  }

  private findNodeInfo(targetId: string): { label: string; type: 'doc' | 'sub' } | undefined {
    for (const doc of this.documentsTree) {
      if (doc.id === targetId) return { label: doc.label, type: 'doc' };
      if (doc.children) {
        const child = doc.children.find(c => c.id === targetId);
        if (child) return { label: child.label, type: 'sub' };
      }
    }
    return undefined;
  }

  onDeleteRequest(targetId: string): void {
    const info = this.findNodeInfo(targetId);
    this.openConfirm({
      title: `Delete ${info?.type === 'sub' ? 'Sub Document' : 'Document'}`,
      message: `Are you sure you want to delete "${info?.label}"? This action cannot be undone.`,
      variant: 'danger',
      onConfirm: () => this.deleteNode(targetId)
    });
  }

  private deleteNode(targetId: string): void {
    const info = this.findNodeInfo(targetId);
    const removeFrom = (nodes: DocumentNode[]): DocumentNode[] =>
      nodes
        .filter(n => n.id !== targetId)
        .map(n => ({ ...n, children: n.children ? removeFrom(n.children) : undefined }));
    this.documentsTree = removeFrom(this.documentsTree);
    if (info) {
      this.showActionToast(`Deleted ${info.type === 'doc' ? 'Document' : 'Sub Document'} "${info.label}".`, 'success');
    }
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

  private showActionToast(message: string, type: 'success' | 'error' = 'success'): void {
    this.toast.message = message;
    this.toast.type = type;
    this.toast.show = true;
  }
}
