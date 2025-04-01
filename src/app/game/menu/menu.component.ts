import { Component, signal, WritableSignal } from '@angular/core';
import { MenuHandlerService } from '../../injects/menuHandler/menu-handler.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  maxDepth: number = 3;
  depth: 1 | 2 | 3 = 1;
  onDevice: WritableSignal<boolean> = signal(true);

  constructor(private menuHandler: MenuHandlerService) {
  }

  setOnDevice(onDevice: boolean) {
    console.log(onDevice ? "Device" : "Online");
    this.onDevice.set(onDevice);
  }

  startGame() {
    this.menuHandler.setDepth(this.depth);
    this.menuHandler.setOnDevice(this.onDevice());
    this.menuHandler.setMenuState("game");
  }
}
