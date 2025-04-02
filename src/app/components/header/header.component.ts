import { Component, signal, WritableSignal } from '@angular/core';
import { MenuHandlerService } from '../../injects/menuHandler/menu-handler.service';
import { CommonModule } from '@angular/common';
import { GameHandlerService } from '../../injects/gameHandler/game-handler.service';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  public onlinePin: WritableSignal<string>;
  public showOnlinePin: WritableSignal<boolean> = signal(true);
  public placeHolder: WritableSignal<string> = signal("* * * * * *");
  public isOnDevice: WritableSignal<boolean> = signal(false);
  public myTurn: WritableSignal<boolean>;

  public menuState: WritableSignal<"menu" | "game" | "winner"> = signal("menu");

  constructor(private menuHandler: MenuHandlerService, private gameHandler: GameHandlerService) {
    this.isOnDevice = this.menuHandler.getOnDevice();
    this.menuState = this.menuHandler.getMenuState();
    this.onlinePin = this.menuHandler.getOnlinePin();
    this.myTurn = this.gameHandler.getMyTurn();
  }

  toggleShow() {
    this.showOnlinePin.set(!this.showOnlinePin());
  }

  setMenu(state: "menu" | "game" | "winner") {
    this.menuHandler.setMenuState(state);
  }
}