import { Component, inject } from '@angular/core';
import { Router } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'; 
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Changed styleUrl to styleUrls
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;

  constructor() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  onEmailPasswordLogin(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.loginWithEmailPassword(email, password).subscribe({
        next: () => {
          console.log('LoginComponent: Email/Password login successful');
          this.router.navigate(['/']);
        },
        error: (err) => {
          if (err.message.includes('auth/invalid-credential')) {
            window.alert('Invalid email or password');
          } else {
            window.alert(err.message);
          }
          console.error('LoginComponent: Email/Password login failed', err);
        }
      });
    } else {
      this.loginForm.markAllAsTouched(); 
      console.error('Login form is invalid');
    }
  }

  onGoogleLogin(): void {
    this.authService.loginWithGoogle().subscribe({
      next: () => {
        console.log('LoginComponent: Google login successful');
      },
      error: (err) => {
        if (err.message.includes('auth/invalid-credential')) {
          window.alert('Invalid email or password');
        } else {
          window.alert(err.message);
        }
        console.error('LoginComponent: Google login failed', err);
      }
    });
  }

  navigateToSignup(): void {
    this.router.navigate(['/signup']); 
  }
}
