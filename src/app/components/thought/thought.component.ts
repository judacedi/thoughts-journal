import { Component, Input  } from '@angular/core';

@Component({
  selector: 'app-thought',
  imports: [],
  templateUrl: './thought.component.html',
  styleUrl: './thought.component.css'
})
export class ThoughtComponent {
  @Input() title = 'Untitled';
  @Input() content = '';
  @Input() date = new Date().toLocaleDateString();
}
