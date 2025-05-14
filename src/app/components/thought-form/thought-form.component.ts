import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Thought, ThoughtService } from '../../services/thought.service';

@Component({
  selector: 'app-thought-form',
  imports: [ReactiveFormsModule], 
  templateUrl: './thought-form.component.html',
  styleUrls: ['./thought-form.component.css']
})
export class ThoughtFormComponent {

  form: FormGroup;

  constructor(private fb: FormBuilder, private thoughtService: ThoughtService) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  submitThought() {
    if (this.form.valid) {
      this.thoughtService.addThought(this.form.value);
      this.form.reset();
    }
  }
}
