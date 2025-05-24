import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  deleteDoc,
  updateDoc,
  orderBy, // For ordering
  query, // For creating queries
  Timestamp, // Import Timestamp
  where // For filtering
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service'; // Import AuthService
export { Timestamp }; // Re-export Timestamp

export interface Thought {
  id?: string;
  title: string;
  content: string;
  date:  Date | Timestamp;
  userId: string; // Added to associate thought with a user
}

@Injectable({
  providedIn: 'root'
})
export class ThoughtService {

  private firestore: Firestore = inject(Firestore);
  private thoughtsCollection = collection(this.firestore, 'thoughts');
  private authService: AuthService = inject(AuthService); // Inject AuthService

  constructor() { }

  // Create a new thought
  addThought(thoughtContent: { title: string; content: string }): Promise<any> {
    const currentUser = this.authService.currentUserSignal();
    if (!currentUser || !currentUser.uid) {
      console.error('ThoughtService: User not logged in or UID missing. Cannot add thought.');
      return Promise.reject('User not logged in or UID missing.');
    }

    const newThought: Omit<Thought, 'id'> = {
      title: thoughtContent.title,
      content: thoughtContent.content,
      date: Timestamp.fromDate(new Date()), 
      userId: currentUser.uid // Use uid from AuthService
    };
    return addDoc(this.thoughtsCollection, newThought);
  }

  // Get all thoughts (as an Observable for real-time updates)
  getThoughts(): Observable<Thought[]> {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (user && user.uid) {
          console.log(`ThoughtService: Fetching thoughts for user ${user.uid}`);
          const q = query(
            this.thoughtsCollection, 
            where('userId', '==', user.uid),
            orderBy('date', 'desc')
          );
          return collectionData(q, { idField: 'id' }) as Observable<Thought[]>; //This MFer is returning an Observable of Thought[] in effing real-time after every change, Jesus Christ Be Praised!
        } else {
          console.log('ThoughtService: No user logged in, returning empty thoughts array.');
          return of([]); // Return an observable of an empty array if no user
        }
      }),
      tap(thoughts => console.log('Thoughts after filtering by user:', thoughts)) // For debugging
    );
  }

  // Get a single thought by ID (as an Observable)
  getThoughtById(id: string): Observable<Thought | undefined> {
    const thoughtDoc = doc(this.firestore, `thoughts/${id}`);
    return docData(thoughtDoc, { idField: 'id' }) as Observable<Thought | undefined>;
  }

  // Update an existing thought
  updateThought(thought: Thought): Promise<void> {
    if (!thought.id) {
      return Promise.reject('Thought ID is missing for update.');
    }
    const thoughtDocRef = doc(this.firestore, `thoughts/${thought.id}`);
    // Make sure to convert date back to Timestamp if it's being edited
    const updatedData: Partial<Thought> = {
        ...thought,
        date: thought.date instanceof Date ? Timestamp.fromDate(thought.date) : thought.date
    };
    delete updatedData.id; // Don't store id inside the document itself if using idField
    return updateDoc(thoughtDocRef, updatedData);
  }

  // Delete a thought
  deleteThought(id: string): Promise<void> {
    const thoughtDocRef = doc(this.firestore, `thoughts/${id}`);
    return deleteDoc(thoughtDocRef);
  }

}
