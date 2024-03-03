import { ConversationMessagesPageComponent } from './conversations/pages/conversation-messages-page/conversation-messages-page.component';
import { isUserLoggerGuard } from './guards/is-user-logged.can-activate.guard';
import { LoginPageComponent } from './users/pages//login-page/login-page.component';
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
  },
  {
    path: 'conversations',
    //Só vai carregar se o user entrar na tela
    loadComponent: () => import('./conversations/pages/conversation-page/conversation-page.component'),
    canActivate: [ isUserLoggerGuard ],
    children: [
      {
        path: ':userId',
        component: ConversationMessagesPageComponent
      } 
    ]
  }
];
