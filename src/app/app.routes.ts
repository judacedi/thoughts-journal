import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ThoughtEditComponent } from './components/thought-edit/thought-edit.component';

export const routes: Routes = [
    {
        path: '', component: HomeComponent
    },
    // {
    //     path: '**',
    //     redirectTo: '',
    // },
    {
        path: 'edit/:id',
        component: ThoughtEditComponent
    },
];
