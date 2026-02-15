import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ClientsPageComponent } from './pages/clients-page/clients-page.component';
import { authGuard } from './auth/auth.guard';
import { LayoutComponent } from './pages/layout/layout.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'clients',
        component: ClientsPageComponent,
      },
    ],
  },
];
