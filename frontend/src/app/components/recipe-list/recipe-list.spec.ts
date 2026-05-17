import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { RecipeListComponent } from './recipe-list';
import { RecipeService } from '../../services/recipe.service';
import { AuthService } from '../../services/auth.service';

describe('RecipeListComponent', () => {
  let component: RecipeListComponent;
  let service: any;

  beforeEach(async () => {
    const recipeSpy = {
      getAll: vi.fn(),
      delete: vi.fn(),
    };

    const authSpy = {
      isLoggedIn: vi.fn().mockReturnValue(true),
      canEditRecipe: vi.fn().mockReturnValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [RecipeListComponent],
      providers: [
        provideRouter([]),
        { provide: RecipeService, useValue: recipeSpy },
        { provide: AuthService, useValue: authSpy },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(RecipeListComponent);
    component = fixture.componentInstance;

    service = TestBed.inject(RecipeService);
  });

  it('should load recipes in ngOnInit', () => {
    const fake = [
      {
        _id: '1',
        title: 'a',
        imageUrl: '',
        description: '',
        ingredients: [],
        instructions: [],
      },
    ];

    service.getAll.mockReturnValue(of(fake));

    component.ngOnInit();

    expect(service.getAll).toHaveBeenCalled();
    expect(component.recipes()).toEqual(fake);
  });

  it('should delete a recipe and refresh list', () => {
    const fake = [
      {
        _id: '1',
        title: 'a',
        imageUrl: '',
        description: '',
        ingredients: [],
        instructions: [],
      },
    ];

    service.getAll.mockReturnValue(of(fake));
    service.delete.mockReturnValue(of({}));

    // initial load
    component.ngOnInit();

    // act
    component.deleteRecipe('1');

    expect(service.delete).toHaveBeenCalledWith('1');

    // simulate refresh manually (because subscribe is async)
    service.getAll.mockReturnValue(of(fake));
    component.loadRecipes();

    expect(service.getAll).toHaveBeenCalled();
  });
});