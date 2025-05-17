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
  Timestamp // Import Timestamp
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
export { Timestamp }; // Re-export Timestamp

export interface Thought {
  id?: string;
  title: string;
  content: string;
  date:  Date | Timestamp;
}

@Injectable({
  providedIn: 'root'
})
export class ThoughtService {

  private firestore: Firestore = inject(Firestore);
  private thoughtsCollection = collection(this.firestore, 'thoughts');

  constructor() { }

  // Create a new thought
  addThought(thoughtContent: { title: string; content: string }): Promise<any> {
    const newThought: Omit<Thought, 'id'> = {
      title: thoughtContent.title,
      content: thoughtContent.content,
      date: Timestamp.fromDate(new Date()) // Use Firebase Timestamp
    };
    return addDoc(this.thoughtsCollection, newThought);
  }

  // Get all thoughts (as an Observable for real-time updates)
  getThoughts(): Observable<Thought[]> {
    // Optionally, order by date
    const q = query(this.thoughtsCollection, orderBy('date', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Thought[]>; //This MFer is returning an Observable of Thought[] in effing real-time after every change, Jesus Christ Be Praised!
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

  
  // private STORAGE_KEY = 'thoughts';

  // private initialThoughts = this.getThoughts();
  // private thoughtsSignal = signal<Thought[]>(this.initialThoughts)

  // readonly thoughts = computed(() => this.thoughtsSignal());

  // constructor() {
  //   effect(() => {
  //     try {
  //       const current = this.thoughtsSignal();
  //       localStorage.setItem(this.STORAGE_KEY, JSON.stringify(current));
  //     } catch (e) {
  //       console.error("Error saving thoughts to localStorage", e);
  //     }
  //   });
  // }

  // // Expects only title and content, generates id and date internally
  // addThought(newThoughtData: { title: string; content: string }) {
  //   const thought: Thought = {
  //     id: uuidv4(),
  //     title: newThoughtData.title,
  //     content: newThoughtData.content,
  //     date: new Date().toISOString(), // Store full ISO string
  //   };
  //   this.thoughtsSignal.update((prev) => [thought, ...prev]);
  // }

  // removeThought(id: string) {
  //   if (window.confirm("Are you sure you want to delete this thought?")) {
  //     this.thoughtsSignal.update(thoughts =>
  //       thoughts.filter(thought => thought.id !== id) 
  //     );
  //     console.log(`The item with the id ${id} has been removed`);
  //   }
  // }

  // updateThought(updatedThought: Thought) {
  //   this.thoughtsSignal.update(thoughts =>
  //     thoughts.map(thought =>
  //       thought.id === updatedThought.id ? updatedThought : thought
  //     )
  //   );
  //   console.log(`The item with the id ${updatedThought.id} has been updated`);
  // }

  // clearThoughts() {
  //   if (window.confirm("Are you sure you want to delete ALL thoughts? This cannot be undone.")) {
  //     this.thoughtsSignal.set([]);
  //     console.log("All thoughts have been cleared.");
  //   }
  // }

  // getThoughtById(id: string): Thought | undefined {
  //   return this.thoughtsSignal().find(thought => thought.id === id);
  // }

  // private getThoughts(): Thought[] { 
  //   const raw = localStorage.getItem(this.STORAGE_KEY);
  //   if (raw) {
  //     try {
  //       return JSON.parse(raw);
  //     } catch (e) {
  //       console.error("Error parsing thoughts from localStorage", e);
  //       // Optionally, clear the corrupted item:
  //       // localStorage.removeItem(this.STORAGE_KEY);
  //       return [];
  //     }
  //   }
  //   return [];
  // }
}
