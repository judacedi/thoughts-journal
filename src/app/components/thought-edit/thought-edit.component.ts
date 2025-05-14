import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThoughtService } from '../../services/thought.service';
import { Thought } from '../../services/thought.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-thought-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './thought-edit.component.html',
  styleUrls: ['./thought-edit.component.css']
})
export class ThoughtEditComponent implements OnInit, OnDestroy {

    editForm: FormGroup;
    currentThoughtId!: string ;
    originalThought?: Thought;
    private routeSub!: Subscription;

  constructor(private fb: FormBuilder, private thoughtService: ThoughtService, private route: ActivatedRoute, private router: Router) {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.currentThoughtId = params['id'];
      this.originalThought = this.thoughtService.getThoughtById(this.currentThoughtId);
    });
    if (this.originalThought) {
      this.editForm.patchValue({
        title: this.originalThought.title,
        content: this.originalThought.content
      });
    } else {
      console.error('Thought not found!');
      this.router.navigate(['/']);
    }
  }

  saveThought() {
    if (this.editForm.valid && this.originalThought) {
      this.thoughtService.updateThought({
        id: this.currentThoughtId,
        title: this.editForm.value.title,
        content: this.editForm.value.content,
        date: this.originalThought.date
      });
      this.router.navigate(['/']);
    }
  }

  cancelEdit() {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
