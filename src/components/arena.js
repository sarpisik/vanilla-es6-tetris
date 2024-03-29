export default class Arena {
  constructor(columns, rows, colors) {
    this.canvas = document.getElementById('tetris');
    this.context = this.canvas.getContext('2d');
    // Size of the cells
    this.context.scale(20, 20);
    this.columns = columns;
    this.rows = rows;
    this.matrix = this.createMatrix();
    this.colors = colors;
    this.mergedItemColor = '198,177,199';
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
    // Draw arena.
    this.drawMatrix(this.matrix, { x: 0, y: 0 });
    // Draw item.
    this.drawMatrix(player.matrix, player.pos, true);
  };

  drawMatrix = (matrix, offset, isPlayerItem = false) => {
    let self = this;

    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          // If this is player's item, set colored background.
          // Else, set merged item color.
          const color = isPlayerItem
            ? this.colors[value]
            : this.mergedItemColor;
          // Square color.
          self.context.fillStyle = `rgba(${color}, 0.8)`;
          self.context.fillRect(x + offset.x, y + offset.y, 1, 1);
          // Border color.
          let gradient = self.context.createLinearGradient(0, 0, 1, 1);
          gradient.addColorStop('0', `rgba(${color}, 0.3)`);
          gradient.addColorStop('1.0', `rgba(${color}, 1)`);
          self.context.strokeStyle = gradient;
          self.context.lineWidth = 0.1;
          self.context.strokeRect(x + offset.x, y + offset.y, 1, 1);
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
