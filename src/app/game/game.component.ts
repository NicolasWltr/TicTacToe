import { AfterViewInit, Component, ViewChild, WritableSignal } from '@angular/core';
import { FieldComponent } from "./field/field.component";
import { GameHandlerService } from '../injects/gameHandler/game-handler.service';
import { MenuComponent } from './menu/menu.component';
import { WinnerScreenComponent } from "./winner-screen/winner-screen.component";
import { MenuHandlerService } from '../injects/menuHandler/menu-handler.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game',
  imports: [
    CommonModule,
    FieldComponent,
    MenuComponent,
    WinnerScreenComponent,
    WinnerScreenComponent
],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {
  //Root Field
  @ViewChild('field') field!: FieldComponent;

  //GameState to be passed to field
  gameState: WritableSignal<any>;


  constructor(private gameHandler: GameHandlerService, public menuHandler: MenuHandlerService) {
    //Get the gameState
    this.gameState = this.gameHandler.getGameState();
  }

  setMenu(state: "menu" | "game" | "winner") {
    this.menuHandler.setMenuState(state);
  }

  setDepth(depth: 1 | 2 | 3) {
    this.menuHandler.setDepth(depth);
  }
}