import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Router, RouterModule, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register';
import { AuthService } from '../../services/auth.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let authService: any;
  let router: Router;

  beforeEach(async () => {
    const authSpy = { register: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [RouterModule, RegisterComponent],
      providers: [provideRouter([]), { provide: AuthService, useValue: authSpy }],
    }).compileComponents();

    const fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should register and navigate on success', () => {
    authService.register.mockReturnValue(of({ message: 'OK' }));
    vi.spyOn(router, 'navigate');

    component.name = 'n';
    component.email = 'e';
    component.password = 'p';
    component.register();

    expect(authService.register).toHaveBeenCalledWith('n', 'e', 'p');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show alert on register error', () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    authService.register.mockReturnValue(throwError(() => ({ error: { message: 'x' } })));

    component.register();

    expect(alertSpy).toHaveBeenCalledWith('x');
  });
});