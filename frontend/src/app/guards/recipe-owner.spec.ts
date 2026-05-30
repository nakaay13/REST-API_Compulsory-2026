import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { recipeOwnerGuard } from './recipe-owner.guard';
import { AuthService } from '../services/auth.service';
import { RecipeService } from '../services/recipe.service';

describe('recipeOwnerGuard', () => {
  let authService: { getUser: ReturnType<typeof vi.fn> };
  let recipeService: { getOne: ReturnType<typeof vi.fn> };
  let router: Router;

  const route = {
    params: {
      id: 'recipe-1',
    },
  } as unknown as Parameters<typeof recipeOwnerGuard>[0];

  beforeEach(() => {
    authService = {
      getUser: vi.fn(),
    };

    recipeService = {
      getOne: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: RecipeService,
          useValue: recipeService,
        },
        {
          provide: Router,
          useValue: {
            navigate: vi.fn(),
          },
        },
      ],
    });

    router = TestBed.inject(Router);
  });

  it('should return false and navigate to login, When user is not logged in', async () => {
    authService.getUser.mockReturnValue(null);

    const result = await TestBed.runInInjectionContext(() =>
      recipeOwnerGuard(
        route,
        {} as unknown as Parameters<typeof recipeOwnerGuard>[1]
      )
    );

    expect(authService.getUser).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(result).toBe(false);
  });

  it('should return true, When user is admin', async () => {
    authService.getUser.mockReturnValue({
      id: 'u1',
      isAdmin: true,
    });

    const result = await TestBed.runInInjectionContext(() =>
      recipeOwnerGuard(
        route,
        {} as unknown as Parameters<typeof recipeOwnerGuard>[1]
      )
    );

    expect(result).toBe(true);
    expect(recipeService.getOne).not.toHaveBeenCalled();
  });

  it('should return true, When user owns the recipe', async () => {
    authService.getUser.mockReturnValue({
      id: 'u1',
      isAdmin: false,
    });

    recipeService.getOne.mockReturnValue(
      of({
        author: {
          _id: 'u1',
        },
      })
    );

    const result = await TestBed.runInInjectionContext(() =>
      recipeOwnerGuard(
        route,
        {} as unknown as Parameters<typeof recipeOwnerGuard>[1]
      )
    );

    expect(recipeService.getOne).toHaveBeenCalledWith('recipe-1');
    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should return false and navigate to recipes, When user does not own the recipe', async () => {
    authService.getUser.mockReturnValue({
      id: 'u1',
      isAdmin: false,
    });

    recipeService.getOne.mockReturnValue(
      of({
        author: {
          _id: 'u2',
        },
      })
    );

    const result = await TestBed.runInInjectionContext(() =>
      recipeOwnerGuard(
        route,
        {} as unknown as Parameters<typeof recipeOwnerGuard>[1]
      )
    );

    expect(recipeService.getOne).toHaveBeenCalledWith('recipe-1');
    expect(router.navigate).toHaveBeenCalledWith(['/recipes']);
    expect(result).toBe(false);
  });

  it('should return false and navigate to recipes, When getOne fails', async () => {
    authService.getUser.mockReturnValue({
      id: 'u1',
      isAdmin: false,
    });

    recipeService.getOne.mockReturnValue(
      throwError(() => new Error('API Error'))
    );

    const result = await TestBed.runInInjectionContext(() =>
      recipeOwnerGuard(
        route,
        {} as unknown as Parameters<typeof recipeOwnerGuard>[1]
      )
    );

    expect(recipeService.getOne).toHaveBeenCalledWith('recipe-1');
    expect(router.navigate).toHaveBeenCalledWith(['/recipes']);
    expect(result).toBe(false);
  });
});