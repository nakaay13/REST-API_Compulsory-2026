import { TestBed } from '@angular/core/testing';
import { RouterModule, provideRouter } from '@angular/router';
import { NavbarComponent } from './navbar';
import { AuthService } from '../../services/auth.service';

describe('NavbarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule, NavbarComponent],
      providers: [provideRouter([]), { provide: AuthService, useValue: { } }],
    }).compileComponents();
  });

  it('should display userName from localStorage', () => {
    localStorage.setItem('userName', 'Mia');
    const fixture = TestBed.createComponent(NavbarComponent);
    const component = fixture.componentInstance;

    expect(component.userName).toBe('Mia');
  });

  it('should return empty string when no userName', () => {
    localStorage.removeItem('userName');
    const fixture = TestBed.createComponent(NavbarComponent);
    const component = fixture.componentInstance;

    expect(component.userName).toBe('');
  });
});