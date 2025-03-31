import { Component } from '@angular/core';
import { MenuHandlerService } from '../../injects/menuHandler/menu-handler.service';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  constructor(private menuHandler: MenuHandlerService) {
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
