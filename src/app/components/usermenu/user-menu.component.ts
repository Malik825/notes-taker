import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  imports: [CommonModule]
})
export class UserMenuComponent {
  // Accept showMenu as an input and sync with internal signal
  @Input() set showMenu(value: boolean) {
    this._showMenu.set(value); // Update internal signal
  }
  private _showMenu = signal(false); // Internal signal to manage state
  get showMenu() { return this._showMenu(); } // Getter for template binding

  @Output() toggle = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Output() changePassword = new EventEmitter<void>();

  constructor(public auth: AuthService, private router: Router) {}

  user() {
    return this.auth.currentUser();
  }

  onToggle() {
        this._showMenu.update(value => !value); // Update signal

  }

  onLogout() {
    this.logout.emit(); // Emit event to let parent handle logout
    this.auth.logout();
    this._showMenu.set(false); // Close menu after logout
    this.router.navigate(['/welcome']);
  }

  onChangePassword() {
    this.changePassword.emit(); // Emit event to let parent handle password change
    alert('Change password modal will open');
  }
}