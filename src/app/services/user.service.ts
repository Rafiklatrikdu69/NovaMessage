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
