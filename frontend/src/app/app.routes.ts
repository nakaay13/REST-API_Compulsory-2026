import { Routes } from '@angular/router';
import { RecipeListComponent } from './components/recipe-list/recipe-list';
import { RecipeFormComponent } from './components/recipe-form/recipe-form';
import { RegisterComponent } from './components/register/register';
import { LoginComponent } from './components/login/login';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'recipes', component: RecipeListComponent },

  {
    path: 'recipes/create',
    component: RecipeFormComponent,
    canActivate: [authGuard], // 🔒 protected
  },
  {
    path: 'recipes/edit/:id',
    component: RecipeFormComponent,
    canActivate: [authGuard], // 🔒 protected
  },
];