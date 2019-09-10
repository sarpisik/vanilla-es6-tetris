const pieces = 'TJLOSZI';

const randomPiece = () => pieces[(pieces.length * Math.random()) | 0];

const createPiece = type => {
  switch (type) {
    case 'I':
      return [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]];
    case 'L':
      return [[0, 2, 0], [0, 2, 0], [0, 2, 2]];
    case 'J':
      return [[0, 3, 0], [0, 3, 0], [3, 3, 0]];
    case 'O':
      return [[4, 4], [4, 4]];
    case 'Z':
      return [[5, 5, 0], [0, 5, 5], [0, 0, 0]];
    case 'S':
      return [[0, 6, 6], [6, 6, 0], [0, 0, 0]];
    default:
      return [[0, 7, 0], [7, 7, 7], [0, 0, 0]];
  }
};

export default () => createPiece(randomPiece());
