import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public prefersDarkMode = signal(true);
  private darkModeChangedManually: boolean = false;

  constructor() {
    this.prefersDarkMode.set(window.matchMedia('(prefers-color-scheme: dark)').matches);
    this.updateTheme();
    this.listenForChanges();
  }

  private listenForChanges() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
      if (this.darkModeChangedManually) {
        return;
      }
      this.prefersDarkMode.set(event.matches);
      this.updateTheme();
    });
  }

  updateTheme() {
    if (this.prefersDarkMode()) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }

  toggleDarkMode() {
    this.prefersDarkMode.set(!this.prefersDarkMode);
    this.darkModeChangedManually = true;
    this.updateTheme();
  }

  setDarkMode() {
    this.prefersDarkMode.set(true);
    this.darkModeChangedManually = true;
    this.updateTheme();
  }

  setLightMode() {
    this.prefersDarkMode.set(false);
    this.darkModeChangedManually = true;
    this.updateTheme();
  }

  setAutoDarkMode() {
    this.darkModeChangedManually = false;
    this.prefersDarkMode.set(window.matchMedia('(prefers-color-scheme: dark)').matches);
    this.updateTheme();
  }
}
