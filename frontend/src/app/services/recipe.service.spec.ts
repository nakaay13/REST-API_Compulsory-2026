import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { RecipeService, Recipe } from './recipe.service';

describe('RecipeService', () => {
  let service: RecipeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(RecipeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should fetch all recipes, When getAll is called', () => {
    const mockRecipes: Recipe[] = [
      {
        title: 'Test',
        imageUrl: 'img.jpg',
        description: 'desc',
        ingredients: [],
        instructions: [],
      },
    ];

    service.getAll().subscribe((recipes) => {
      expect(recipes).toEqual(mockRecipes);
    });

    const req = httpMock.expectOne('/api/recipes');
    expect(req.request.method).toBe('GET');

    req.flush(mockRecipes);
  });

  it('should fetch one recipe with auth header, When getOne is called', () => {
    localStorage.setItem('token', 'abc123');

    const mockRecipe: Recipe = {
      title: 'Test',
      imageUrl: 'img.jpg',
      description: 'desc',
      ingredients: [],
      instructions: [],
    };

    service.getOne('1').subscribe((recipe) => {
      expect(recipe).toEqual(mockRecipe);
    });

    const req = httpMock.expectOne('/api/recipes');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('auth-token')).toBe('abc123');

    req.flush(mockRecipe);
  });

  it('should create a recipe, When create is called', () => {
    localStorage.setItem('token', 'abc');

    const newRecipe: Recipe = {
      title: 'New',
      imageUrl: 'img.jpg',
      description: 'desc',
      ingredients: [],
      instructions: [],
    };

    service.create(newRecipe).subscribe((res) => {
      expect(res).toEqual(newRecipe);
    });

    const req = httpMock.expectOne('/api/recipes');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newRecipe);

    req.flush(newRecipe);
  });

  it('should update a recipe, When update is called', () => {
    localStorage.setItem('token', 'abc');

    const updated: Recipe = {
      title: 'Updated',
      imageUrl: 'img.jpg',
      description: 'desc',
      ingredients: [],
      instructions: [],
    };

    service.update('1', updated).subscribe();

    const req = httpMock.expectOne('/api/recipes/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updated);

    req.flush({});
  });

  it('should delete a recipe, When delete is called', () => {
    localStorage.setItem('token', 'abc');

    service.delete('1').subscribe();

    const req = httpMock.expectOne('/api/recipes/1');
    expect(req.request.method).toBe('DELETE');

    req.flush({});
  });
});