import { Component } from '@angular/core';
import { ThoughtFormComponent } from '../thought-form/thought-form.component';
import { ThoughtListComponent } from '../thought-list/thought-list.component';

@Component({
  selector: 'app-home',
  imports: [ThoughtFormComponent, ThoughtListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
