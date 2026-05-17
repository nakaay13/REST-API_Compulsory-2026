import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';

export interface Recipe {
  _id?: string;
  title: string;
  imageUrl: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  _createdBy?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = '/api/recipes'; // backend URL
  private recipeCache = new Map<string, Recipe>();
  private recipeRequests = new Map<string, Observable<Recipe>>(); 
  private allRecipesCache: Recipe[] | null = null;
  private allRecipesRequest: Observable<Recipe[]> | null = null;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ 'auth-token': token || '' }) };
  }

  getAll(): Observable<Recipe[]> {
    if (!this.allRecipesRequest) {
      this.allRecipesRequest = this.http.get<Recipe[]>(this.apiUrl).pipe(
        tap(recipes => {
          this.allRecipesCache = recipes;
          recipes.forEach(recipe => {
            if (recipe._id) {
              this.recipeCache.set(recipe._id, recipe);
            }
          });
        }),
        shareReplay(1)
      );
    }
    return this.allRecipesRequest;
  }

  getOne(id: string): Observable<Recipe> {
    // Return cached recipe if available
    if (this.recipeCache.has(id)) {
      console.log('Recipe loaded from cache:', id);
      return new Observable(observer => {
        observer.next(this.recipeCache.get(id)!);
        observer.complete();
      });
    }

    // Return ongoing request if one exists to avoid duplicate requests
    if (this.recipeRequests.has(id)) {
      console.log('Recipe request already in progress:', id);
      return this.recipeRequests.get(id)!;
    }

    // Make new request and cache it
    const request$ = this.http.get<Recipe>(`${this.apiUrl}/${id}`, this.getAuthHeaders()).pipe(
      tap(recipe => {
        console.log('Recipe fetched from API:', id);
        this.recipeCache.set(id, recipe);
        this.recipeRequests.delete(id);
      }),
      shareReplay(1)
    );

    this.recipeRequests.set(id, request$);
    return request$;
  }

  create(recipe: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(this.apiUrl, recipe, this.getAuthHeaders()).pipe(
      tap(newRecipe => {
        if (newRecipe._id) {
          this.recipeCache.set(newRecipe._id, newRecipe);
        }
        this.clearAllRecipesCache();
      })
    );
  }

  update(id: string, recipe: Recipe): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, recipe, this.getAuthHeaders()).pipe(
      tap(() => {
        this.recipeCache.delete(id);
        this.clearAllRecipesCache();
      })
    );
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders()).pipe(
      tap(() => {
        this.recipeCache.delete(id);
        this.clearAllRecipesCache();
      })
    );
  }

  private clearAllRecipesCache(): void {
    this.allRecipesCache = null;
    this.allRecipesRequest = null;
  }

  clearCache(): void {
    this.recipeCache.clear();
    this.recipeRequests.clear();
    this.clearAllRecipesCache();
  }
}