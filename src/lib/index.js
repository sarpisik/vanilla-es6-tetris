export const isCollided = (
  arena,
  { pos: playerPosition, matrix: playerMatrix }
) => {
  for (let row = 0; row < playerMatrix.length; ++row) {
    for (let cell = 0; cell < playerMatrix[row].length; ++cell) {
      if (
        playerMatrix[row][cell] !== 0 &&
        (arena[row + playerPosition.y] &&
          arena[row + playerPosition.y][cell + playerPosition.x]) !== 0
      ) {
        return true;
      }
    }
  }
  return false;
};

export const merge = (arena, { pos: playerPosition, matrix: playerMatrix }) => {
  playerMatrix.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell !== 0) {
        arena[y + playerPosition.y][x + playerPosition.x] = cell;
      }
    });
  });
};

export const rotate = (matrix, dir) => {
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }

  if (dir > 0) {
    matrix.forEach(row => row.reverse());
  } else {
    matrix.reverse();
  }
};

export const itemColors = [
  null,
  '255, 13, 114',
  '13, 194, 255',
  '13, 255, 114',
  '245, 56, 255',
  '255, 142, 13',
  '255, 225, 56',
  '56, 119, 255'
];
