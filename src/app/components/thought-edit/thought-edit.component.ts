import { Component, OnInit, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Thought, ThoughtService, Timestamp } from '../../services/thought.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ThoughtFormComponent } from '../thought-form/thought-form.component';
import { switchMap, catchError, tap, filter } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';

@Component({
  selector: 'app-thought-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ThoughtFormComponent],
  templateUrl: './thought-edit.component.html',
  styleUrls: ['./thought-edit.component.css']
})
export class ThoughtEditComponent implements OnInit {

  isLoading: WritableSignal<boolean> = signal(true);
  error: WritableSignal<string | null> = signal(null);
  currentThought: WritableSignal<Thought | null> = signal(null);
  currentThoughtId: string | null = null;

  private route = inject(ActivatedRoute);
  public router = inject(Router); // Made public for template access
  private thoughtService = inject(ThoughtService);

  ngOnInit(): void {
    this.route.paramMap.pipe(
      tap(() => {
        this.isLoading.set(true);
        this.error.set(null);
        this.currentThought.set(null);
      }),
      switchMap(params => {
        const id = params.get('id');
        if (!id) {
          this.error.set('No thought ID provided for editing.');
          this.isLoading.set(false);
          return EMPTY;
        }
        this.currentThoughtId = id;
        return this.thoughtService.getThoughtById(id).pipe(
          catchError(err => {
            console.error('Error fetching thought:', err);
            this.error.set(`Error loading thought: ${err.message || 'Unknown error'}`);
            this.isLoading.set(false);
            return EMPTY;
          })
        );
      }),
      tap(thought => {
        if (thought) {
          const processedThought = {
            ...thought,
            date: thought.date instanceof Timestamp ? thought.date.toDate() : thought.date
          } as Thought;
          this.currentThought.set(processedThought);
        } else {
          this.error.set('Thought not found.');
        }
        this.isLoading.set(false);
      })
    ).subscribe();
  }

  /**
   * Handles the saveSuccess event from ThoughtFormComponent.
   * Navigates away after ThoughtFormComponent successfully saves the thought.
   */
  handleSaveSuccess(): void {
    // The actual save logic is now within ThoughtFormComponent.
    // This component just needs to react to the successful save.
    console.log('Save success reported by ThoughtFormComponent, navigating...');
    this.router.navigate(['/']); // Navigate to home or thought list on success
    // isLoading and error signals here primarily relate to fetching the thought for editing.
    // The loading state during the save operation itself is managed within ThoughtFormComponent.
  }

  /**
   * Handles the cancel event from ThoughtFormComponent.
   */
  handleCancel(): void {
    this.router.navigate(['/']); // Navigate back to the list or home page
  }
}
