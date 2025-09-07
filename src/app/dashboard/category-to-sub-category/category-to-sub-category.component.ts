import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomSelectComponent, SelectOption } from '../../shared/components/custom-select/custom-select.component';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import { SidebarComponent, MenuItem } from '../../shared/components/sidebar/sidebar.component';
import { StateBadgeComponent } from '../../shared/components/state-badge/state-badge.component';
import { MenuService } from '../../shared/services/menu.service';

@Component({
  selector: 'app-category-to-sub-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomSelectComponent, CustomButtonComponent, SidebarComponent, StateBadgeComponent],
  templateUrl: './category-to-sub-category.component.html',
  styleUrls: ['./category-to-sub-category.component.scss']
})
export class CategoryToSubCategoryComponent implements OnInit {
  configForm!: FormGroup;
  showAlert = true;
  sidebarOpen = true;
  selectedState = 'Andaman & Nicobar Island';
  menuItems: MenuItem[] = [];

  documentTypes: SelectOption[] = [
    { value: 'identity_proof', label: 'Identity Proof Documents' },
    { value: 'address_proof', label: 'Address Proof Documents' },
    { value: 'vehicle_documents', label: 'Vehicle Related Documents' },
    { value: 'license_documents', label: 'License Documents' },
    { value: 'insurance_documents', label: 'Insurance Documents' },
    { value: 'permit_documents', label: 'Permit Documents' }
  ];

  constructor(private fb: FormBuilder, private menuService: MenuService) {}

  ngOnInit(): void {
    this.menuItems = this.menuService.getMenuItems('/category-to-sub-category');
    this.initializeForm();
  }

  initializeForm(): void {
    this.configForm = this.fb.group({
      documentType: ['', Validators.required],
      shortName: [''],
      description: [''],
      noteDescription: ['', Validators.required]
    });

    // Update fields when document type changes
    this.configForm.get('documentType')?.valueChanges.subscribe(value => {
      this.updateSubDocumentFields(value);
    });
  }

  updateSubDocumentFields(documentType: string): void {
    const subDocuments: { [key: string]: { shortName: string, description: string } } = {
      'identity_proof': {
        shortName: 'ID_PROOF_001',
        description: 'Identity verification documents including Aadhaar, PAN, Passport, etc.'
      },
      'address_proof': {
        shortName: 'ADDR_PROOF_001',
        description: 'Address verification documents including utility bills, bank statements, etc.'
      },
      'vehicle_documents': {
        shortName: 'VEH_DOC_001',
        description: 'Vehicle related documents including RC, insurance, fitness certificate, etc.'
      },
      'license_documents': {
        shortName: 'LIC_DOC_001',
        description: 'License related documents including driving license, trade license, etc.'
      },
      'insurance_documents': {
        shortName: 'INS_DOC_001',
        description: 'Insurance related documents including policy documents, certificates, etc.'
      },
      'permit_documents': {
        shortName: 'PER_DOC_001',
        description: 'Permit related documents including route permits, goods permits, etc.'
      }
    };

    const selectedDoc = subDocuments[documentType];
    if (selectedDoc) {
      this.configForm.patchValue({
        shortName: selectedDoc.shortName,
        description: selectedDoc.description
      });
    } else {
      this.configForm.patchValue({
        shortName: '',
        description: ''
      });
    }
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