import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { RouterModule, provideRouter } from '@angular/router';
import { LoginComponent } from './login';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let authService: any;

  beforeEach(async () => {
    const authSpy = { login: vi.fn(), setSession: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [RouterModule, LoginComponent],
      providers: [provideRouter([]), { provide: AuthService, useValue: authSpy }],
    }).compileComponents();

    const fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login successfully and call setSession', () => {
    const data = { data: { token: 'test', user: { id: 'u1', name: 'User', email: 'a@b' } } };
    authService.login.mockReturnValue(of(data as any));

    component.email = 'a@b.com';
    component.password = 'pass';
    component.login();

    expect(authService.login).toHaveBeenCalledWith('a@b.com', 'pass');
    expect(authService.setSession).toHaveBeenCalledWith('test', 'u1');
  });

  it('should set error on login failure', () => {
    authService.login.mockReturnValue(throwError(() => ({ error: { message: 'bad' } })));

    component.login();

    expect(component.error).toBe('bad');
  });
});