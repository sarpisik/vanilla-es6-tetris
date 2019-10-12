export default class NextItem {
  constructor(colors) {
    this.element = document.querySelector('.next-item');
    this.squares = createSquares(this.element);
    this.colors = colors;
    this.cellLimit = 3;
  }

  drawNextItem = item => {
    let self = this;
    self.resetBackground();
    item.forEach((row, y) => {
      // If item has longer row than board row, skip row.
      if (y >= self.cellLimit) return;
      row.forEach((col, x) => {
        // If item has more cell than board cell, skip cell.
        if (x >= self.cellLimit) return;
        // Else draw.
        const boardCell = self.squares[y][x],
          // If current cell is item cell, change background.
          // Else, make black background.
          backgroundColor = col > 0 ? self.colors[col] : '0,0,0';
        boardCell.changeBackgroundColor(backgroundColor);
      });
    });
  };

  resetBackground = () => this.squares.forEach(setBackgroundBlack);
}

class Square {
  constructor(parent) {
    this.element = document.createElement('div');
    parent.appendChild(this.element);
  }

  changeBackgroundColor = color =>
    (this.element.style.backgroundColor = `rgb(${color})`);
}

function createSquares(parent) {
  let squares = [[], [], []],
    cellLimit = 3;

  squares.map(row => {
    for (let i = 0; i < cellLimit; i++) {
      row.push(new Square(parent));
    }
  });
  return squares;
}

function setBackgroundBlack(row) {
  row.forEach(square => square.changeBackgroundColor('0,0,0'));
}
