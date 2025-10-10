import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {}

  /**
   * Logout user and redirect to login page
   */
  logout(): void {
    // Clear any stored authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    sessionStorage.clear();
    
    // Redirect to login page
    this.router.navigate(['/auth/login']);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  /**
   * Get current user
   */
  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
