import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule, NgIf } from "@angular/common";
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
  updateProfile, signOut
} from '@angular/fire/auth';
import { Router, RouterLink } from '@angular/router';
import { addDoc, collection, doc, Firestore, getFirestore, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-gray-100">
      <div class="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Sign up to your account</h2>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              formControlName="name"
              class="w-full px-3 py-2 border rounded-md focus:outline-indigo-500"
              [ngClass]="{'border-red-500': registerForm.get('name')?.invalid && registerForm.get('name')?.touched}">
            <p *ngIf="registerForm.get('name')?.invalid && registerForm.get('name')?.touched" class="text-red-500 text-sm">
              Name is required (minimum 2 characters).
            </p>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="w-full px-3 py-2 border rounded-md focus:outline-indigo-500"
              [ngClass]="{'border-red-500': registerForm.get('email')?.invalid && registerForm.get('email')?.touched}">
            <p *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" class="text-red-500 text-sm">
              Please enter a valid email.
            </p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              class="w-full px-3 py-2 border rounded-md focus:outline-indigo-500"
              [ngClass]="{'border-red-500': registerForm.get('password')?.invalid && registerForm.get('password')?.touched}">
            <p *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" class="text-red-500 text-sm">
              Password must be at least 6 characters.
            </p>
          </div>

          <button
            type="submit"
            [disabled]="registerForm.invalid || isLoading"
            class="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500 disabled:opacity-50">
            {{ isLoading ? 'Signing up...' : 'Sign up' }}
          </button>
        </form>

        <div class="mt-6">
          <button
            (click)="loginWithGoogle()"
            [disabled]="isLoading"
            class="w-full flex items-center justify-center gap-2 border py-2 rounded-md hover:bg-gray-100 disabled:opacity-50">
            <i class="pi pi-google"></i>
            Sign up with Google
          </button>
        </div>

        <p class="mt-6 text-center text-sm text-gray-600">
          Already a member? <a routerLink="/login" class="text-indigo-600 hover:underline">Sign in</a>
        </p>

        <p *ngIf="errorMessage" class="mt-4 text-center text-red-500 text-sm">
          {{ errorMessage }}
        </p>
      </div>
    </div>
  `,
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private auth: Auth = getAuth();
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private firestore: Firestore = getFirestore();

  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const { email, password, name } = this.registerForm.value;
      await this.signup(email, password, name);
      this.router.navigate(['/conversation']);
    } catch (error: any) {
      console.error('Registration error:', error);
      this.errorMessage = this.getErrorMessage(error.code) || error.message;
    } finally {
      this.isLoading = false;
    }
  }

  async loginWithGoogle() {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(this.auth, provider);
      await this.updateUserData(credential.user);
      this.router.navigate(['/conversation']);
    } catch (error: any) {
      console.error('Google login error:', error);
      this.errorMessage = this.getErrorMessage(error.code) || error.message;
    } finally {
      this.isLoading = false;
    }
  }

  private async signup(email: string, password: string, name: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Update the user's display name
      await updateProfile(user, {
        displayName: name
      });

      // Update user data in Firestore
      await this.updateUserData({
        ...user,
        displayName: name
      });

      return user;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  private async updateUserData(user: any) {
    const userRef = doc(this.firestore, `users/${user.uid}`);
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: new Date()
    };

    try {
      await setDoc(userRef, userData, { merge: true });
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  }

  private getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/email-already-in-use': 'This email is already registered.',
      'auth/invalid-email': 'The email address is invalid.',
      'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
      'auth/weak-password': 'The password is too weak.',
      'auth/popup-closed-by-user': 'Google sign in was cancelled.',
      'auth/popup-blocked': 'The sign in popup was blocked by your browser.',
      'auth/cancelled-popup-request': 'The sign in was cancelled.',
      'auth/network-request-failed': 'A network error occurred. Please try again.'
    };

    return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
  }
}
