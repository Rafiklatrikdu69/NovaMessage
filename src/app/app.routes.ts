import { Routes } from '@angular/router';
import {HomeChatComponent} from './components/home-chat/home-chat.component';
import {LoginComponent} from './components/login/login.component';
import {authGuard} from './guards/auth.guard';

export const routes: Routes = [
  {path:"home", component: HomeChatComponent,canActivate : [authGuard]},
  {path: "login", component: LoginComponent}
];
