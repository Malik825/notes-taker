import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService, AppTheme } from '../../services/theme.service'; // ✅ Import AppTheme
import { ThemeSwitcherComponent } from '../themeswitcher/theme-switcher.component';
import { UserMenuComponent } from "../usermenu/user-menu.component";
import { User } from '../../models/auth.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ThemeSwitcherComponent, UserMenuComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() authRequested = new EventEmitter<'signin' | 'signup'>();

  showMenu = signal(false); // Changed to signal<boolean>
  user = signal<User | null>(null); // Initialize with null, set in constructor
  themes: AppTheme[] = ['light', 'dark', 'sunset', 'night']; // ✅ Use AppTheme

  constructor(
    private auth: AuthService,
    private router: Router,
    public themeService: ThemeService // make public if you want to bind `currentTheme`
  ) {
    // Set initial user state from AuthService
    this.user.set(this.auth.currentUser());
    // Subscribe to auth changes to keep user signal updated
    this.auth.currentUserObservable.subscribe(user => {
      this.user.set(user);
      console.log('[Header] User updated:', user);
    });
  }

 

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  selectTheme(theme: AppTheme) {
    this.themeService.setTheme(theme);
  }

  onThemeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedTheme = target.value as AppTheme;
    this.selectTheme(selectedTheme);
  }
}