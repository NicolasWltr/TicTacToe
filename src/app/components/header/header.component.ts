import { Component } from '@angular/core';
import { MenuHandlerService } from '../../injects/menuHandler/menu-handler.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

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
