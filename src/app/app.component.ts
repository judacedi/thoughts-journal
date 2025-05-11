import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThoughtComponent } from './components/thought/thought.component';
import { CommonModule } from '@angular/common';
import { ThoughtFormComponent } from './components/thought-form/thought-form.component';
import { Thought, ThoughtService } from './services/thought.service';

@Component({
  selector: 'app-root',
  imports: [ThoughtComponent, CommonModule, ThoughtFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  thoughts: Thought[] = [];

  constructor(private thoughtService: ThoughtService) {}

  ngOnInit(): void {
    this.thoughts = this.thoughtService.getThoughts();
  }

  addThought(thought: Thought) {
    this.thoughts.unshift(thought);
    this.thoughtService.saveThoughts(this.thoughts);
  }

}
