import { Injectable } from '@angular/core';
import {Firestore, collection, addDoc, query, where, collectionData} from '@angular/fire/firestore';
import { inject } from '@angular/core';
import {generateMockMessages} from '../utils/init';
import {Observable} from 'rxjs';
import {Conversation} from '../../models/conversation.model';
import { Message } from '../../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private firestore = inject(Firestore);

  constructor() { }

  async addMockMessages() {
    try {
      const mockMessages = generateMockMessages(10, ['conv_1', 'conv_2'], ['user_1', 'user_2', 'user_3']);
      console.log("Messages fictifs générés: ", mockMessages);

      // Ajouter chaque message à Firestore
      for (const message of mockMessages) {
        await addDoc(collection(this.firestore, 'messages'), message);
        console.log("Message ajouté avec ID: ", message.id);
      }

    } catch (error) {
      console.error("Erreur lors de l'ajout des messages: ", error);
    }
  }

  getMessageByConversationId(conversationId: string): Observable<Message[]> {
    const convCollection = collection(this.firestore, 'messages');
    const convQuery = query(convCollection, where('conversationId', '==', conversationId));

    return collectionData(convQuery, { idField: 'uid' }) as Observable<Message[]>;
  }
}
