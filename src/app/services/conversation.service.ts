import { Injectable } from '@angular/core';
import {Firestore, collection, addDoc, doc, docData, collectionData, query, where} from '@angular/fire/firestore';
import { inject } from '@angular/core';
import {Observable} from 'rxjs';
import {User} from '../../models/user.model';
import {Conversation} from '../../models/conversation.model';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  private firestore = inject(Firestore);

  constructor() { }


  getConversationsByUserId(userId: string): Observable<Conversation[]> {
    const convCollection = collection(this.firestore, 'conversations');
    const convQuery = query(convCollection, where('participants', 'array-contains', userId));

    return collectionData(convQuery, { idField: 'uid' }) as Observable<Conversation[]>;
  }
}
