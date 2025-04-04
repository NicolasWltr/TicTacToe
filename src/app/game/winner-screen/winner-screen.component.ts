import { Component, signal, WritableSignal } from '@angular/core';
import { GameHandlerService } from '../../injects/gameHandler/game-handler.service';
import { CommonModule } from '@angular/common';
import { MenuHandlerService } from '../../injects/menuHandler/menu-handler.service';
import { OnlineHandlerService } from '../../injects/onlineHandler/online-handler.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-winner-screen',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './winner-screen.component.html',
  styleUrl: './winner-screen.component.scss'
})
export class WinnerScreenComponent {
  public depth: 1 | 2 | 3 = 1;
  public winner: WritableSignal<'X' | 'O' | '/' | null>;
  public newGameSelected: WritableSignal<boolean> = signal(false);
  public maxDepth: WritableSignal<1 | 2 | 3>;

  constructor(private gameHandler: GameHandlerService, private menuHandler: MenuHandlerService, private onlineHandler: OnlineHandlerService) {
    this.winner = gameHandler.getWinner();
    this.maxDepth = this.menuHandler.getMaxDepth() 
  }

  newGame() {
    if (this.maxDepth() > 1) {
      this.newGameSelected.set(true);
    } else {
      if (this.depth > this.maxDepth()) {
        this.depth = this.maxDepth();
      }
      this.createNewGame();
    }
  }

  createNewGame() {
    if (this.depth > this.maxDepth()) {
      this.depth = this.maxDepth();
    }

    this.newGameSelected.set(false);

    this.menuHandler.setDepth(this.depth);
    this.gameHandler.reloadGame();
    this.menuHandler.setMenuState('game');
    if (!this.menuHandler.getOnDevice()()) this.onlineHandler.restartGame();
  }

  goToMenu() {
    this.menuHandler.setMenuState('menu');
  }
}
