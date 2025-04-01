import { Component, signal, WritableSignal } from '@angular/core';
import { MenuHandlerService } from '../../injects/menuHandler/menu-handler.service';
import { OnlineHandlerService } from '../../injects/onlineHandler/online-handler.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  public onlinePin: WritableSignal<string> = signal("_ _ _ 3 4 5");
  public showOnlinePin: WritableSignal<boolean> = signal(true);
  public placeHolder: WritableSignal<string> = signal("* * * * * *");
  public isOnDevice: WritableSignal<boolean> = signal(false);

  public menuState: WritableSignal<"menu" | "game" | "winner"> = signal("menu");

  constructor(private menuHandler: MenuHandlerService, private onlineHandler: OnlineHandlerService) {
    this.isOnDevice = this.menuHandler.getOnDevice();
    this.menuState = this.menuHandler.getMenuState();
  }

  toggleShow() {
    this.showOnlinePin.set(!this.showOnlinePin());
  }

  setMenu(state: "menu" | "game" | "winner") {
    this.menuHandler.setMenuState(state);
  }

  setDepth(depth: 1 | 2 | 3) {
    this.menuHandler.setDepth(depth);
  }

  setOnDevice(onDevice: boolean) {
    this.menuHandler.setOnDevice(onDevice);
  }
}