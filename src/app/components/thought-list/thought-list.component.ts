import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ThoughtComponent } from '../thought/thought.component';
import { Thought, ThoughtService } from '../../services/thought.service';

@Component({
  selector: 'app-thought-list',
  imports: [ThoughtComponent, CommonModule],
  templateUrl: './thought-list.component.html',
  styleUrl: './thought-list.component.css'
})
export class ThoughtListComponent{
  private thoughtService = inject(ThoughtService)

  thoughts = this.thoughtService.thoughts;
}
