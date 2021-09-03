import * as React from 'react';
import lodash from 'lodash';

import { loadImagePromise as loadImage } from './ImageUtils';
import Scoreboard from './Scoreboard';
import { checkDoorCollision, isSnekAtDoorEntrance } from './Snek2Utils';
import { Position, SnekPiece, PlayerSnek, Game } from './SnekClasses';

import {
  Dimensions,
  Moves,
  SnekPieces,
  Controls,
  SnekSpriteSheet,
  OppositeDirections,
  OppositeTurns,
  Speed,
  Items,
  Images,
  Actions,
  Death,
  Colors,
  SCALE,
  MAX_ITEMS_ON_BOARD,
  GENERATE_ITEM_MODIFIER,
  NORMAL_VOLUME,
  ITEM_SOUND,
  FEDORA_SOUND,
  DoorBoundaries,
} from './SnekConstants';
import styles from './Snek.module.css';

export default class Snek extends React.PureComponent {
  constructor() {
    super();
    this.game = new Game(Speed.START, {}, new PlayerSnek({}).setDefaultSnek());
    this.state = {
      points: 0,
      gameOver: false,
      showDoor: false,
      enteringDoor: false,
    };
  }

  componentDidMount() {
    this.background = this.backdrop.getContext('2d');
    this.board = this.canvas.getContext('2d');
    this.gameOverCanvas = this.overlay.getContext('2d');

    const user = navigator.userAgent;
    this.isSafari = /Safari/.test(user) && !/Chrome/.test(user);

    this.volume = this.props.muted ? 0 : NORMAL_VOLUME;
    this.loadSnekAndBackground();
    this.loadSounds();
    this.createBoard();
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    clearTimeout(this.timeout);
    this.snekSong.pause();
    this.snekSong.src = '';
    this.snekDeadSong.pause();
    this.snekDeadSong.src = '';
  }

  // Game Methods + Utils

  gameLoop = (action) => {
    this.moveSnek(action);
    this.dropItems();
    this.tick();
  };

  gameOver() {
    this.ready = false;
    this.snekSong.pause();
    this.resetSong(this.snekSong);
    this.snekSong.playbackRate = 1;
    this.snekDeadSong.play();

    this.drawGameOverState();
    this.game = new Game(Speed.START, {}, new PlayerSnek({}).setDefaultSnek());
    this.ready = true;
  }

  drawGameOverState() {
    this.gameOverCanvas.fillStyle = Colors.SHEER_OVERLAY;
    this.gameOverCanvas.fillRect(
      0,
      0,
      Dimensions.CANVAS_WIDTH,
      Dimensions.FULL_HEIGHT
    );
    this.setState({ gameOver: true });
    this.ready = this.props.muted;
  }

  tick() {
    clearTimeout(this.timeout);

    if (this.game.snek.alive) {
      this.timeout = setTimeout(() => {
        this.gameLoop();
      }, this.game.speed);
    } else {
      this.gameOver();
    }
  }

  drawImage(canvas, img, canvasX, canvasY, doScale, imgX, imgY) {
    const x = doScale ? canvasX * SCALE : canvasX;
    const y = doScale ? canvasY * SCALE : canvasY;
    if (imgX != null) {
      canvas.drawImage(img, imgX, imgY, SCALE, SCALE, x, y, SCALE, SCALE);
    } else {
      canvas.drawImage(img, x, y);
    }
  }

  clearRect(x, y, xDim, yDim, canvas) {
    const clearCanvas = canvas || this.board;
    clearCanvas.clearRect(x * SCALE, y * SCALE, xDim || SCALE, yDim || SCALE);
  }

  setBackgroundRef = (ref) => {
    this.backdrop = ref;
  };

  setForegroundRef = (ref) => {
    this.canvas = ref;
  };

  setGameOverRef = (ref) => {
    this.overlay = ref;
  };

  resetSong(song) {
    song.pause();
    song.currentTime = 0;
  }

  // Set Up

  handleKeyDown = (event: KeyboardEvent) => {
    const { snek } = this.game;
    const action = Controls[event.keyCode];

    // Don't bother if we're not ready
    if (!this.ready) {
      return null;
    }

    // Prevents default arrow key movements
    if (lodash.inRange(38, 40)) {
      event.preventDefault();
    }

    if (!snek.alive) {
      // SNEK 2!
      if (
        this.state.gameOver &&
        action === Actions.ENTER &&
        (event.metaKey || event.ctrlKey)
      ) {
        this.resetBoard(true);
        this.setState({ gameOver: false, showDoor: true });
        // RESET GAME
      } else if (this.state.gameOver && action === Actions.ENTER) {
        this.resetBoard();
        this.setState({ gameOver: false });
        // NEW GAME START
      } else if (!this.state.gameOver && this.state.showDoor) {
        this.moveSnek(action);
      } else if (!this.state.gameOver) {
        snek.alive = true;
        this.snekSong.play();
        this.tick();
      }
    } else {
      if (action && action !== Actions.ENTER) {
        this.gameLoop(action);
      }
    }
  };

  createBoard() {
    this.background.fillStyle = Colors.GREEN_LAWN;
    this.background.fillRect(
      0,
      0,
      Dimensions.CANVAS_WIDTH,
      Dimensions.CANVAS_HEIGHT
    );
    this.background.save();
  }

  resetBoard(showDoor: boolean = false) {
    this.resetSong(this.snekDeadSong);
    this.setState({ points: 0 });
    this.child.resetBoard();
    this.clearRect(0, 0, Dimensions.CANVAS_WIDTH, Dimensions.CANVAS_HEIGHT);
    this.clearRect(
      0,
      0,
      Dimensions.CANVAS_WIDTH,
      Dimensions.FULL_HEIGHT,
      this.gameOverCanvas
    );
    this.drawSnek();
    if (showDoor) {
      this.drawDoor();
    }
  }

  drawSnek() {
    lodash.forEach(this.game.snek.position, (piece) => {
      this.drawImage(
        this.board,
        this.snekSprite,
        piece.x,
        piece.y,
        true,
        SnekSpriteSheet.X[piece.direction],
        SnekSpriteSheet.Y[piece.type]
      );
    });
    this.ready = true;
  }

  async drawDoor() {
    const door = await loadImage(Images.DOOR);
    this.drawImage(this.background, door, Images.DOOR.x, Images.DOOR.y);
  }

  loadSnekAndBackground() {
    Promise.all([loadImage(Images.SNEK), loadImage(Images.FENCE)]).then(
      (images) => {
        this.game.snek.spriteSheetOnload(this, images[0]);
        this.drawImage(this.background, images[1], 0, 0);
      }
    );

    this.loadItems();
  }

  loadItems() {
    this.itemPickList = [];
    this.items = Items;

    if (!this.isSafari) {
      this.itemSound = new Audio(ITEM_SOUND);
      this.fedoraSound = new Audio(FEDORA_SOUND);
    }

    lodash.forEach(this.items, (data, item) => {
      loadImage(data.imgSrc).then((img) => (this.items[item].img = img));
      loadImage(data.textImgSrc).then(
        (img) => (this.items[item].textImg = img)
      );

      // Create array of item names to pick from, weighted appropriately
      const weighted = Array(data.weight).fill(item);
      this.itemPickList.push(...weighted);
    });
  }

  loadSounds() {
    this.snekSong = new Audio(require('./sounds/snek_play.mp3').default);
    this.snekSong.loop = true;
    this.snekSong.volume = this.volume;

    this.snekDeadSong = new Audio(require('./sounds/snek_ded.mp3').default);
    this.snekDeadSong.volume = this.volume;
  }

  // Snek

  moveSnek(action) {
    const { snek } = this.game;
    const oldHead = snek.position[snek[SnekPieces.HEAD]];

    // Ensure user isn't trying to move backwards
    if (
      (action && action === OppositeDirections[oldHead.direction]) ||
      (this.state.enteringDoor && action !== Actions.UP)
    ) {
      return null;
    }

    const direction = action || oldHead.direction;

    const newHead = new SnekPiece(direction, SnekPieces.HEAD);
    newHead.setCoords(
      oldHead.x + Moves[direction].x,
      oldHead.y + Moves[direction].y
    );
    const newHeadCoords = newHead.getKeyString();

    // If the door exists and we've run into it, stop
    if (
      this.state.showDoor &&
      checkDoorCollision(newHead) &&
      !isSnekAtDoorEntrance(newHead) &&
      !this.state.enteringDoor
    ) {
      return;
    }

    // If we've run into the fence, stop animating.
    if (this.checkAlive(newHeadCoords, newHead) === Death.BY_FENCE) {
      return null;
    }

    // Move tail
    const oldTail = snek.position[snek[SnekPieces.TAIL]];

    if (!this.checkForItem(newHeadCoords)) {
      const newTail = snek.position[oldTail.previousPiece];
      newTail.type = SnekPieces.TAIL;
      newTail.direction = snek.position[newTail.previousPiece].direction;

      snek.removePiece(snek[SnekPieces.TAIL]);
      snek[SnekPieces.TAIL] = new Position(newTail.x, newTail.y).getKeyString();

      this.animateTail(oldTail, newTail);
    }

    // Then move head
    snek[SnekPieces.HEAD] = newHeadCoords;
    snek.position[newHeadCoords] = newHead;

    oldHead.type = SnekPieces.BODY;
    oldHead.previousPiece = newHeadCoords;

    if (this.state.enteringDoor) {
      this.clearRect(DoorBoundaries.ENTRANCE_X, DoorBoundaries.ENTRANCE_Y);
      const snekTail = snek[SnekPieces.TAIL];

      if (snekTail === '11_4') {
        this.props.onStartSNEK2();
      }
      return;
    }

    if (this.state.showDoor && isSnekAtDoorEntrance(newHead)) {
      this.setState({ enteringDoor: true });
    }

    this.animateHead(newHead, oldHead, this.state.enteringDoor);
  }

  animateHead(newHead, oldHead, skipNewHead = false) {
    if (!skipNewHead) {
      this.drawImage(
        this.board,
        this.snekSprite,
        newHead.x,
        newHead.y,
        true,
        SnekSpriteSheet.X[newHead.direction],
        SnekSpriteSheet.Y[SnekPieces.HEAD]
      );
    }

    oldHead.type =
      newHead.direction === oldHead.direction
        ? SnekPieces.BODY
        : SnekPieces.TURN;
    const direction = this.getBodyDirection(oldHead, newHead, oldHead.type);
    this.clearRect(oldHead.x, oldHead.y);
    this.drawImage(
      this.board,
      this.snekSprite,
      oldHead.x,
      oldHead.y,
      true,
      SnekSpriteSheet.X[direction],
      SnekSpriteSheet.Y[oldHead.type]
    );
  }

  getBodyDirection(body, head, piece) {
    const combo =
      piece === SnekPieces.TURN
        ? `${body.direction}_${head.direction}`
        : body.direction;
    return lodash.get(OppositeTurns, combo, combo);
  }

  animateTail(oldTail, newTail) {
    this.clearRect(newTail.x, newTail.y);
    this.clearRect(oldTail.x, oldTail.y);
    this.drawImage(
      this.board,
      this.snekSprite,
      newTail.x,
      newTail.y,
      true,
      SnekSpriteSheet.X[newTail.direction],
      SnekSpriteSheet.Y[SnekPieces.TAIL]
    );
  }

  checkAlive(newHeadCoords, newHead) {
    const { snek } = this.game;
    if (
      snek.position[newHeadCoords] &&
      newHeadCoords !== snek[SnekPieces.TAIL]
    ) {
      snek.alive = false;
      return Death.BY_STEP_ON_SNEK;
    } else if (
      !lodash.inRange(newHead.x, 1, Dimensions.COLUMNS - 1) ||
      !lodash.inRange(newHead.y, 1, Dimensions.ROWS - 1)
    ) {
      snek.alive = false;
      return Death.BY_FENCE;
    }
    return null;
  }

  setSpeed() {
    if (this.game.speed > Speed.NORMAL) {
      this.game.speed = Math.max(this.game.speed * 0.9, 80);
    } else if (this.state.points > 100 && this.game.speed > Speed.SPEEDY) {
      this.game.speed = Speed.SPEEDY;
    } else if (this.state.points > 300) {
      this.game.speed = Speed.TURBO;
    }

    if (this.snekSong.playbackRate < 1.5 && !this.isSafari) {
      this.snekSong.playbackRate = lodash.round(
        this.snekSong.playbackRate * 1.01,
        2
      );
    }
  }

  // Items

  dropItems() {
    const itemCount = lodash.size(this.game.items);

    // Only drop items if there are less than 4 items currently on the board
    if (itemCount < MAX_ITEMS_ON_BOARD) {
      // Generates a random num between 0 and an upper limit based on current # items on the board.
      const randomNumber = lodash.random(0, itemCount * GENERATE_ITEM_MODIFIER);

      // If the randomly generated # is 0, drop an itemGENERATE_ITEM_MODIFIER
      if (randomNumber === 0) {
        const item =
          this.items[
            this.itemPickList[
              Math.floor(Math.random() * this.itemPickList.length)
            ]
          ];
        if (this.game.snek.alive) {
          const randomCoords = this.getRandomCoordinates();
          this.game.items[randomCoords.coords] = item;
          this.drawImage(
            this.board,
            item.img,
            randomCoords.x,
            randomCoords.y,
            true
          );
        }
      }
    }
  }

  getRandomCoordinates(tries = 0) {
    const xCoord = lodash.random(1, Dimensions.COLUMNS_NO_FENCE);
    const yCoord = lodash.random(1, Dimensions.ROWS_NO_FENCE);
    const coords = new Position(xCoord, yCoord).getKeyString();
    const allPiecesOnBoard = { ...this.game.snek.position, ...this.game.items };

    // If there's something currently at the random coords, generate new ones
    if (lodash.get(allPiecesOnBoard, coords, false)) {
      if (tries > 100) {
        return this.gameOver();
      }
      return this.getRandomCoordinates(tries++);
    } else {
      return { coords, x: xCoord, y: yCoord };
    }
  }

  checkForItem(newHeadCoords) {
    const foundItem = this.game.items[newHeadCoords];

    if (foundItem) {
      if (!this.isSafari) {
        const sound =
          foundItem.name === 'fedora' ? this.fedoraSound : this.itemSound;
        sound.currentTime = 0;
        sound.volume = this.volume;
        sound.play();
      }

      this.child.renderText(foundItem);
      this.setSpeed(foundItem);

      delete this.game.items[newHeadCoords];
      this.setState({ points: this.state.points + foundItem.points });

      return true;
    }
    return null;
  }

  render() {
    const gameOverStats = this.state.gameOver ? (
      <div className={styles.gameOverText}>
        <div className={styles.winner}>YOU LOST</div>
        <div>
          <div>Points: {this.state.points}</div>
          <div>Press ENTER To Reset SNEK</div>
          <div>Press ESC To Exit SNEK (๑◕︵◕๑)</div>
          <div className={styles.snek2Instructions}>
            Press CMD/CTRL + ENTER To Talk About Your Feelings
          </div>
        </div>
      </div>
    ) : null;

    const normalContent = (
      <>
        {gameOverStats}
        <canvas
          width={Dimensions.CANVAS_WIDTH}
          height={Dimensions.FULL_HEIGHT}
          ref={this.setGameOverRef}
          className={styles.gameOverCanvas}
        />
        <Scoreboard
          onRef={(ref) => (this.child = ref)}
          points={this.state.points}
          drawImage={this.drawImage}
        />
        <div className={styles.gameWrap}>
          <canvas
            width={Dimensions.CANVAS_WIDTH}
            height={Dimensions.CANVAS_HEIGHT}
            ref={this.setBackgroundRef}
            className={styles.gameCanvas}
          />
          <canvas
            width={Dimensions.CANVAS_WIDTH}
            height={Dimensions.CANVAS_HEIGHT}
            ref={this.setForegroundRef}
            className={styles.gameCanvas}
          />
        </div>
      </>
    );

    return (
      <div className={styles.container}>
        {!this.state.showSNEK2 ? normalContent : this.renderSNEK2()}
      </div>
    );
  }
}
