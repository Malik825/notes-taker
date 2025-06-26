import { Injectable } from '@angular/core';

export type AppTheme = 'light' | 'dark' | 'sunset' | 'night' | 'cloud' | 'forest' | 'ocean' | 'strawberry';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly THEME_KEY = 'app-theme';
  private readonly ACCENT_COLOR_KEY = 'accent-color';
  private readonly themes: AppTheme[] = ['light', 'dark', 'sunset', 'night', 'cloud', 'forest', 'ocean', 'strawberry'];

  private current: AppTheme = 'light';

  constructor() {
    const savedTheme = localStorage.getItem(this.THEME_KEY) as AppTheme;
    const initialTheme = this.themes.includes(savedTheme) ? savedTheme : 'light';
    this.setTheme(initialTheme);

    // Reapply saved accent color if exists
    const savedAccent = localStorage.getItem(this.ACCENT_COLOR_KEY);
    if (savedAccent) {
      document.documentElement.style.setProperty('--accent-color', savedAccent);
    }
  }

  setTheme(theme: AppTheme): void {
    this.themes.forEach(t => document.body.classList.remove(`${t}-theme`));
    document.body.classList.add(`${theme}-theme`);

    this.current = theme;
    localStorage.setItem(this.THEME_KEY, theme);
  }

  get currentTheme(): AppTheme {
    return this.current;
  }

  toggleTheme(): void {
    const currentIndex = this.themes.indexOf(this.current);
    const nextIndex = (currentIndex + 1) % this.themes.length;
    this.setTheme(this.themes[nextIndex]);
  }
}
