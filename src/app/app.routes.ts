import { Routes } from '@angular/router';
import {HomeChatComponent} from './components/home-chat/home-chat.component';
import {LoginComponent} from './components/login/login.component';
import {authGuard} from './guards/auth.guard';
import {RegisterComponent} from './components/register/register.component';
import {ConversationsComponent} from './components/conversation/conversation.component';
import {ChatComponent} from './components/chat/chat.component';

export const routes: Routes = [
  {path:"home", component: HomeChatComponent,canActivate : [authGuard]},
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path: "conversation", component: ConversationsComponent},
  {path:"chat/:id", component: ChatComponent,canActivate : [authGuard]},
];
