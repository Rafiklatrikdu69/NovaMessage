import { Injectable } from '@angular/core';
import {Firestore, collection, addDoc, doc, docData, collectionData, query, where} from '@angular/fire/firestore';
import { inject } from '@angular/core';
import {generateMockConversations} from '../utils/init';
import {Observable} from 'rxjs';
import {User} from '../../models/user.model';
import {Conversation} from '../../models/conversation.model';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  private firestore = inject(Firestore);

  constructor() { }

  async addMockConversations() {
    try {
      const mockConversations = generateMockConversations(10, 20); // Générer 10 conversations avec 20 utilisateurs
      console.log("Conversations fictives générées: ", mockConversations);

      // Ajouter chaque conversation à Firestore
      for (const conversation of mockConversations) {
        await addDoc(collection(this.firestore, 'conversations'), conversation);
        console.log("Conversation ajoutée avec ID: ", conversation.id);
      }

    } catch (error) {
      console.error("Erreur lors de l'ajout des conversations: ", error);
    }
  }
  getConversationsByUserId(userId: string): Observable<Conversation[]> {
    const convCollection = collection(this.firestore, 'conversations');
    const convQuery = query(convCollection, where('participants', 'array-contains', userId));

    return collectionData(convQuery, { idField: 'uid' }) as Observable<Conversation[]>;
  }
}
