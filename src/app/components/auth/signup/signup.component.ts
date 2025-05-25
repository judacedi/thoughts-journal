import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

// Custom Validator Function
function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordsMustMatch: true };
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  signupForm: FormGroup;

  constructor() {
    this.signupForm = new FormGroup({
      username: new FormControl('', [Validators.required]), 
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required])
    }, { validators: passwordsMatchValidator }); // Apply custom validator at the FormGroup level
  }

  onSignup(): void {
    if (this.signupForm.valid) {
      const { username, email, password } = this.signupForm.value;
      this.authService.signupWithEmailPassword(email, username, password).subscribe({
        next: () => {
          console.log('SignupComponent: Signup successful');
          this.router.navigate(['/']);
        },
        error: (err) => {
          if (err.message.includes('auth/invalid-email')) {
            window.alert('Invalid email');
          } else {
            window.alert(err.message);
          }
          console.error('SignupComponent: Signup failed', err);
        }
      });
    } else {
      this.signupForm.markAllAsTouched();
      console.error('Signup form is invalid');
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
