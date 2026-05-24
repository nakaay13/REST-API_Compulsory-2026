import { Routes } from '@angular/router';
import { RecipeListComponent } from './components/recipe-list/recipe-list';
import { RecipeFormComponent } from './components/recipe-form/recipe-form';
import { RecipeDetailsComponent } from './components/recipe-details/recipe-details';
import { RegisterComponent } from './components/register/register';
import { LoginComponent } from './components/login/login';
import { authGuard } from './guards/auth.guard';
import { recipeOwnerGuard } from './guards/recipe-owner.guard';
import { UserProfileComponent } from './components/user-profile/user-profile';

export const routes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'recipes', component: RecipeListComponent },

  {
    path: 'recipes/create',
    component: RecipeFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'recipes/edit/:id',
    component: RecipeFormComponent,
    canActivate: [recipeOwnerGuard], // 🔥 upgraded
  },
  {
    path: 'recipes/:id',
    component: RecipeDetailsComponent,
  },
    {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [authGuard],
  }
];