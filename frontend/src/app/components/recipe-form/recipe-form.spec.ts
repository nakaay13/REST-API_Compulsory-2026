import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RouterModule, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeFormComponent } from './recipe-form';
import { RecipeService } from '../../services/recipe.service';

describe('RecipeFormComponent', () => {
  let component: RecipeFormComponent;
  let service: any;
  let router: Router;

  beforeEach(async () => {
    const recipeSpy = { create: vi.fn(), update: vi.fn(), getOne: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [RouterModule, RecipeFormComponent],
      providers: [
        provideRouter([]),
        { provide: RecipeService, useValue: recipeSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map() } } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(RecipeFormComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(RecipeService);
    router = TestBed.inject(Router);
  });

  it('should save a new recipe (non-edit) and navigate', () => {
    localStorage.setItem('userId', 'userid');
    component.recipe = { title: '1', imageUrl: '', description: '', ingredients: [], instructions: [] };
    component.ingredientsStr = 'ing1,ing2';
    component.instructionsStr = 'step1,step2';
    service.create = vi.fn().mockReturnValue(of(component.recipe));
    vi.spyOn(router, 'navigate');

    component.save();

    expect(service.create).toHaveBeenCalled();
    expect(component.recipe._createdBy).toBe('userid');
    expect(router.navigate).toHaveBeenCalledWith(['/recipes']);
  });
});