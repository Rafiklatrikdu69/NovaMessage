import { Routes } from '@angular/router';
import {HomeChatComponent} from './components/home-chat/home-chat.component';
import {LoginComponent} from './components/login/login.component';

export const routes: Routes = [
  {path:"home", component: HomeChatComponent},
  {path: "login", component: LoginComponent}
];
