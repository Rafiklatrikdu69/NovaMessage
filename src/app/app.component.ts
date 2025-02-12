import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {UserService} from './services/user.service';
import {ConversationService} from './services/conversation.service';
import {MessageService} from './services/message.service';
import {NavComponent} from './components/nav/nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, NavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
  userServices = inject(UserService)
  conversationServices = inject(ConversationService)
  messageServices = inject(MessageService)
  router = inject(Router)
  constructor() {
    //this.messageServices.addMockMessages().then(r => console.log("Messages ajoutés"));
    //this.conversationServices.addMockConversations().then(r => console.log("Conversations ajoutées"));
    //this.userServices.addMockUsers().then(r => console.log("Utilisateurs ajoutés"));
   // this.router.navigate(['/home']);
  }



}
