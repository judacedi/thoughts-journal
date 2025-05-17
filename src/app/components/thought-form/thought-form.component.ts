import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Thought, ThoughtService, Timestamp } from '../../services/thought.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-thought-form',
  standalone: true, // Making it standalone as per general preference
  imports: [ReactiveFormsModule, CommonModule], // Added CommonModule for *ngIf if needed later
  templateUrl: './thought-form.component.html',
  styleUrls: ['./thought-form.component.css']
})
export class ThoughtFormComponent implements OnChanges {

  form: FormGroup;

  @Input() thoughtToEdit: Thought | null = null;
  @Output() saveSuccess = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  isEditMode = signal(false);

  constructor(private fb: FormBuilder, private thoughtService: ThoughtService) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  /**
   * Lifecycle hook that is called when any data-bound property of a directive changes.
   * Used here to populate the form if 'thoughtToEdit' is provided.
   * @param changes The changed properties.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['thoughtToEdit'] && this.thoughtToEdit) {
      this.form.patchValue({
        title: this.thoughtToEdit.title,
        content: this.thoughtToEdit.content
      });
      this.isEditMode.set(true);
    } else if (changes['thoughtToEdit'] && !this.thoughtToEdit) {
      // If thoughtToEdit becomes null (e.g., after an edit is finished and cleared)
      this.form.reset();
      this.isEditMode.set(false);
    }
  }

  /**
   * Handles form submission. Validates the form and emits the form data along with an edit flag.
   * It does not directly call the thought service.
   */
  async submitThought(): Promise<void> {
    if (!this.form.valid) {
      console.error('Form is invalid.');
      return;
    }

    const { title, content } = this.form.value;
    const currentDateTime = Timestamp.now(); // Use Firestore Timestamp for new/updated thoughts

    try {
      if (this.isEditMode() && this.thoughtToEdit && this.thoughtToEdit.id) {
        // Update existing thought
        const updatedThought: Thought = {
          id: this.thoughtToEdit.id,
          title,
          content,
          date: this.thoughtToEdit.date, // Preserve original date or update if form allows
        };
        // If you allow date editing in the form, you might want to update 'date' as well.
        // For now, let's assume we're preserving the original creation date upon edit or setting a new 'lastModifiedDate'.
        // To simply update it to now, you could use: date: currentDateTime,
        await this.thoughtService.updateThought(updatedThought);
        console.log('Thought updated successfully');
      } else {
        // Add new thought
        const newThought: Omit<Thought, 'id'> = {
          title,
          content,
          date: currentDateTime, 
        };
        await this.thoughtService.addThought(newThought);
        console.log('Thought added successfully');
      }
      this.form.reset();
      this.isEditMode.set(false);
      this.saveSuccess.emit();
    } catch (error) {
      console.error('Error saving thought:', error);
      // Optionally, emit an error event or display a message to the user
    }
  }

  /**
   * Handles the cancel action. Resets the form, clears edit mode, and emits a cancel event.
   */
  onCancel(): void {
    this.form.reset();
    this.isEditMode.set(false);
    this.cancel.emit();
  }
}
