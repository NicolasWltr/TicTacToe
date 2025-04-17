import { AfterViewInit, Component, ElementRef, HostListener, ViewChild, WritableSignal } from '@angular/core';
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
export class GameComponent implements AfterViewInit{
  //Root Field
  @ViewChild('field') field!: FieldComponent;
  @ViewChild('game') game!: ElementRef;
  @ViewChild('size') size!: ElementRef;

  //GameState to be passed to field
  gameState: WritableSignal<any>;
  isVisible: WritableSignal<boolean>;

  constructor(private gameHandler: GameHandlerService, public menuHandler: MenuHandlerService) {
    //Get the gameState
    this.gameState = this.gameHandler.getGameState();
    this.isVisible = this.gameHandler.getGameVisible();
  }

  ngAfterViewInit(): void {
      this.resizeGame();
  }

  resizeGame() {
    let width = this.size.nativeElement.offsetWidth;
    let height = this.size.nativeElement.offsetHeight;
    let size = Math.min(width, height);

    this.game.nativeElement.style.maxWidth = size + "px";
    this.game.nativeElement.style.maxHeight = size + "px";

    if (size < 300) this.menuHandler.setMaxDepth(1);
    if (size >= 300) this.menuHandler.setMaxDepth(2);
    if (size >= 700) this.menuHandler.setMaxDepth(3);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.resizeGame();
  }

  setMenu(state: "menu" | "game" | "winner") {
    this.menuHandler.setMenuState(state);
  }
}