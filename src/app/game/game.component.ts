import { AfterContentChecked, AfterViewInit, Component, ViewChild } from '@angular/core';
import { FieldComponent } from "../components/field/field.component";
import { GameHandlerService } from '../injects/gameHandler/game-handler.service';

@Component({
  selector: 'app-game',
  imports: [
    FieldComponent
],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements AfterViewInit{
  @ViewChild('field') field!: FieldComponent;

  gameState: any;

  constructor(private gameHandler: GameHandlerService) {
    this.gameState = this.gameHandler.getGameState();
  }

  ngAfterViewInit(): void {
    this.gameHandler.setRootField(this.field);
  }
}