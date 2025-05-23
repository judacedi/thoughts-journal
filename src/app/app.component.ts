import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  authService = inject(AuthService);
  router = inject(Router);

  constructor() {
    effect(() => {
      const currentUser = this.authService.currentUserSignal();
      const currentUrl = this.router.url;

      if (currentUser === undefined) {
        console.log('AppComponent effect: currentUserSignal is undefined (auth state initializing). Waiting...');
        return;
      }

      console.log(`AppComponent effect: currentUserSignal is now ${currentUser ? currentUser.username : 'null'}. Current URL: ${currentUrl}`);

      if (currentUser) {
        if (currentUrl.includes('/login') || currentUrl.includes('/signup')) {
          console.log('AppComponent effect: User logged in, on guest page. Redirecting to /');
          this.router.navigate(['/']);
        }
      } else {
        this.router.navigate(['/login']);
        console.log('AppComponent effect: User is logged out. Redirecting to Log In page');
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout successful from AppComponent');
      },
      error: (err) => console.error('Logout error from AppComponent', err)
    });
  }
}
