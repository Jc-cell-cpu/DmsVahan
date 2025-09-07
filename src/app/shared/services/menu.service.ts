import { Injectable } from '@angular/core';
import { MenuItem } from '../components/sidebar/sidebar.component';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuItems: MenuItem[] = [
    {
      icon: 'pi pi-folder',
      label: 'Document Configuration',
      expanded: true,
      children: [
        {
          icon: 'pi pi-car',
          label: 'Vahan Related',
          route: '/document-config'
        },
        {
          icon: 'pi pi-file-edit',
          label: 'Permit Related',
          expanded: false,
          children: [
            { icon: 'pi pi-file', label: 'Permit', route: '/permit-config' },
            { icon: 'pi pi-cog', label: 'Permit Category Configuration', route: '/permit-category-config' }
          ]
        },
        {
          icon: 'pi pi-briefcase',
          label: 'Trade Certificate Related',
          route: '/trade-certificate-config'
        },
        {
          icon: 'pi pi-shop',
          label: 'Dealer End Related',
          route: '/dealer-end-config'
        }
      ]
    },
    {
      icon: 'pi pi-plus',
      label: 'Addition of Document Category',
      route: '/addition-of-category'
    },
    {
      icon: 'pi pi-plus-circle',
      label: 'Addition of Document Sub-Category',
      route: '/addition-of-sub-category'
    },
    {
      icon: 'pi pi-link',
      label: 'Addition of Category to Sub-Category',
      route: '/category-to-sub-category'
    },
    {
      icon: 'pi pi-eye',
      label: 'View Assign Document'
    },
    {
      icon: 'pi pi-wrench',
      label: 'DMS Utility',
      children: [
        { icon: 'pi pi-search', label: 'Document View By Application No.' }
      ]
    },
    {
      icon: 'pi pi-sign-out',
      label: 'Logout'
    }
  ];

  getMenuItems(activeRoute?: string): MenuItem[] {
    const items = JSON.parse(JSON.stringify(this.menuItems));
    if (activeRoute) {
      this.setActiveItem(items, activeRoute);
    }
    return items;
  }

  private setActiveItem(items: MenuItem[], activeRoute: string): void {
    items.forEach(item => {
      item.active = item.route === activeRoute;
      if (item.children) {
        this.setActiveItem(item.children, activeRoute);
        if (item.children.some(child => child.active)) {
          item.expanded = true;
        }
      }
    });
  }
}