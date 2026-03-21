import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { expect, vi } from 'vitest';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let mockRouter: Partial<Router>;

  beforeEach(() => {
    localStorage.clear();
    mockRouter = {
      navigate: vi.fn(),
    };
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: mockRouter }, provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store token/user data in localStorage', () => {
    const fakeResponse = {
      error: null,
      data: {
        token: '12345',
        user: { id: 'u1', name: 'Test User', email: 'test@example.com' },
      },
    };

    service.login('test@example.com', 'secret').subscribe((res) => {
      expect(res).toEqual(fakeResponse);
      expect(localStorage.getItem('token')).toBe('12345');
      expect(localStorage.getItem('userId')).toBe('u1');
      expect(localStorage.getItem('userName')).toBe('Test User');
    });

    const req = httpMock.expectOne('/api/user/login');
    expect(req.request.method).toBe('POST');
    req.flush(fakeResponse);
  });

  it('should set session and navigate to /recipes', () => {
    service.setSession('tok', 'id-1');

    expect(localStorage.getItem('token')).toBe('tok');
    expect(localStorage.getItem('userId')).toBe('id-1');
    expect(service.isLoggedIn()).toBeTruthy();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/recipes']);
  });

  it('should logout and navigate to /login', () => {
    service.setSession('tok', 'id-1');
    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(service.isLoggedIn()).toBeFalsy();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('getToken should return token from localStorage', () => {
    localStorage.setItem('token', 'abc');
    expect(service.getToken()).toBe('abc');
  });
});
