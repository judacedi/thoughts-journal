import { Component, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // For *ngFor, async pipe etc.
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { ThoughtService } from '../../services/thought.service'; // Adjust path if needed
import { Thought } from '../../services/thought.service'; // Or from your models folder
import { ThoughtComponent } from '../thought/thought.component'; // Assuming this is a child component

@Component({
  selector: 'app-thought-list',
  imports: [ThoughtComponent, CommonModule],
  templateUrl: './thought-list.component.html',
  styleUrls: ['./thought-list.component.css']
})
export class ThoughtListComponent {
  private thoughtService = inject(ThoughtService);
  public thoughts: Signal<Thought[]> = toSignal(this.thoughtService.getThoughts(), { initialValue: [] });

  constructor(private router: Router) {}

   // Method to handle deletion request from a child ThoughtComponent or directly
   /**
   * Handles the request to delete a thought. 
   * It confirms with the user before calling the ThoughtService to remove the thought from Firestore. 
   * The list updates automatically due to the reactive nature of the thoughts signal.
   */
  async onRemoveThought(thoughtId: string): Promise<void> {
    if (!thoughtId) {
      console.error('Thought ID is missing for deletion.');
      return;
    }
    if (!confirm("Are you sure you want to delete this thought?")) {
      return;
    }
    try {
      await this.thoughtService.deleteThought(thoughtId);
      console.log(`Thought with ID: ${thoughtId} deleted successfully`);
      // The list will update automatically because getThoughts() is an Observable!
    } catch (error) {
      console.error('Error deleting thought:', error);
      // Handle error appropriately (e.g., show a notification to the user)
    }
    
  }

  /**
   * Navigates to the dedicated edit page for the selected thought,
   * passing the thought's ID in the route parameters.
   * This method is called when an edit is requested for a thought.
   */
  onEditThought(thought: Thought): void {
    if (thought && thought.id) {
      this.router.navigate(['/edit', thought.id]);
    } else {
      console.error('Cannot edit thought: Thought or Thought ID is missing.');
    }
  }

}
