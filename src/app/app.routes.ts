import { Routes } from '@angular/router';
import { DocumentConfigComponent } from './dashboard/document-config/document-config.component';
import { PermitConfigComponent } from './dashboard/permit-config/permit-config.component';

export const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule) },
  { path: 'document-config', component: DocumentConfigComponent },
  { path: 'permit-config', component: PermitConfigComponent },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' }
];
