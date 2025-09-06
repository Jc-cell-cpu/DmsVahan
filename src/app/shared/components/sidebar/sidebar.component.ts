import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  onToggle(): void {
    this.toggleSidebar.emit();
  }

  onMenuItemClick(item: MenuItem): void {
    if (item.children && item.children.length > 0) {
      item.expanded = !item.expanded;
    } else {
      this.menuItemClick.emit(item);
    }
  }
}