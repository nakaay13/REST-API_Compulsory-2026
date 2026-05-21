import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { provideRouter, Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

import { RecipeDetailsComponent } from './recipe-details';
import { RecipeService } from '../../services/recipe.service';

describe('RecipeDetailsComponent', () => {
  let component: RecipeDetailsComponent;
  let recipeService: any;
  let router: Router;

  beforeEach(async () => {
    const recipeSpy = {
      getOne: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [RecipeDetailsComponent],
      providers: [
        provideRouter([]),
        { provide: RecipeService, useValue: recipeSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: vi.fn().mockReturnValue('1'),
              },
            },
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(RecipeDetailsComponent);

    component = fixture.componentInstance;
    recipeService = TestBed.inject(RecipeService);
    router = TestBed.inject(Router);

    vi.spyOn(component['cdr'] as ChangeDetectorRef, 'detectChanges');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load recipe successfully, When id exists', () => {
    const recipe = {
      id: '1',
      title: 'Pizza',
      description: 'Test description',
      imageUrl: 'image.jpg',
      ingredients: ['Cheese'],
      instructions: ['Bake'],
      author: {
        name: 'John',
      },
    };

    recipeService.getOne.mockReturnValue(of(recipe));

    component.ngOnInit();

    expect(recipeService.getOne).toHaveBeenCalledWith('1');
    expect(component.recipe).toEqual(recipe);
    expect(component.loading).toBe(false);
    expect(component.error).toBe('');
    expect(component['cdr'].detectChanges).toHaveBeenCalled();
  });

  it('should set error, When recipe id is missing', () => {
    const route = TestBed.inject(ActivatedRoute);

    vi.spyOn(route.snapshot.paramMap, 'get').mockReturnValue(null);

    component.ngOnInit();

    expect(recipeService.getOne).not.toHaveBeenCalled();
    expect(component.error).toBe('Recipe not found');
    expect(component.loading).toBe(false);
    expect(component.recipe).toBeNull();
  });

  it('should set error, When getOne fails', () => {
    recipeService.getOne.mockReturnValue(
      throwError(() => new Error('API Error'))
    );

    component.ngOnInit();

    expect(recipeService.getOne).toHaveBeenCalledWith('1');
    expect(component.error).toBe('Unable to load recipe details');
    expect(component.loading).toBe(false);
    expect(component.recipe).toBeNull();
    expect(component['cdr'].detectChanges).toHaveBeenCalled();
  });

  it('should navigate to recipes page, When goBack is called', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');

    component.goBack();

    expect(navigateSpy).toHaveBeenCalledWith(['/recipes']);
  });
});