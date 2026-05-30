import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RecipeFormComponent } from './recipe-form';
import { RecipeService } from '../../services/recipe.service';

describe('RecipeFormComponent', () => {
  let component: RecipeFormComponent;
  let service: {
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    getOne: ReturnType<typeof vi.fn>;
  };
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    const recipeSpy = {
      create: vi.fn(),
      update: vi.fn(),
      getOne: vi.fn(),
    };

    const routerSpy = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [RecipeFormComponent],
      providers: [
        { provide: RecipeService, useValue: recipeSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: vi.fn().mockReturnValue(null), // 👈 important fix
              },
            },
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(RecipeFormComponent);
    component = fixture.componentInstance;

    service = TestBed.inject(RecipeService) as unknown as typeof recipeSpy;
    router = TestBed.inject(Router) as unknown as typeof routerSpy;
  });

  it('should create a new recipe and navigate to list', () => {
    localStorage.setItem('userId', 'userid');

    component.recipe = {
      title: '1',
      imageUrl: '',
      description: '',
      ingredients: [],
      instructions: [],
    };

    component.ingredientsStr = 'ing1,ing2';
    component.instructionsStr = 'step1,step2';

    service.create.mockReturnValue(of({}));

    component.save();

    expect(service.create).toHaveBeenCalled();

    expect(router.navigate).toHaveBeenCalledWith(['/recipes']);
  });
});