import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private cleanupFn?: () => void;

  initialize(): void {
    const themeToggle = document.getElementById('theme-toggle') as HTMLInputElement | null;
    if (!themeToggle) return;

    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? true;

    let savedTheme: string | null = null;
    try {
      savedTheme = localStorage.getItem('theme');
    } catch {
      savedTheme = null;
    }

    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    if (theme === 'light') {
      document.body.classList.add('light-mode');
      themeToggle.checked = true;
    }

    const handler = () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      try {
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
      } catch {
        // ignore
      }
    };

    themeToggle.addEventListener('change', handler);
    this.cleanupFn = () => themeToggle.removeEventListener('change', handler);
  }

  cleanup(): void {
    this.cleanupFn?.();
  }
}
