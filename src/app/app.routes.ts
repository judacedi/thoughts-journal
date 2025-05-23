import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ThoughtEditComponent } from './components/thought-edit/thought-edit.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';

export const routes: Routes = [
    {
        path: '', 
        component: HomeComponent,
        canActivate: [AuthGuard] 
    },
    {
        path: 'edit/:id',
        component: ThoughtEditComponent,
        canActivate: [AuthGuard] 
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [GuestGuard] 
    },
    {
        path: 'signup',
        component: SignupComponent,
        canActivate: [GuestGuard] 
    },
];
