import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Thought, ThoughtService } from '../../services/thought.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-thought-form',
  imports: [ReactiveFormsModule],
  templateUrl: './thought-form.component.html',
  styleUrl: './thought-form.component.css'
})

export class ThoughtFormComponent {
  newThought: Thought = {
    title: '',
    content: '',
    date: new Date().toISOString(),
    id: '',
  };

  form: FormGroup;

  constructor(private fb: FormBuilder, private thoughtService: ThoughtService) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  submitThought() {
    if (this.form.valid) {

      this.newThought = {
        id: uuidv4(),
        ...this.form.value,
        date: new Date().toISOString().split('T')[0]
      };

      this.thoughtService.addThought(this.newThought)
      this.form.reset();
      this.newThought = { title: '', content: '', date: '', id: '' };
    }
  }
}
