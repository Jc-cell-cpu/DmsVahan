import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import { SidebarComponent, MenuItem } from '../../shared/components/sidebar/sidebar.component';
import { StateBadgeComponent } from '../../shared/components/state-badge/state-badge.component';
import { MenuService } from '../../shared/services/menu.service';

@Component({
  selector: 'app-addition-of-sub-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomButtonComponent, SidebarComponent, StateBadgeComponent],
  templateUrl: './addition-of-sub-category.component.html',
  styleUrls: ['./addition-of-sub-category.component.scss']
})
export class AdditionOfSubCategoryComponent implements OnInit {
  configForm!: FormGroup;
  showAlert = true;
  sidebarOpen = true;
  selectedState = 'Andaman & Nicobar Island';
  menuItems: MenuItem[] = [];

  constructor(private fb: FormBuilder, private menuService: MenuService) {}

  ngOnInit(): void {
    this.menuItems = this.menuService.getMenuItems('/addition-of-sub-category');
    this.initializeForm();
  }

  initializeForm(): void {
    this.configForm = this.fb.group({
      shortName: ['', Validators.required],
      description: ['', Validators.required]
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