import { Injectable, signal, computed, effect } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

export interface Thought {
  id: string;
  title: string;
  content: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThoughtService {
  private storageKey = 'thoughts';

  private initialThoughts = this.getThoughts();
  private thoughtsSignal = signal<Thought[]>(this.initialThoughts)

  readonly thoughts = computed(() => this.thoughtsSignal());

  constructor() {
    effect(() => {
      const current = this.thoughtsSignal();
      localStorage.setItem(this.storageKey, JSON.stringify(current));
    });
  }

  addThought(thought: Thought) {
    this.thoughtsSignal.update((prev) => [thought, ...prev])
  }

  removeThought(id: string) {
    this.thoughtsSignal.update(thoughts =>
      thoughts.filter(thought => thought.id !== id) 
    );
    console.log(`The item with the id ${id} has been removed`)
}

  clearThoughts() {
    this.thoughtsSignal.set([]);
  }

  private getThoughts(): Thought[] { 
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }
}
