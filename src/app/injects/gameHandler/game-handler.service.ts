import { Injectable, QueryList, signal } from '@angular/core';
import { FieldComponent } from '../../components/field/field.component';

@Injectable({
  providedIn: 'root'
})
export class GameHandlerService {
  private depth = 2;
  private gameState: any = signal(undefined);
  private rootField: FieldComponent | null = null;

  private onGoing = false;

  private currentPlayer: string = 'X';

  constructor() { 
    this.gameState.set(this.generateGameState(this.depth));
  }

  public getGameState(): any {
    return this.gameState;
  }

  public setOnGoingFalse() {
    this.onGoing = false;
  }

  setRootField(field: FieldComponent) {
    this.rootField = field;
  }

  private generateGameState(depth: number): any[] | string {
    // return [
    //   ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], 'X',
    //   ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''],
    //   ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''], ['', '', '', '', '', '', '', '', ''],
    // ]
    if (depth === 0) {
      return '';
    }
    return Array.from({ length: 9 }, () => this.generateGameState(depth - 1));
  }

  public async changeGameState(index: number[]) {
    this.onGoing = true;
    let currentState = this.gameState();
    this.gameState.set(this.updateNestedArray(currentState, index, this.currentPlayer));
    
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';

    const [_, ...nextField] = index;

    await this.onGoingDone(() => this.onGoing);

    this.setAllFields(this.rootField!.getFields(), false);
    this.setFieldToTrue(nextField);
  }

  onGoingDone(variable: () => boolean): Promise<void> {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!variable()) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    })
  }

  private updateNestedArray(array: any[], indices: number[], newValue: any): any[] {
    if (indices.length === 0) {
      return newValue;
    }
  
    const [currentIndex, ...remainingIndices] = indices;
  
    if (!Array.isArray(array) || currentIndex >= array.length) {
      throw new Error("Invalid indices or array structure");
    }
  
    const updatedArray = [...array];
    updatedArray[currentIndex] = this.updateNestedArray(
      updatedArray[currentIndex],
      remainingIndices,
      newValue
    );
  
    return updatedArray;
  }

  private setAllFields(field: QueryList<FieldComponent>, value: boolean): void {
    field.forEach((child: FieldComponent) => {
      child.setCurrentPlayedField(value);
      this.setAllFields(child.getFields(), value);
    });
  }

  private setFieldToTrue(index: number[]): void {
    let current = this.rootField!;
    index.forEach((i: number) => {
      let tmp = current.getFields();
      let found = false;
      tmp.forEach((child: FieldComponent) => {
        if (child.index === i) {
          found = true;
          current = child;
        }
      });
      if (!found) {
        this.setAllFields(this.rootField!.getFields(), true);
      }
    });

    current.setCurrentPlayedField(true);
  }
}
