import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Router } from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let authService: { getToken: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(() => {
    authService = {
      getToken: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: Router,
          useValue: {
            navigate: vi.fn(),
          },
        },
      ],
    });

    router = TestBed.inject(Router);
  });

  it('should return true, When token exists', () => {
    authService.getToken.mockReturnValue('token');

    const result = TestBed.runInInjectionContext(() =>
      authGuard(
        {} as unknown as Parameters<typeof authGuard>[0],
        {} as unknown as Parameters<typeof authGuard>[1]
      )
    );

    expect(authService.getToken).toHaveBeenCalled();
    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to login and return false, When token does not exist', () => {
    authService.getToken.mockReturnValue(null);

    const result = TestBed.runInInjectionContext(() =>
      authGuard(
        {} as unknown as Parameters<typeof authGuard>[0],
        {} as unknown as Parameters<typeof authGuard>[1]
      )
    );

    expect(authService.getToken).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(result).toBe(false);
  });
});