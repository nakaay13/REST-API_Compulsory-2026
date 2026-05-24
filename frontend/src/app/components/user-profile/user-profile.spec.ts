import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { UserProfileComponent } from './user-profile';
import { RecipeService } from '../../services/recipe.service';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let service: any;

  beforeEach(async () => {
    const recipeSpy = {
      getRecipesByAuthor: vi.fn(),
    };

    localStorage.setItem('userId', '123');
    localStorage.setItem('userName', 'John');
    localStorage.setItem('email', 'john@test.com');

    await TestBed.configureTestingModule({
      imports: [UserProfileComponent],
      providers: [
        provideRouter([]),
        {
          provide: RecipeService,
          useValue: recipeSpy,
        },
      ],
    }).compileComponents();

    const fixture =
      TestBed.createComponent(UserProfileComponent);

    component = fixture.componentInstance;

    service = TestBed.inject(RecipeService);
  });

  it('should load user recipes in ngOnInit', () => {
    const fakeRecipes = [
      {
        _id: '1',
        title: 'Pizza',
        imageUrl: '',
        description: '',
        ingredients: [],
        instructions: [],
      },
    ];

    service.getRecipesByAuthor.mockReturnValue(
      of(fakeRecipes)
    );

    component.ngOnInit();

    expect(service.getRecipesByAuthor)
      .toHaveBeenCalledWith('123');

    expect(component.recipes)
      .toEqual(fakeRecipes);
  });

  it('should load user data from localStorage', () => {
    expect(component.user.name)
      .toBe('John');

    expect(component.user.email)
      .toBe('john@test.com');

    expect(component.user.id)
      .toBe('123');
  });
});