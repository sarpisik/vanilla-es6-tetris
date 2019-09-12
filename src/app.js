import Player from './components/player';
import Display from './components/display';
import Arena from './components/arena';
import Button from './components/button';

export default class Game {
  constructor() {
    // DOM elements
    this.scoreBoard = new Display('#score');
    this.levelBoard = new Display('#level');
    this.clearedRowsBoard = new Display('#clearedRows');
    this.arena = new Arena(12, 20);
    this.startButton = new Button('#start', this.handleStartButtonClick);
    this.moveLeftButton = new Button('#moveLeft', this.handleMoveOnClick);
    this.moveRightButton = new Button('#moveRight', this.handleMoveOnClick);
    this.dashButton = new Button('#dash', this.handleMoveOnClick);
    this.rotateButton = new Button('#rotate', this.handleMoveOnClick);

    // Event handlers
    document.addEventListener('keydown', this.handleKeyDown);

    this.initialGameSettings();
    this.updateBoard();
  }

  initialGameSettings = () => {
    this.player = new Player();
    this.lastTime = 0;
    this.dropCounter = 0;
    // Create a new player and draw a random item.
    this.player.reset(this.arena.matrix);
  };

  handleStartButtonClick = ({ target: { innerText } }) => {
    if (innerText === 'Reset Game') return this.resetGame();
    this.startButton.updateContent('Reset Game');
    this.renderGame();
  };

  renderGame = () => {
    this.gameOver = false;
    this.dropInterval = 1000;
    this.arena.matrix.forEach(row => row.fill(0));
    this.player.clear();
    this.updateBoard();
    this.update();
  };

  resetGame = () => {
    this.gameOver = true;
    this.initialGameSettings();
    this.renderGame();
  };

  update = (time = 0) => {
    const deltaTime = time - this.lastTime;
    this.dropCounter += deltaTime;

    this.dropCounter > this.dropInterval && this.dropPlayer();

    this.lastTime = time;

    this.drawBoard();

    this.gameOver || window.requestAnimationFrame(this.update);
  };

  dropPlayer = () => {
    // Move player vertical
    this.player.pos.y++;

    // If player collided...
    if (this.isCollided(this.arena.matrix, this.player)) {
      // Move back player.
      this.player.pos.y--;
      // Merge player's item with arena's items.
      this.merge(this.arena.matrix, this.player);
      // Reset player location and item.
      this.resetPlayer();
      // Clear rows on success.
      const [rowCount, score] = this.arena.sweep(this.player.score);
      // If any row cleared, update level.
      rowCount > 0 && this.updateLevel(rowCount, score);

      this.updateBoard();
    }

    this.dropCounter = 0;
  };

  isCollided = (arena, { pos: playerPosition, matrix: playerMatrix }) => {
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

  merge = (arena, { pos: playerPosition, matrix: playerMatrix }) => {
    playerMatrix.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell !== 0) {
          arena[y + playerPosition.y][x + playerPosition.x] = cell;
        }
      });
    });
  };

  resetPlayer = () => {
    // Reset player location and item.
    this.player.reset(this.arena.matrix);

    // Game Over
    this.isCollided(this.arena.matrix, this.player) && this.onGameOver();
  };

  onGameOver = () => {
    this.gameOver = true;
    this.startButton.updateContent('Restart Game');
  };

  updateBoard = () => {
    this.scoreBoard.updateContent(this.player.score);
    this.levelBoard.updateContent(this.player.level);
    this.clearedRowsBoard.updateContent(this.player.clearedRows);
  };

  updateLevel = (rowCount, score) => {
    let self = this;
    self.player.clearedRows += rowCount;
    self.player.score += score;

    // Player's level and game's speed up in every 5 rows cleared.
    if (self.player.clearedRows >= (self.player.level + 1) * 5) {
      self.player.level++;
      self.dropInterval = self.dropInterval / (self.player.level + 1) + 200;
    }
  };

  drawBoard = () => this.arena.draw(this.player);

  handleKeyDown = ({ keyCode }) => {
    if (keyCode === 37) {
      this.playerMove(-1);
    } else if (keyCode === 39) {
      this.playerMove(1);
    } else if (keyCode === 40) {
      this.dropPlayer();
    } else if (keyCode === 81) {
      this.playerRotate(-1);
    } else if (keyCode === 87) {
      this.playerRotate(1);
    }
  };

  handleMoveOnClick = ({ target: { alt } }) => {
    if (alt === 'left arrow') return this.playerMove(-1);
    if (alt === 'right arrow') return this.playerMove(1);
    if (alt === 'dash') return this.dropPlayer();
    if (alt === 'rotate') return this.playerRotate(1);
  };

  playerMove = offset => {
    this.player.pos.x += offset;

    // If the item collided, cancel move.
    this.isCollided(this.arena.matrix, this.player) &&
      (this.player.pos.x -= offset);
  };

  playerRotate = dir => {
    const self = this,
      pos = self.player.pos.x;

    let offset = 1;

    self.rotate(self.player.matrix, dir);

    while (self.isCollided(self.arena.matrix, self.player)) {
      self.player.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > self.player.matrix[0].length) {
        self.rotate(self.player.matrix, -dir);
        self.player.pos.x = pos;
        return;
      }
    }
  };

  rotate = (matrix, dir) => {
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
}
