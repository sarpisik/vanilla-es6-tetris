export default class Arena {
  constructor(columns, rows) {
    this.canvas = document.getElementById('tetris');
    this.context = this.canvas.getContext('2d');
    this.context.scale(20, 20);
    this.columns = columns;
    this.rows = rows;
    this.matrix = this.createMatrix();
    this.colors = [
      null,
      '#FF0D72',
      '#0DC2FF',
      '#0DFF72',
      '#F538FF',
      '#FF8E0D',
      '#FFE138',
      '#3877FF'
    ];
  }

  createMatrix = () => {
    const matrix = [];
    while (this.rows--) {
      matrix.push(new Array(this.columns).fill(0));
    }
    return matrix;
  };

  draw = player => {
    this.context.fillStyle = '#000';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawMatrix(this.matrix, { x: 0, y: 0 });
    this.drawMatrix(player.matrix, player.pos);
  };

  drawMatrix = (matrix, offset) => {
    let self = this;

    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          self.context.fillStyle = this.colors[value];
          self.context.fillRect(x + offset.x, y + offset.y, 1, 1);
        }
      });
    });
  };

  sweep = () => {
    self = this;

    let rowCount = 0,
      points = 0;

    outer: for (let row = self.matrix.length - 1; row > 0; --row) {
      for (let cell = 0; cell < self.matrix[row].length; ++cell) {
        if (self.matrix[row][cell] === 0) {
          continue outer;
        }
      }

      const newRow = self.matrix.splice(row, 1)[0].fill(0);
      self.matrix.unshift(newRow);
      ++row;

      rowCount++;
      points += rowCount * 10;
    }
    return [rowCount, points];
  };
}
