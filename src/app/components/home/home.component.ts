import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ThoughtFormComponent } from '../thought-form/thought-form.component';
import { ThoughtListComponent } from '../thought-list/thought-list.component';

@Component({
  selector: 'app-home',
  imports: [ThoughtFormComponent, ThoughtListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private router = inject(Router);

  handleSaveSuccess(): void {
    console.log('Thought saved successfully via HomeComponent, navigating to list.');
    // Potentially navigate to the main list view or refresh data
    // For now, assuming '/' shows the list which includes HomeComponent with ThoughtListComponent
    this.router.navigate(['/']); 
  }

  handleCancel(): void {
    console.log('Thought form cancelled in HomeComponent.');
    // Navigate away or reset form, depending on desired UX for standalone form cancel
    // If home is just form + list, cancel might not need to navigate, 
    // but if it were a dedicated '/add' route, it would navigate back.
    // For now, let's assume a soft cancel (form resets itself internally).
    // If navigation is desired: this.router.navigate(['/']);
  }

}
