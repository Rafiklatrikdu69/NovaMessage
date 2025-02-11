import {Component, effect, inject, OnInit, Signal, signal} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AutoComplete } from 'primeng/autocomplete';
import {UserService} from '../../services/user.service';
import {User} from '../../../models/user.model';
import {CardModule} from 'primeng/card';
import { Skeleton } from 'primeng/skeleton';
import {ConversationService} from '../../services/conversation.service';
import {MessageService} from '../../services/message.service';
import {concatMap, of} from 'rxjs';
import {Conversation} from '../../../models/conversation.model';
import {Message} from '../../../models/message.model';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-home-chat',
  standalone: true,
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    AutoComplete,
    CardModule,
    FormsModule,
    Skeleton,
  ],
  templateUrl: './home-chat.component.html',
  styleUrls: ['./home-chat.component.css']
})
export class HomeChatComponent implements OnInit {


  userService = inject(UserService)
  conversationService = inject(ConversationService);
  messageService = inject(MessageService);
  users: Signal<User[]> = signal([]);
  filteredUsers: User[] = [];
  selectedUser!: User;
  conversations: Conversation[] = [];
  messages : Message[] = [];
  constructor() {
    effect(() => {
      this.users = this.userService.user;
    });
  }

  formGroup!: FormGroup;

  search(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    this.filteredUsers = this.users().filter(user =>
      user.displayName.toLowerCase().includes(query)
    );
  }

  ngOnInit() {
    this.formGroup = new FormGroup({
      selectedCountry: new FormControl(null),
    });
  }
  onSelect(event: any) {
    this.userService.getUserById(event.value.uid).pipe(
      concatMap((user) => {
        console.log(user);
        this.selectedUser = user;
        return this.conversationService.getConversationsByUserId(user.uid);
      }),
      concatMap((conversations) => {
        console.log(conversations);
        this.conversations = conversations;
        if (conversations.length > 0) {
          return this.messageService.getMessageByConversationId(conversations[0].uid!);
        } else {
          return of([]);
        }
      })
    ).subscribe(
      (messages) => {
        console.log(messages);
        this.messages = messages;
      },
      (error) => {
        console.error('Erreur:', error);
        this.messages = [];
      }
    );
  }

}
