import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

// export const guestGuard: CanActivateFn = (route, state) => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   if (authService.currentUserSignal()) {
//     // User is authenticated, so they are not a guest.
//     // Redirect them away from guest-only pages (e.g., login, signup) to the home page.
//     router.navigate(['/']); 
//     return false; // Block access to the guest route
//   } else {
//     // User is not authenticated, so they are a guest.
//     return true; // Allow access to the guest route
//   }
// };

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
      if (this.authService.currentUserSignal()) {
        this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
        return false;
      } else {
          return true
      }
  }
}
