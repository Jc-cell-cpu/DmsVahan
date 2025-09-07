import { Routes } from '@angular/router';
import { DocumentConfigComponent } from './dashboard/document-config/document-config.component';
import { PermitConfigComponent } from './dashboard/permit-config/permit-config.component';
import { PermitCategoryConfigComponent } from './dashboard/permit-category-config/permit-category-config.component';
import { TradeCertificateConfigComponent } from './dashboard/trade-certificate-config/trade-certificate-config.component';
import { DealerEndConfigComponent } from './dashboard/dealer-end-config/dealer-end-config.component';
import { AdditionOfCategoryComponent } from './dashboard/addition-of-category/addition-of-category.component';
import { AdditionOfSubCategoryComponent } from './dashboard/addition-of-sub-category/addition-of-sub-category.component';
import { CategoryToSubCategoryComponent } from './dashboard/category-to-sub-category/category-to-sub-category.component';

export const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule) },
  { path: 'document-config', component: DocumentConfigComponent },
  { path: 'permit-config', component: PermitConfigComponent },
  { path: 'permit-category-config', component: PermitCategoryConfigComponent },
  { path: 'trade-certificate-config', component: TradeCertificateConfigComponent },
  { path: 'dealer-end-config', component: DealerEndConfigComponent },
  { path: 'addition-of-category', component: AdditionOfCategoryComponent },
  { path: 'addition-of-sub-category', component: AdditionOfSubCategoryComponent },
  { path: 'category-to-sub-category', component: CategoryToSubCategoryComponent },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' }
];
