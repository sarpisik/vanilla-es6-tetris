import randomCreatedPiece from './pieces';

export default class Player {
  constructor() {
    this.pos = { x: 0, y: 0 };
    // Generate random items.
    this.matrixes = [randomCreatedPiece(), randomCreatedPiece()];
    this.score = 0;
    this.clearedRows = 0;
    this.level = 0;
  }

  reset = arena => {
    this.matrix = this.matrixes[0];
    this.nextMatrix = this.matrixes[1];
    // Locate item vertical top.
    this.pos.y = 0;
    // Center item horizontal.
    this.pos.x =
      ((arena[0].length / 2) | 0) - ((this.matrix[0].length / 2) | 0);

    // Create next item.
    this.matrixes.push(randomCreatedPiece());
    // Remove prev item.
    this.matrixes.shift();
  };

  clear = () => {
    this.score = 0;
    this.level = 0;
    this.clearedRows = 0;
  };
}
