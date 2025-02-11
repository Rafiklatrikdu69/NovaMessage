import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {Auth, GoogleAuthProvider, signInWithPopup, getAuth, signInWithEmailAndPassword} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Firestore, doc, setDoc, getFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  private auth: Auth = getAuth();
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private firestore: Firestore = getFirestore();

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {}

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(this.auth, provider);
      await this.updateUserData(credential.user);
      this.router.navigate(['/home']);
    } catch (error:any) {
      this.errorMessage = error.message;
    }
  }

  private async updateUserData(user: any) {
    const userRef = doc(this.firestore, `users/${user.uid}`);
      console.log("Utilisateur connecté: ", user);
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };
    await setDoc(userRef, userData, { merge: true });
  }
  async onSubmit(){
    this.isLoading = true;
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    await signInWithEmailAndPassword(this.auth,email, password)
      .then((userCredential) => {
        this.isLoading = false;
        console.log("Utilisateur connecté: ", userCredential.user);
        this.router.navigate(['/home']);
      })
      .catch((error:any) => {
        this.isLoading = false;
        this.errorMessage = error.message;
      });
  }
}
