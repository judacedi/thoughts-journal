import { Injectable } from '@angular/core';

export interface Thought {
  title: string;
  content: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThoughtService {
  private storageKey = 'thoughts';

  getThoughts(): Thought[] {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  saveThoughts(thoughts: Thought[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(thoughts));
  }
}
