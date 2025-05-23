import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

// export const authGuard: CanActivateFn = (
//   route: ActivatedRouteSnapshot, 
//   state: RouterStateSnapshot
//   ) => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   if (authService.currentUserSignal()) {
//     return true; // User is authenticated, allow access
//   } else {
//     // User is not authenticated, redirect to login page
//     // Store the attempted URL to redirect back after login
//     router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
//     return false; // Block access
//   }
// };

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | boolean {
        if (this.authService.currentUserSignal()) {
            return true;
        } else {
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }
    }
}