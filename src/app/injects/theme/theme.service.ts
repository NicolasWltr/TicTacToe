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

  //Listen for changes in the system dark mode settings and update the theme if changed
  private listenForChanges() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
      if (this.darkModeChangedManually) {
        return;
      }
      this.prefersDarkMode.set(event.matches);
      this.updateTheme();
    });
  }

  //Add light or dark to body class list so that the css variables for the color are changed to acording theme
  updateTheme() {
    if (this.prefersDarkMode()) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }

  //Methods below not beeing used atm as no UI is implemented yet
  // => Theme is always set to system default
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
