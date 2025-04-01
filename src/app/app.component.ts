import { Component, isDevMode } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { ThemeService } from './injects/theme/theme.service';
import { GameComponent } from "./game/game.component";
import { HeaderComponent } from './components/header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    // RouterOutlet,
    GameComponent,
    GameComponent,
    HeaderComponent,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'TicTacToe';

  dev = isDevMode;

  constructor(private theme: ThemeService) {
  }
}
