import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RouterModule, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { RecipeListComponent } from './recipe-list';
import { RecipeService } from '../../services/recipe.service';

describe('RecipeListComponent', () => {
  let component: RecipeListComponent;
  let service: any;

  beforeEach(async () => {
    const recipeSpy = { getAll: vi.fn(), delete: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [RouterModule, RecipeListComponent],
      providers: [provideRouter([]), { provide: RecipeService, useValue: recipeSpy }],
    }).compileComponents();

    const fixture = TestBed.createComponent(RecipeListComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(RecipeService);
  });

  it('should load recipes in ngOnInit', () => {
    const fake = [{ title: 'a', imageUrl: '', description: '', ingredients: [], instructions: [] }];
    service.getAll.mockReturnValue(of(fake));

    component.ngOnInit();

    expect(service.getAll).toHaveBeenCalled();
    expect(component.recipes()).toEqual(fake);
  });

  it('should delete a recipe and refresh', () => {
    const fake = [{ title: 'a', imageUrl: '', description: '', ingredients: [], instructions: [] }];
    service.getAll.mockReturnValue(of(fake));
    service.delete.mockReturnValue(of({}));

    component.deleteRecipe('id');

    expect(service.delete).toHaveBeenCalledWith('id');
    expect(service.getAll).toHaveBeenCalledTimes(1); // on delete it should invoke loadRecipes once in callback
  });
});