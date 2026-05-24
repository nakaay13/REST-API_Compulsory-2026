import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_BASE_URL } from './api.config';
import { Recipe } from './recipe.service';

interface LoginResponse {
  error: any;
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      isAdmin: boolean;
    };
  };
}

interface RegisterResponse {
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${API_BASE_URL}/user`;

  isLoggedIn = signal<boolean>(!!localStorage.getItem('token'));

  constructor(private http: HttpClient, private router: Router) {}

login(email: string, password: string) {
  return this.http.post<{
    error: any;
    data: {
      token: string;
      user: {
        id: string;
        name: string;
        email: string;
        isAdmin: boolean;
      };
    };
  }>(`${this.apiUrl}/login`, { email, password }).pipe(
    tap(res => {
      localStorage.setItem('token', res.data.token);

      localStorage.setItem(
        'userId',
        res.data.user.id
      );

      localStorage.setItem(
        'userName',
        res.data.user.name
      );

      localStorage.setItem(
        'email',
        res.data.user.email
      );

      localStorage.setItem(
        'isAdmin',
        res.data.user.isAdmin.toString()
      );

      this.isLoggedIn.set(true);
    })
  );
}

  register(
    name: string,
    email: string,
    password: string
  ): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, {
      name,
      email,
      password,
    });
  }

  setSession(token: string, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    this.isLoggedIn.set(true);
    this.router.navigate(['/recipes']);
  }

  logout() {
    localStorage.clear();
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  get isAdmin(): boolean {
  return localStorage.getItem('isAdmin') === 'true';
}

  get userId(): string | null {
    return localStorage.getItem('userId');
  }
canEditRecipe(recipe: Recipe): boolean {
  const userId = localStorage.getItem('userId');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!userId) return false;

  if (isAdmin) return true;

  const authorId =
    typeof recipe.author === 'string'
      ? recipe.author
      : recipe.author?._id;

  return authorId === userId;
}

  getUser(): { id: string; isAdmin: boolean } | null {
    const id = localStorage.getItem('userId');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    if (!id) return null;

    return { id, isAdmin };
  }
}