import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { RecipeListComponent } from './components/recipe-list/recipe-list';
import { RecipeFormComponent } from './components/recipe-form/recipe-form';

export const routes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'recipes', component: RecipeListComponent },
  { path: 'recipes/create', component: RecipeFormComponent },
  { path: 'recipes/edit/:id', component: RecipeFormComponent },
];