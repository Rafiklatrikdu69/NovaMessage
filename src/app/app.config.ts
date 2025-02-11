import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import customPreset from '../custom.preset';
import { getAuth, provideAuth } from '@angular/fire/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBqCzJnKg-5XEXtL47kKp0THAuw5p9vkiY",
  authDomain: "nova-message-6f921.firebaseapp.com",
  projectId: "nova-message-6f921",
  storageBucket: "nova-message-6f921.firebasestorage.app",
  messagingSenderId: "69607556840",
  appId: "1:69607556840:web:377625f31b4339793a6b5d",
  measurementId: "G-H4ER15WM48"
};

export let appConfig: ApplicationConfig;
appConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => {
      const auth = getAuth();
      auth.settings.appVerificationDisabledForTesting = true;
      return auth;
    }),
    providePrimeNG({ theme: { preset: customPreset } })
  ]
};
