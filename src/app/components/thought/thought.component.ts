import { Component, Input  } from '@angular/core';
import { ThoughtService } from '../../services/thought.service';

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
  @Input() id!: string;

  constructor(private thoughtService: ThoughtService) {}

  remove() {
    this.thoughtService.removeThought(this.id);
  }

}
