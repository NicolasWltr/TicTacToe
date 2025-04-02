import { AfterViewInit, Component, Input, QueryList, signal, ViewChildren } from '@angular/core';
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
  @Input() index: number = 0;
  @Input() root: boolean = false;

  @ViewChildren(FieldComponent) private fields!: QueryList<FieldComponent>;

  constructor(private gameHandler: GameHandlerService) {

  }

  ngAfterViewInit(): void {
    if (this.root) {
      this.gameHandler.setRootField(this);
    }
    // Set if the field is clickable (only for deepest field => So fields with no child fields)
    this.isClickAble.set(this.fields.length === 0);
    this.myTurn = this.gameHandler.getMyTurn();
    
    // Set the currentPlayedField to true if gameHandler currentPlayedField and indexHistory are equal or gameHandler currentPlayedField is empty (which means player can click any field)
    let currentPlayed = this.gameHandler.getCurrentPlayedField();
    if (currentPlayed.length === 0) this.currentPlayedField.set(true);
    else this.currentPlayedField.set(this.gameHandler.arraysEqual(this.indexHistory, currentPlayed));
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
