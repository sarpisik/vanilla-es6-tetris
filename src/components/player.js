import randomCreatedPiece from './pieces';

export default class Player {
  constructor() {
    this.pos = { x: 0, y: 0 };
    this.matrix = null;
    this.score = 0;
    this.clearedRows = 0;
    this.level = 0;
  }

  reset = arena => {
    this.matrix = randomCreatedPiece();
    this.pos.y = 0;
    this.pos.x =
      ((arena[0].length / 2) | 0) - ((this.matrix[0].length / 2) | 0);
  };

  clear = () => {
    this.score = 0;
    this.level = 0;
    this.clearedRows = 0;
  };
}
