import { Injectable, signal } from '@angular/core';

const themes = ['light', 'dark'] as const
export type Theme = typeof themes[number]

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  theme = signal<Theme>('light')

  constructor() {
    const storedTheme = localStorage.getItem('MTT-THEME')
    if(storedTheme)
      this.theme.set(storedTheme as Theme)
  }
  setTheme(theme: Theme) {
    this.theme.set(theme)
    localStorage.setItem('MTT-THEME', theme)
  }
}
