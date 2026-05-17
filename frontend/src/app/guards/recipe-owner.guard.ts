import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RecipeService } from '../services/recipe.service';

export const recipeOwnerGuard: CanActivateFn = async (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = auth.getUser();

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  const isAdmin = user.isAdmin;

  if (isAdmin) return true;

  // optional UX check (frontend safety only)
  const recipeId = route.params['id'];

  const recipeService = inject(RecipeService);

  try {
    const recipe = await recipeService.getOne(recipeId).toPromise();

    if (recipe?.author?._id === user.id) {
      return true;
    }

    router.navigate(['/recipes']);
    return false;

  } catch {
    router.navigate(['/recipes']);
    return false;
  }
};