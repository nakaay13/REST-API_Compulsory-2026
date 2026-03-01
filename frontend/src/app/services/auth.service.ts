import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface LoginResponse {
  error: any;
  data: {
    token: string;
    user: { id: string; name: string; email: string };
  };
}

interface RegisterResponse {
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:4000/api/user';

  isLoggedIn = signal<boolean>(!!localStorage.getItem('token'));

  constructor(private http: HttpClient, private router: Router) {}

login(email: string, password: string) {
  return this.http.post<{
    error: any;
    data: { token: string; user: { id: string; name: string; email: string } }
  }>('http://localhost:4000/api/user/login', { email, password }).pipe(
    tap(res => {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user.id);
      localStorage.setItem('userName', res.data.user.name); // ✅ store real name
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
}