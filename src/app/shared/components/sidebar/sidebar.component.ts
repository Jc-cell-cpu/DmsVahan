import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface MenuItem {
  icon?: string;
  label: string;
  route?: string;
  active?: boolean;
  children?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() isOpen = true;
  @Input() menuItems: MenuItem[] = [];
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() menuItemClick = new EventEmitter<MenuItem>();
  @Output() logout = new EventEmitter<void>();

  constructor(private router: Router) {}

  onToggle(): void {
    this.toggleSidebar.emit();
  }

  onMenuItemClick(item: MenuItem): void {
    if (item.children && item.children.length > 0) {
      item.expanded = !item.expanded;
    } else {
      // Check if it's logout menu item
      if (item.label === 'Logout') {
        this.logout.emit();
        return;
      }
      
      if (item.route) {
        this.router.navigate([item.route]);
      }
      this.menuItemClick.emit(item);
    }
  }
}