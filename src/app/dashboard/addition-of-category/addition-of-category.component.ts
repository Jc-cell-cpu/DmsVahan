import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import { SidebarComponent, MenuItem } from '../../shared/components/sidebar/sidebar.component';
import { StateBadgeComponent } from '../../shared/components/state-badge/state-badge.component';
import { MenuService } from '../../shared/services/menu.service';

@Component({
  selector: 'app-addition-of-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomButtonComponent, SidebarComponent, StateBadgeComponent],
  templateUrl: './addition-of-category.component.html',
  styleUrls: ['./addition-of-category.component.scss']
})
export class AdditionOfCategoryComponent implements OnInit {
  configForm!: FormGroup;
  showAlert = true;
  sidebarOpen = window.innerWidth >= 768;
  selectedState = 'Andaman & Nicobar Island';
  menuItems: MenuItem[] = [];

  constructor(private fb: FormBuilder, private menuService: MenuService) {}

  ngOnInit(): void {
    this.menuItems = this.menuService.getMenuItems('/addition-of-category');
    this.initializeForm();
    
    // Set sidebar appropriately on initial load
    this.onResize();
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
    
    // Auto-close sidebar on mobile when a route is clicked
    if (window.innerWidth < 768 && item.route) {
      this.closeSidebar();
    }
    
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
}
