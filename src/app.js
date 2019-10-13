import Player from './components/player';
import Display from './components/display';
import Arena from './components/arena';
import Button from './components/button';
import playButtonImage from '../assets/images/play-button.png';
import pauseButtonImage from '../assets/images/pause.png';
import NextItem from './components/nextItem';
import { isCollided, merge, rotate, itemColors } from './lib';

export default class Game {
  constructor() {
    // Item colors.
    this.colors = itemColors;

    // DOM elements
    this.scoreBoard = new Display('#score');
    this.clearedRowsBoard = new Display('#clearedRows');
    this.nextItemBoard = new NextItem(this.colors);
    this.startButton = new Button('#control', this.handleStartButtonClick);
    this.restartButton = new Button('#restart', this.resetGame);
    this.controlIcon = document.querySelector('.control-icon');
    this.moveLeftButton = new Button('#moveLeft', this.handleMoveOnClick);
    this.moveRightButton = new Button('#moveRight', this.handleMoveOnClick);
    this.dashButton = new Button('#dash', this.handleMoveOnClick);
    this.rotateButton = new Button('#rotate', this.handleMoveOnClick);

    // Set arena size.
    this.arena = new Arena(12, 20, this.colors);

    // Event handler
    document.addEventListener('keydown', this.handleKeyDown);

    // Initialize game
    this.initialGameSettings();
    this.updateBoard();
  }

  initialGameSettings = () => {
    this.player = new Player();
    this.lastTime = 0;
    this.dropCounter = 0;
    this.gameOver = true;
    this.dashPlayer = false;
    // Create a new player and draw a random item.
    this.player.reset(this.arena.matrix);
  };

  handleStartButtonClick = ({ currentTarget: { dataset }, target }) => {
    // If this is initial game or game is over, restart game.
    if (this.gameOver) {
      dataset.state = 'pause';
      // Set background pause icon.
      target.src = pauseButtonImage;
      return this.renderGame();
    }

    // If pause button clicked, play game.
    // Else, pause game.
    if (dataset.state === 'play') {
      this.gamePause = false;
      dataset.state = 'pause';
      // Set background pause icon.
      target.src = pauseButtonImage;
      this.update();
    } else {
      this.gamePause = true;
      dataset.state = 'play';
      // Set background play icon.
      target.src = playButtonImage;
    }
  };

  renderGame = () => {
    this.gameOver = false;
    this.gamePause = false;
    // Beginner's level game speed.
    this.dropInterval = 700;
    // Dash speed on dash event.
    this.dashSpeed = 10;
    // Clear arena.
    this.arena.matrix.forEach(row => row.fill(0));
    // Clear player score.
    this.player.clear();
    this.updateBoard();
    // Draw next item.
    this.nextItemBoard.drawNextItem(this.player.nextMatrix);
    // Start game.
    this.update();
  };

  resetGame = () => {
    this.gameOver = true;
    this.initialGameSettings();
    this.startButton.element.dataset.state = 'pause';
    this.controlIcon.src = pauseButtonImage;
    this.renderGame();
  };

  update = (time = 0) => {
    const deltaTime = time - this.lastTime;
    this.dropCounter += deltaTime;

    // If we are in dash mode, make drop speed faster.
    // Else, stay in current level's speed.
    this.dropSpeed = this.dashPlayer ? this.dashSpeed : this.dropInterval;

    this.dropCounter > this.dropSpeed && this.dropPlayer();

    this.lastTime = time;

    this.drawBoard();

    this.gameOver ||
      this.gamePause ||
      window.requestAnimationFrame(this.update);
  };

  dropPlayer = () => {
    // Move player vertical
    this.player.pos.y++;

    // If player collided...
    if (isCollided(this.arena.matrix, this.player)) {
      // Move back player.
      this.player.pos.y--;
      // Merge player's item with arena's items.
      merge(this.arena.matrix, this.player);
      // Reset player location and item.
      this.resetPlayer();
      // Clear rows on success.
      const [rowCount, score] = this.arena.sweep(this.player.score);
      // If any row cleared, update level.
      rowCount > 0 && this.updateLevel(rowCount, score);
      // If item dashed, switch off dash.
      this.dashPlayer && this.toggleDashItem();

      this.nextItemBoard.drawNextItem(this.player.nextMatrix);
      this.updateBoard();
    }

    this.dropCounter = 0;
  };

  resetPlayer = () => {
    // Reset player location and item.
    this.player.reset(this.arena.matrix);

    // Game Over
    isCollided(this.arena.matrix, this.player) && this.onGameOver();
  };

  onGameOver = () => {
    this.gameOver = true;
    this.controlIcon.src = playButtonImage;
  };

  updateBoard = () => {
    this.scoreBoard.updateContent(this.player.score);
    this.clearedRowsBoard.updateContent(this.player.clearedRows);
  };

  updateLevel = (rowCount, score) => {
    let self = this;
    self.player.clearedRows += rowCount;
    self.player.score += score;

    // Increase player's level and game's speed on every 5 rows cleared.
    if (self.player.clearedRows >= (self.player.level + 1) * 5) {
      // Increase level.
      self.player.level++;
      // Increase game speed.
      self.dropInterval = self.dropInterval / (self.player.level + 1) + 200;
    }
  };

  drawBoard = () => this.arena.draw(this.player);

  handleKeyDown = ({ keyCode }) => {
    // If game paused, do not move item.
    // Else, move item.
    if (this.gamePause) return;
    if (keyCode === 37) {
      this.playerMove(-1);
    } else if (keyCode === 39) {
      this.playerMove(1);
    } else if (keyCode === 40) {
      this.toggleDashItem();
    } else if (keyCode === 81) {
      this.playerRotate(-1);
    } else if (keyCode === 87) {
      this.playerRotate(1);
    }
  };

  handleMoveOnClick = ({ target: { alt } }) => {
    // If game paused, do not move item.
    // Else, move item.
    if (this.gamePause) return;
    if (alt === 'left arrow') return this.playerMove(-1);
    if (alt === 'right arrow') return this.playerMove(1);
    if (alt === 'dash') return this.toggleDashItem();
    if (alt === 'rotate') return this.playerRotate(1);
  };

  playerMove = offset => {
    this.player.pos.x += offset;

    // If the item collided, cancel move.
    isCollided(this.arena.matrix, this.player) && (this.player.pos.x -= offset);
  };

  playerRotate = dir => {
    const self = this,
      pos = self.player.pos.x;

    let offset = 1;

    rotate(self.player.matrix, dir);

    while (isCollided(self.arena.matrix, self.player)) {
      self.player.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > self.player.matrix[0].length) {
        rotate(self.player.matrix, -dir);
        self.player.pos.x = pos;
        return;
      }
    }
  };

  toggleDashItem = () => (this.dashPlayer = !this.dashPlayer);
}
