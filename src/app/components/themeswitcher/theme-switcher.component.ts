import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, AppTheme } from '../../services/theme.service'; // ✅ <-- include AppTheme

@Component({
  selector: 'app-theme-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss']
})
export class ThemeSwitcherComponent {
  themes: AppTheme[] = ['light', 'dark', 'sunset',  'cloud', 'forest', 'ocean', 'strawberry'];

  constructor(public themeService: ThemeService) {}

  changeTheme(event: Event) {
    const selected = (event.target as HTMLSelectElement).value as AppTheme;
    this.themeService.setTheme(selected);
  }
}

