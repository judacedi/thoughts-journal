import { Component, Input } from '@angular/core';
import { ThoughtService } from '../../services/thought.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thought',
  imports: [],
  templateUrl: './thought.component.html',
  styleUrls: ['./thought.component.css']
})
export class ThoughtComponent {
  @Input() title = 'Untitled';
  @Input() content = '';
  @Input() date = new Date().toLocaleDateString();
  @Input() id!: string;

  // @Output() editRequest = new EventEmitter<Thought>();

  constructor(
    private thoughtService: ThoughtService,
    private router: Router
  ) {}

  remove() {
    this.thoughtService.removeThought(this.id);
  }

  onEditClick() {
    // const thoughtToEdit: Thought = {
    //   id: this.id,
    //   title: this.title,
    //   content: this.content,
    //   date: this.date
    // };
    // this.editRequest.emit(thoughtToEdit);

    this.router.navigate(['edit', this.id]);
  }

}
