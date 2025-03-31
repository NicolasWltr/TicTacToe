import { Injectable, signal, WritableSignal } from '@angular/core';
import { GameHandlerService } from '../gameHandler/game-handler.service';

@Injectable({
  providedIn: 'root'
})
export class MenuHandlerService {
  private onDevice: WritableSignal<boolean> = signal(true);
  private depth: WritableSignal<1 | 2 | 3> = signal(2);

  private menuState: WritableSignal<"menu" | "game" | "winner"> = signal("game");

  constructor(private gameHandler: GameHandlerService) { 
    this.gameHandler.setMenuHandler(this);
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

  public setMenuState(state: "menu" | "game" | "winner") {
    if (state === "game") {
      this.gameHandler.setDepth(this.depth());
      this.gameHandler.reloadGame();
    }
    this.menuState.set(state);
  }
  public getMenuState(): WritableSignal<"menu" | "game" | "winner"> {
    return this.menuState;
  }
}
