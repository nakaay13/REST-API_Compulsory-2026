import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // 👈 ADD THIS
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule // 👈 AND REGISTER IT HERE
  ],
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService) {}

  login() {
    this.auth.login(this.email, this.password).subscribe({
      next: res => {
        this.auth.setSession(res.data.token, res.data.user.id);
      },
      error: err => {
        this.error = err.error?.message ?? 'Login failed';
      }
    });
  }
}