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
      try {
        const current = this.thoughtsSignal();
        localStorage.setItem(this.storageKey, JSON.stringify(current));
      } catch (e) {
        console.error("Error saving thoughts to localStorage", e);
      }
    });
  }

  // Expects only title and content, generates id and date internally
  addThought(newThoughtData: { title: string; content: string }) {
    const thought: Thought = {
      id: uuidv4(),
      title: newThoughtData.title,
      content: newThoughtData.content,
      date: new Date().toISOString(), // Store full ISO string
    };
    this.thoughtsSignal.update((prev) => [thought, ...prev]);
  }

  removeThought(id: string) {
    if (window.confirm("Are you sure you want to delete this thought?")) {
      this.thoughtsSignal.update(thoughts =>
        thoughts.filter(thought => thought.id !== id) 
      );
      console.log(`The item with the id ${id} has been removed`);
    }
  }

  updateThought(updatedThought: Thought) {
    this.thoughtsSignal.update(thoughts =>
      thoughts.map(thought =>
        thought.id === updatedThought.id ? updatedThought : thought
      )
    );
    console.log(`The item with the id ${updatedThought.id} has been updated`);
  }

  clearThoughts() {
    if (window.confirm("Are you sure you want to delete ALL thoughts? This cannot be undone.")) {
      this.thoughtsSignal.set([]);
      console.log("All thoughts have been cleared.");
    }
  }

  getThoughtById(id: string): Thought | undefined {
    return this.thoughtsSignal().find(thought => thought.id === id);
  }

  private getThoughts(): Thought[] { 
    const raw = localStorage.getItem(this.storageKey);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error("Error parsing thoughts from localStorage", e);
        // Optionally, clear the corrupted item:
        // localStorage.removeItem(this.storageKey);
        return [];
      }
    }
    return [];
  }
}
