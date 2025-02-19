import { Component } from '@angular/core';
import { AuthService } from '../login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.username && this.password) {
      this.authService.login(this.username, this.password).subscribe(
        (response: any) => {
          this.successMessage = response.message;
          localStorage.setItem('token', response.token); // Save JWT token in localStorage
          this.router.navigate(['/dash']); // Navigate to the dashboard or homepage after successful login
        },
        (error) => {
          this.errorMessage = error.error.message || 'Login failed';
        }
      );
    } else {
      this.errorMessage = 'Please enter both username and password';
    }
  }

}
