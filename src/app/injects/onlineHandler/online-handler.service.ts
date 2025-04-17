import { Injectable, isDevMode } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { GameHandlerService } from '../gameHandler/game-handler.service';
import { MenuHandlerService } from '../menuHandler/menu-handler.service';

@Injectable({
  providedIn: 'root'
})
export class OnlineHandlerService {
  private socket: Socket;
  private clientId: string = "";
  private gameId: string = "";
  private isX: string = "";

  private menuHandler: MenuHandlerService | undefined = undefined;

  constructor(private gameHandler: GameHandlerService) {
    this.gameHandler.setOnlineHandler(this);

    this.socket = isDevMode() ? io('http://localhost:3000/tictactoe/api') : io('https://games.walternicolas.de/tictactoe/api');
    
    this.socket.on('connected', (data: { clientId: string }) => {
      this.clientId = data.clientId;
      console.log('Connected to server:', this.clientId);
    });

    this.socket.on('gameError', (data: { message: string }) => {
      alert(data.message);
    });

    this.socket.on('initUpdate', (data: { gameId: string, gameState: { state: any, isX: string, turn: string, played: number[], lastMove: number[] }}) => {
      this.gameId = data.gameId;
      this.menuHandler?.setOnlinePin(this.gameId);
      this.resolveGameState(data.gameState);
      this.menuHandler?.setMenuStateOnly("game");
      this.isX = data.gameState.isX;
    });
    
    this.socket.on('update', (data: { gameState: { state: any, isX: string, turn: string, played: number[], lastMove: number[] }}) => {
      this.isX = data.gameState.isX;
      this.resolveGameState(data.gameState);
      this.menuHandler?.setMenuStateOnly("game");
    });
  }

  public setMenuHandler(menuHandler: MenuHandlerService) {
    this.menuHandler = menuHandler;
  }

  public createGame() {
    this.gameHandler.setDepth(this.menuHandler!.getDepth()());
    this.gameHandler.setOnDevice(false);
    this.gameHandler.reloadGame();

    this.isX = this.clientId;

    this.socket.emit('joinGame', { 
      "gameState": {
        "state": this.gameHandler.getGameState()(),
        "isX": this.isX,
        "turn": this.gameHandler.getPlayerTurn(),
        "played": this.gameHandler.getCurrentPlayedField(),
        "lastMove": this.gameHandler.getLastMove()()
      }
    });
  }

  public joinGame(gameId: string) {
    this.socket.emit('joinGame', { 
      "gameId": gameId
    });
  }

  public updateGame() {
    this.socket.emit('updateGameState', {
      "gameId": this.gameId,
      "gameState": {
        "state": this.gameHandler.getGameState()(),
        "isX": this.isX,
        "turn": this.gameHandler.getPlayerTurn(),
        "played": this.gameHandler.getCurrentPlayedField(),
        "lastMove": this.gameHandler.getLastMove()()
      }
    })
  }
  
  public restartGame() {
    this.isX = this.clientId;
    this.socket.emit('updateGameState', {
      "gameId": this.gameId,
      "gameState": {
        "state": this.gameHandler.getGameState()(),
        "isX": this.isX,
        "turn": this.gameHandler.getPlayerTurn(),
        "played": this.gameHandler.getCurrentPlayedField(),
        "lastMove": this.gameHandler.getLastMove()()
      }
    })
  }

  public leaveGame() {
    this.socket.emit('leaveGame', {});
  }

  public getClientId(): string {
    return this.clientId;
  }

  private resolveGameState(gameState: { state: any, isX: string, turn: string, played: number[], lastMove: number[] }) {
    this.gameHandler.setGameState(gameState.state);
    this.gameHandler.setCurrentPlayedField(gameState.played);
    this.gameHandler.setCurrentPlayer(gameState.isX === this.clientId ? "X" : "O");
    this.gameHandler.setPlayerTurn(gameState.turn);
    this.gameHandler.setOnDevice(false);
    this.gameHandler.setLastMove(gameState.lastMove);
  }
}
