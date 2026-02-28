import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:4000/api/recipes'; // backend URL

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ 'auth-token': token || '' }) };
  }

  getAll(): Observable<Recipe[]> {
  return this.http.get<Recipe[]>(this.apiUrl);
}

  getOne(id: string): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  create(recipe: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(this.apiUrl, recipe, this.getAuthHeaders());
  }

  update(id: string, recipe: Recipe): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, recipe, this.getAuthHeaders());
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }
}