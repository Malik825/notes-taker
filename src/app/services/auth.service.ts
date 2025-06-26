import { Injectable, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/auth.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'authToken';
  private userKey = 'currentUser';
  private usersKey = 'users';

  // Signal for direct access
  currentUser = signal<User | null>(null);

  // BehaviorSubject to emit user state changes
  private userSubject = new BehaviorSubject<User | null>(null);
  currentUserObservable = this.userSubject.asObservable();

  constructor(private toast: ToastrService) {
    const storedUser = localStorage.getItem(this.userKey);
    const token = localStorage.getItem(this.tokenKey);
    if (storedUser && token) {
      const user = JSON.parse(storedUser);
      this.currentUser.set(user);
      this.userSubject.next(user); // Initialize the subject with stored user
    }
  }

  // Register user
  register(name: string, email: string, password: string): boolean {
    const users: User[] = JSON.parse(localStorage.getItem(this.usersKey) || '[]');

    if (users.find(user => user.email === email)) {
      alert('User already exists');
      return false;
    }

    const newUser: User = {
      id: 'user_' + Math.random().toString(36).substring(2, 9),
      name,
      email,
      password
    };

    users.push(newUser);
    localStorage.setItem(this.usersKey, JSON.stringify(users));

    this.setSession(newUser);
    this.toast.success('Account created!', 'Success');
    return true;
  }

  // Login user
  login(email: string, password: string): boolean {
    const users: User[] = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    const user = users.find(user => user.email === email && user.password === password);

    if (!user) {
      alert('Invalid email or password');
      return false;
    }

    this.setSession(user);
    this.toast.success('Welcome back!', 'Login Successful');
    return true;
  }

  // Logout
  logout(): void {
    this.currentUser.set(null);
    this.userSubject.next(null); // Notify subscribers of logout
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey); // Remove only the defined userKey
    this.toast.info('You’ve been logged out', 'Goodbye!');
  }

  // Save session
  private setSession(user: User) {
    localStorage.setItem(this.tokenKey, 'mock-token');
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUser.set(user);
    this.userSubject.next(user); // Notify subscribers of user change
  }

  // Reset password placeholder
  resetPassword(email: string): boolean {
    const users: User[] = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    const user = users.find(u => u.email === email);
    return !!user;
  }
}