import { AfterViewInit, Component, Input, QueryList, signal, ViewChildren, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameHandlerService } from '../../injects/gameHandler/game-handler.service';

@Component({
  selector: 'app-field',
  imports: [
    CommonModule,
    FieldComponent
  ],
  templateUrl: './field.component.html',
  styleUrl: './field.component.scss'
})
export class FieldComponent implements AfterViewInit{
  private currentPlayedField = signal(false);
  private isClickAble = signal(true);
  private myTurn = signal(true);
  
  @Input() gameState: any;
  @Input() indexHistory: number[] = [];
  @Input() index: number = -1;
  @Input() root: boolean = false;
  
  public afterInit = signal(false);
  public lastMove: WritableSignal<number[]> = signal([0, 1]);

  @ViewChildren(FieldComponent) private fields!: QueryList<FieldComponent>;

  constructor(private gameHandler: GameHandlerService) { }

  ngAfterViewInit(): void {
    if (this.root) {
      this.gameHandler.setRootField(this);
    }
    // Set if the field is clickable (only for deepest field => So fields with no child fields)
    this.isClickAble.set(this.fields.length === 0);
    this.myTurn = this.gameHandler.getMyTurn();

    this.lastMove = this.gameHandler.getLastMove();
    
    // Set the currentPlayedField to true if gameHandler currentPlayedField and indexHistory are equal or gameHandler currentPlayedField is empty (which means player can click any field)
    let currentPlayed = this.gameHandler.getCurrentPlayedField();
    if (currentPlayed.length === 0) this.currentPlayedField.set(true);
    else this.currentPlayedField.set(this.gameHandler.arraysEqual(this.indexHistory, currentPlayed));

    this.afterInit.set(true);
  }

  public getCurrentPlayedField() {
    return this.currentPlayedField;
  }

  public setCurrentPlayedField(value: boolean): void {
    this.currentPlayedField.set(value);
  }

  public getIsClickAble() {
    return this.isClickAble;
  }
  
  public getFields(): QueryList<FieldComponent> {
    return this.fields;
  }

  public isArray(value: any): boolean {
    return Array.isArray(value);
  }

  public lastMoveEqual(current: number): WritableSignal<boolean> {
    console.log(signal(this.gameHandler.lastMoveEqual([...this.indexHistory, current], this.lastMove()))(), [...this.indexHistory, current])
    return signal(this.gameHandler.lastMoveEqual([...this.indexHistory, current], this.lastMove()));
  }

  public setIndexHistory(index: number, history: number[]) {
    return history.concat(index);
  }

  public getMyTurn() {
    return this.myTurn;
  }

  public setValue(index: number) {
    // Check if the field is clickable
    if (!this.currentPlayedField() || !this.myTurn()) return;

    // Set the value in the gameHandler gameState
    const copy = [...this.indexHistory];
    copy.push(index);
    this.gameHandler.setValue(copy);
  }
}
