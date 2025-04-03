import { Component, signal, WritableSignal } from '@angular/core';
import { MenuHandlerService } from '../../injects/menuHandler/menu-handler.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OnlineHandlerService } from '../../injects/onlineHandler/online-handler.service';

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
  maxDepth: WritableSignal<1 | 2 | 3>;
  depth: 1 | 2 | 3 = 1;
  onDevice: WritableSignal<boolean> = signal(true);
  onlinePin: string = "";

  constructor(private menuHandler: MenuHandlerService, private onlineHandler: OnlineHandlerService) {
    this.maxDepth = this.menuHandler.getMaxDepth();
  }

  setOnDevice(onDevice: boolean) {
    this.onDevice.set(onDevice);
  }

  startGame() {
    if (this.depth > this.maxDepth()) {
      this.depth = this.maxDepth();
    }
    this.menuHandler.setDepth(this.depth);
    this.menuHandler.setOnDevice(this.onDevice());
    this.menuHandler.setMenuState("game");
  }
  
  joinGame() {
    if (this.depth > this.maxDepth()) {
      this.depth = this.maxDepth();
    }
    this.menuHandler.setDepth(this.depth);
    this.menuHandler.setOnDevice(this.onDevice());
    
    this.onlineHandler.joinGame(this.onlinePin);
  }
  
  createGame() {
    if (this.depth > this.maxDepth()) {
      this.depth = this.maxDepth();
    }
    this.menuHandler.setDepth(this.depth);
    this.menuHandler.setOnDevice(this.onDevice());

    this.onlineHandler.createGame();
  }
}
