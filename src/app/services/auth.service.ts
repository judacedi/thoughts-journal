import { Injectable, inject, signal, computed, WritableSignal, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Auth,
  authState,
  User as FirebaseUser, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  user
} from '@angular/fire/auth';
import { Observable, from, EMPTY, of, Subscription } from 'rxjs';
import { catchError, tap, map, switchMap, filter, take } from 'rxjs/operators';
import { UserInterface } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  firebaseAuth = inject(Auth);
  private router = inject(Router); 
  user$ = user(this.firebaseAuth); 
  currentUserSignal = signal<UserInterface | null | undefined>(undefined);

  private userSubscription: Subscription;

  constructor() {
    this.userSubscription = this.user$.subscribe(fireBaseUser => {
      if (fireBaseUser) {
        const appUser: UserInterface = {
          uid: fireBaseUser.uid,
          email: fireBaseUser.email!,
          username: fireBaseUser.displayName || fireBaseUser.email!
        };
        this.currentUserSignal.set(appUser);
        console.log('AuthService: currentUserSignal set to user:', appUser);
      } else {
        this.currentUserSignal.set(null);
        console.log('AuthService: currentUserSignal set to null.');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  

  signupWithEmailPassword(email: string, username: string, password: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
      .then(response => updateProfile(response.user, { displayName: username }));
    
    return from(promise);
  }

  loginWithEmailPassword(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password)
      .then(() => {});
    
    return from(promise);    
  }
  
  loginWithGoogle(): Observable<UserCredential | void> {
    const promise = signInWithPopup(this.firebaseAuth, new GoogleAuthProvider());

    return from(promise)
  }

  logout(): Observable<void> {
    // Calling signOut(this.firebaseAuth) will trigger the user$ observable 
    // (subscribed to in the constructor) to emit null.
    // This, in turn, will set this.currentUserSignal to null.
    // The AuthGuard, if active on a protected route, should then detect 
    // that currentUserSignal() is null and redirect to /login.
    console.log('AuthService: Initiating Firebase signOut.');
    return from(signOut(this.firebaseAuth));
  }

}
