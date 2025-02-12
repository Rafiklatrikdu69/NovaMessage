import { Injectable } from '@angular/core';
import {Firestore, collection, addDoc, query, where, collectionData} from '@angular/fire/firestore';
import { inject } from '@angular/core';
import {Observable} from 'rxjs';
import { Message } from '../../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private firestore = inject(Firestore);

  constructor() { }



  getMessageByConversationId(conversationId: string): Observable<Message[]> {
    const convCollection = collection(this.firestore, 'messages');
    const convQuery = query(convCollection, where('conversationId', '==', conversationId));

    return collectionData(convQuery, { idField: 'uid' }) as Observable<Message[]>;
  }
}
