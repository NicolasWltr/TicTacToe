import { AfterViewInit, Component, Input, OnInit, QueryList, signal, ViewChildren } from '@angular/core';
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
  private currentPlayedField = signal(true);
  private isClickAble = signal(true);

  @Input() gameState: any;
  @Input() indexHistory: number[] = [];
  @Input() index: number = 0;

  @ViewChildren(FieldComponent) private fields!: QueryList<FieldComponent>;

  constructor(private gameHandler: GameHandlerService) {
  }

  ngAfterViewInit(): void {
    this.gameHandler.setOnGoingFalse();
    this.isClickAble.set(this.fields.length === 0);
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

  public setValue(index: number) {
    if (!this.currentPlayedField()) return;
    const copy = [...this.indexHistory];
    copy.push(index);
    this.gameHandler.changeGameState(copy);
  }

}
