import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-thought-form',
  imports: [ReactiveFormsModule],
  templateUrl: './thought-form.component.html',
  styleUrl: './thought-form.component.css'
})

export class ThoughtFormComponent {
  @Output() newThought = new EventEmitter<{ title: string; content: string; date: string }>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  submitThought() {
    if (this.form.valid) {
      this.newThought.emit({
        ...this.form.value,
        date: new Date().toISOString().split('T')[0]
      });
      this.form.reset();
    }
  }
}
