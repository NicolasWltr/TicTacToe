import { Injectable, QueryList, signal, WritableSignal } from '@angular/core';
import { FieldComponent } from '../../game/field/field.component';
import { MenuHandlerService } from '../menuHandler/menu-handler.service';

@Injectable({
  providedIn: 'root'
})
export class GameHandlerService {
  private depth = 2;
  private gameState: WritableSignal<any> = signal(undefined);
  private rootField: FieldComponent | null = null;
  private onDevice: boolean = true;
  
  private currentPlayedField: number[] = [];
  
  private currentPlayer: string = 'X';
  private winner: 'X' | 'O' | '/' | null = null;
  
  private sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  private menuHandler: MenuHandlerService | undefined = undefined;

  constructor() { 
    this.gameState.set(this.generateGameState(this.depth));
  }

  public setDepth(depth: number) {
    this.depth = depth;
  }

  public reloadGame() {
    this.gameState.set(this.generateGameState(this.depth));
    this.currentPlayedField = [];
    this.currentPlayer = 'X';
  }

  public getGameState(): WritableSignal<any> {
    return this.gameState;
  }

  public setRootField(field: FieldComponent) {
    this.rootField = field;
  }
  public getRootField(): FieldComponent | null {
    return this.rootField;
  }

  public getCurrentPlayedField(): number[] {
    return this.currentPlayedField;
  }

  public setMenuHandler(menuHandler: MenuHandlerService) {
    this.menuHandler = menuHandler;
  }

  // Generate a multidimensional array with given depth and empty values
  private generateGameState(depth: number): any[] | string {
    if (depth === 0) {
      return '';
    }
    return Array.from({ length: 9 }, () => this.generateGameState(depth - 1));
  }

  // Method which gets called from the fields when clicked
  public async setValue(index: number[]) {
    // Do not change if index array to change points to a filled field
    if (this.hasValue(index)) return

    // Sets the value of clicked field to the value of the current player
    this.changeGameState(index, this.currentPlayer);

    // Changes the current player to the other player
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';

    // Get all values of the clicked field except the first to get the next played field
    const [_, ...nextField] = index;
    
    // Disable all fields from beeing clicked
    this.setAllFields(this.rootField!.getFields(), false);
    // Update the current played field to [-1] so that the clicked field which is rerendered can get the currentplayed field when constructed
    this.currentPlayedField = [-1];
    
    // Check if there is any win or draw position in the gameState and change the gameState accordingly
    await this.checkWin();
    
    // Set the current played field to the nextField value so that new constructed fields can get the current played field when constructed
    this.currentPlayedField = nextField;
    // Set the current played field to true so that is can be clicked and is highlighted
    this.setFieldToTrue(nextField);
  }

  public changeGameState(index: number[], value: string) {
    // Get the current gameState and udpate the field at index array to value
    let currentState = this.gameState();
    this.gameState.set(this.updateNestedArray(currentState, index, value));
  }


  // Update the gameState at indices with the new value
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

  // Check if clicked field (index array of multidimensional array) has a value
  private hasValue(index: number[]) {
    let current = this.gameState();
    index.forEach((i: number) => {
      if (Array.isArray(current)) {
        current = current[i];
      }
    });
    return current !== '' && !Array.isArray(current);
  }

  // Set currentPlayedField value for all fields to value parameter
  // => No highlighted field and no click possible
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

  private async checkWin() {
    let changedSmth: boolean = false;

    // Check field for win or draw as long as anything has changed inside the field
    // Important so that wins in higher fields can be checked after a win in a lower field
    do {
      changedSmth = this.checkWinCondition();
      // If something has changed wait 1 second to show the single steps of won or drawn fields
      if (changedSmth) await this.sleep(1000);
    } while (changedSmth);

    // Check if the whole game is won or drawn
    if (!Array.isArray(this.gameState())) {
      if (this.gameState() === '/') this.winner = '/';
      else this.winner = this.gameState();
      this.menuHandler!.setMenuState("winner");
    }
  }

  // Rekursive function to check if any field in any depth has a win / draw position
  private checkWinCondition(index: number[] = []): boolean {
    // Get the current gameState
    let current = this.gameState();

    // Zoom into the field with index array
    index.forEach((i: number) => {
      if (Array.isArray(current)) {
        current = current[i];
      }
    });

    // Check if current has a win or draw position
    let [changed, value] = this.checkWinField(current);
    // Wenn it has win or draw position, change the gameState accordingly
    if (changed) {
      this.changeGameState(index, value);
      return true;
    }

    let changedSmth = false;

    // Rekursivly check all child fields of current for win or draw position if the child is an array (not the deepest field)
    for (let i = 0; i < current.length; i++) {
      if (Array.isArray(current[i])) {
        changedSmth = this.checkWinCondition([...index, i]) || changedSmth;
      }
    }

    return changedSmth;
  }

  private checkWinField(field: any): any {
    // Check if field is valid
    // Should not be possible to get this case but just in case
    if (field.length !== 9) return [false, null];

    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    // Check for win in single field
    for (const comb of winningCombinations) {
      const [a, b, c] = comb;
      if (field[a] && !Array.isArray(field[a]) && field[a] === field[b] && field[a] === field[c]) {
        // Return changed and winner value
        return [true, field[a]];
      }
    }

    // Check for draw in single field
    let isDraw = true;
    for (let single of field) {
      if (Array.isArray(single)) {
        isDraw = false;
        break;
      }
      if (single === '') {
        isDraw = false;
        break;
      }
    }
    
    // If draw return changed and draw value
    if (isDraw) return [true, '/'];
    
    // No Draw or win return unchanged and null value
    return [false, null];
  }

  public arraysEqual(arr1: number[], arr2: number[]): boolean {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }
}
