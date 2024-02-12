import { LoginPageComponent } from './users/pages/login-page/login-page/login-page.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full' // exact match, exatamente a rota login sem mais nada
  },
  {
    path: 'login',
    component: LoginPageComponent
  }
];
