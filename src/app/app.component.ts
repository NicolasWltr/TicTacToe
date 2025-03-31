import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { ThemeService } from './injects/theme/theme.service';
import { GameComponent } from "./game/game.component";
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [
    // RouterOutlet,
    GameComponent,
    GameComponent,
    HeaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'TicTacToe';

  constructor(private theme: ThemeService) {

  }
}
