import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThoughtFormComponent } from './components/thought-form/thought-form.component';
import { Thought } from './services/thought.service';
import { ThoughtListComponent } from "./components/thought-list/thought-list.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // currentThoughtToEdit: Thought | null = null;

  constructor() {}

  // onEditThoughtRequested(thought: Thought) {
  //   this.currentThoughtToEdit = thought;
  //   // Optionally, scroll to the form or give focus
  //   // window.scrollTo({ top: 0, behavior: 'smooth' }); 
  // }

  // handleEditFinished() {
  //   this.currentThoughtToEdit = null;
  // }
}
