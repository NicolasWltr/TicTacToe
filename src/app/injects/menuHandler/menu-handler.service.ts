import { Injectable, signal, WritableSignal } from '@angular/core';
import { GameHandlerService } from '../gameHandler/game-handler.service';
import { OnlineHandlerService } from '../onlineHandler/online-handler.service';

@Injectable({
  providedIn: 'root'
})
export class MenuHandlerService {
  private onDevice: WritableSignal<boolean> = signal(true);
  private depth: WritableSignal<1 | 2 | 3> = signal(2);
  private onlinePin: WritableSignal<string> = signal("");

  private menuState: WritableSignal<"menu" | "game" | "winner"> = signal("menu");

  constructor(private gameHandler: GameHandlerService, private onlineHandler: OnlineHandlerService) { 
    this.gameHandler.setMenuHandler(this);
    this.onlineHandler.setMenuHandler(this);
  }

  public setOnDevice(onDevice: boolean) {
    this.onDevice.set(onDevice);
  }
  public getOnDevice(): WritableSignal<boolean> {
    return this.onDevice;
  }

  public setDepth(depth: 1 | 2 | 3) {
    this.depth.set(depth);
  }
  public getDepth(): WritableSignal<1 | 2 | 3> {
    return this.depth;
  }

  public setOnlinePin(pin: string) {
    this.onlinePin.set(pin);
  }
  public getOnlinePin(): WritableSignal<string> {
    return this.onlinePin;
  }

  public setMenuState(state: "menu" | "game" | "winner") {
    if (state === "game") {
      this.gameHandler.setDepth(this.depth());
      this.gameHandler.setOnDevice(this.onDevice());
      this.gameHandler.setCurrentPlayer('X');
      this.gameHandler.setPlayerTurn('X');
      this.gameHandler.reloadGame();
    }
    this.menuState.set(state);
  }

  public setMenuStateOnly(state: "menu" | "game" | "winner") {
    this.menuState.set(state);
  }

  public getMenuState(): WritableSignal<"menu" | "game" | "winner"> {
    return this.menuState;
  }
}
