import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { Thought, Timestamp } from '../../services/thought.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-thought',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './thought.component.html',
  styleUrls: ['./thought.component.css']
})
export class ThoughtComponent {
  @Input({ required: true }) thought!: Thought;

  @Output() removeThought = new EventEmitter<string>();
  @Output() editRequest = new EventEmitter<Thought>();

  constructor(private router: Router) {}

  /**
   * Gets the displayable date string from the thought's date.
   * Converts Firestore Timestamp or Date object to a locale date string.
   */
  get displayDate(): string {
    const date = this.thought.date;
    if (date && typeof (date as any).toDate === 'function') {
      // Firestore Timestamp object
      return (date as Timestamp).toDate().toLocaleDateString();
    } else if (date instanceof Date) {
      // Standard JavaScript Date object
      return date.toLocaleDateString();
    }
    // Fallback for unexpected date types, or if date is already a string (legacy)
    return date ? String(date) : 'No date';
  }

  /**
   * Emits an event with the thought's ID when the remove button is clicked,
   * delegating the deletion logic to the parent component.
   */
  onRemoveClick(): void {
    if (this.thought && this.thought.id) {
      this.removeThought.emit(this.thought.id);
    } else {
      console.error('Cannot remove thought: ID is missing.');
    }
  }

  onEditClick() {
    /**
   * Emits an event with the current thought object when the edit button is clicked,
   * signaling the parent component to initiate the editing process.
   */
    this.editRequest.emit(this.thought);
  }

}
