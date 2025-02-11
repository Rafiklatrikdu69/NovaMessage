import {inject, Injectable, signal} from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  Firestore,
  getDocs,
  query,
  where
} from '@angular/fire/firestore';
import {User} from '../../models/user.model';
import {generateMockUsers} from '../utils/init';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  _user = signal<User[]>([])
  user = this._user.asReadonly();
  constructor() {
    this.getAllUsers();
  }
  private firestore=  inject(Firestore)
  async addMockUsers() {
    try {
      const mockUsers = generateMockUsers(10);
      for (const user of mockUsers) {
        const docRef = await addDoc(collection(this.firestore, 'users'), user);
        console.log(`Utilisateur ${user.displayName} ajouté avec ID: ${docRef.id}`);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout des utilisateurs: ", error);
    }
  }
  getAllUsers(): void {
    const usersCollection = collection(this.firestore, 'users');
    collectionData(usersCollection, { idField: 'uid' }).subscribe((users) => {
      this._user.set(users as User[]);
    });
  }
  getUserById(uid: string): Observable<User> {
    const userDoc = doc(this.firestore, `users/${uid}`);
    return docData(userDoc, { idField: 'uid' }) as Observable<User>;
  }

}
