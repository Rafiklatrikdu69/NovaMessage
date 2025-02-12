import {Component, effect, inject, OnInit} from '@angular/core';
import {AsyncPipe, CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {
  Firestore,
  collection,
  query,
  where,
  collectionData,
  orderBy,
  DocumentData
} from '@angular/fire/firestore';
import {Auth, getAuth} from '@angular/fire/auth';
import {Observable, map, switchMap, of, combineLatest, take} from 'rxjs';
import {Conversation} from '../../../models/conversation.model';
import {User} from 'firebase/auth';


@Component({
  selector: 'app-conversations',
  standalone: true,
  imports: [CommonModule, RouterModule,AsyncPipe],
  templateUrl: './conversation.component.html',
  styles: []
})
export class ConversationsComponent implements OnInit {
  private firestore: Firestore = inject(Firestore);
  private auth: Auth = getAuth();

  public loading = true;
  public  conversations$!: Observable<Conversation[]>;
  public  currentUser: User | null = null;

  constructor() {
    this.conversations$ = new Observable<User | null>(observer => {
      return this.auth.onAuthStateChanged(observer);
    }).pipe(
      switchMap(user => {
        this.currentUser = user;
        if (user) {
          const conversationsRef = collection(this.firestore, 'conversations');
          const conversationsQuery = query(
            conversationsRef,
            where('participants', 'array-contains', user.uid)
          );

          return collectionData(conversationsQuery, { idField: 'id' }).pipe(
            map(conversations => {
              return conversations.map(conv => ({
                ...conv,
                createdAt: conv['createdAt']?.toDate(),
                updatedAt: conv['updatedAt']?.toDate(),
                lastMessage: conv['lastMessage'] ? {
                  ...conv['lastMessage'],
                  timestamp: conv['lastMessage'].timestamp?.toDate()
                } : undefined
              })) as Conversation[];
            })
          );
        } else {
          return of([]);
        }
      })
    );

    // Mettre à jour le loading state
    this.conversations$.pipe(take(1)).subscribe(() => {
      this.loading = false;
    });
  }


  ngOnInit() {
    this.loading = false;
  }

  private getConversations(): Observable<Conversation[]> {
    const conversationsRef = collection(this.firestore, 'conversations');
    const conversationsQuery = query(
      conversationsRef,
      where('participants', 'array-contains', this?.currentUser?.uid as string),
    );

    return collectionData(conversationsQuery, {idField: 'id'}).pipe(
      map(conversations => {
        console.log(conversations)
        return conversations.map(conv => ({
          ...conv,
          createdAt: conv['createdAt']?.toDate(),
          updatedAt: conv['updatedAt']?.toDate(),
          lastMessage: conv['lastMessage'] ? {
            ...conv['lastMessage'],
            timestamp: conv['lastMessage'].timestamp?.toDate()
          } : undefined
        })) as Conversation[];
      })
    );
  }

  getOtherUser(conversation: Conversation): Observable<User | null> {
    if (!this.currentUser || conversation.type !== 'private') return of(null);

    const otherUserId = conversation.participants.find(id => id !== this.currentUser?.uid);
    if (!otherUserId) return of(null);

    const userRef = collection(this.firestore, 'users');
    const userQuery = query(userRef, where('uid', '==', otherUserId));

    return collectionData(userQuery).pipe(
      map(users => users[0] as User || null)
    );
  }

  getFormattedParticipants(conversation: Conversation): Observable<string> {
    const userObservables = conversation.participants.map(uid => {
      const userQuery = query(
        collection(this.firestore, 'users'),
        where('uid', '==', uid)
      );
      return collectionData(userQuery).pipe(
        map(users => (users[0] as User)?.displayName || 'Unknown')
      );
    });

    return combineLatest(userObservables).pipe(
      map(names => names.join(', '))
    );
  }
}
