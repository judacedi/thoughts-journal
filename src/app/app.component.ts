import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThoughtComponent } from './components/thought/thought.component';
import { CommonModule } from '@angular/common';
import { ThoughtFormComponent } from './components/thought-form/thought-form.component';
import { Thought, ThoughtService } from './services/thought.service';
import { ThoughtListComponent } from "./components/thought-list/thought-list.component";

@Component({
  selector: 'app-root',
  imports: [CommonModule, ThoughtFormComponent, ThoughtListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{

  constructor() {}


}
