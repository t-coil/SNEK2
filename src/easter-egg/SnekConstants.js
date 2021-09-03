import keyMirror from 'keymirror';

const CANVAS_WIDTH = 384;
const CANVAS_HEIGHT = 240;
const SCOREBOARD_HEIGHT = 60;
const SNEK_FACE_WIDTH = 52;
const DOOR_WIDTH = 48;
const DOOR_HEIGHT = 32;

export const DoorBoundaries = {
  LEFT: 10,
  RIGHT: 13,
  TOP: 3,
  BOTTOM: 5,
  ENTRANCE_X: 11,
  ENTRANCE_Y: 4,
};

const Dimensions = {
  CANVAS_WIDTH,
  CANVAS_WIDTH_HALVED: CANVAS_WIDTH / 2,
  CANVAS_HEIGHT,
  SCOREBOARD_HEIGHT,
  SCOREBOARD_HEIGHT_HALVED: SCOREBOARD_HEIGHT / 2,
  SCOREBOARD_CLEAR: CANVAS_WIDTH - SNEK_FACE_WIDTH,
  FULL_HEIGHT: CANVAS_HEIGHT + SCOREBOARD_HEIGHT,
  COLUMNS: 24,
  COLUMNS_NO_FENCE: 22,
  ROWS: 15,
  ROWS_NO_FENCE: 13,
  SNEK_FACE_WIDTH,
  DOOR_WIDTH,
  DOOR_HEIGHT,
};

const SCALE = 16;
const HALF_SPEECH_BUBBLE_HEIGHT = 26 / 2;

const Positions = {
  SPEECH_BUBBLE_X: 9,
  SPEECH_BUBBLE_Y:
    Dimensions.SCOREBOARD_HEIGHT +
    5 -
    (Dimensions.SCOREBOARD_HEIGHT_HALVED + HALF_SPEECH_BUBBLE_HEIGHT),
  QUOTE_X: Dimensions.CANVAS_WIDTH - 10,
  QUOTE_Y: Dimensions.SCOREBOARD_HEIGHT + 5,
};

const Directions = keyMirror({
  UP: null,
  DOWN: null,
  LEFT: null,
  RIGHT: null,
});

const Moves = {
  [Directions.UP]: { x: 0, y: -1 },
  [Directions.DOWN]: { x: 0, y: 1 },
  [Directions.LEFT]: { x: -1, y: 0 },
  [Directions.RIGHT]: { x: 1, y: 0 },
};

const SnekPieces = keyMirror({
  HEAD: null,
  BODY: null,
  TAIL: null,
  TURN: null,
});

const Actions = keyMirror({
  [Directions.UP]: null,
  [Directions.DOWN]: null,
  [Directions.LEFT]: null,
  [Directions.RIGHT]: null,
  ENTER: null,
});

const KeyCodes = {
  ENTER: 13,
  ESC: 27,
  LEFT_ARROW: 37,
  UP_ARROW: 38,
  RIGHT_ARROW: 39,
  DOWN_ARROW: 40,
  W: 87,
  A: 65,
  S: 83,
  D: 68,
  B: 66,
};

const Controls = {
  [KeyCodes.W]: Actions.UP,
  [KeyCodes.D]: Actions.RIGHT,
  [KeyCodes.A]: Actions.LEFT,
  [KeyCodes.S]: Actions.DOWN,
  [KeyCodes.UP_ARROW]: Actions.UP,
  [KeyCodes.RIGHT_ARROW]: Actions.RIGHT,
  [KeyCodes.LEFT_ARROW]: Actions.LEFT,
  [KeyCodes.DOWN_ARROW]: Actions.DOWN,
  [KeyCodes.ENTER]: Actions.ENTER,
};

const TurnDirections = keyMirror({
  DOWN_LEFT: null,
  UP_LEFT: null,
  DOWN_RIGHT: null,
  UP_RIGHT: null,
  RIGHT_UP: null,
  LEFT_UP: null,
  RIGHT_DOWN: null,
  LEFT_DOWN: null,
});

const SnekSpriteSheet = {
  X: {
    [Directions.UP]: 0,
    [Directions.RIGHT]: 16,
    [Directions.DOWN]: 32,
    [Directions.LEFT]: 48,
    [TurnDirections.DOWN_LEFT]: 0,
    [TurnDirections.UP_LEFT]: 16,
    [TurnDirections.DOWN_RIGHT]: 32,
    [TurnDirections.UP_RIGHT]: 48,
  },
  Y: {
    [SnekPieces.HEAD]: 0,
    [SnekPieces.BODY]: 16,
    [SnekPieces.TAIL]: 32,
    [SnekPieces.TURN]: 48,
  },
};

const KonamiCode = [
  KeyCodes.UP_ARROW,
  KeyCodes.UP_ARROW,
  KeyCodes.DOWN_ARROW,
  KeyCodes.DOWN_ARROW,
  KeyCodes.LEFT_ARROW,
  KeyCodes.RIGHT_ARROW,
  KeyCodes.LEFT_ARROW,
  KeyCodes.RIGHT_ARROW,
  KeyCodes.B,
  KeyCodes.A,
];

const OppositeDirections = {
  [Actions.UP]: Actions.DOWN,
  [Actions.DOWN]: Actions.UP,
  [Actions.LEFT]: Actions.RIGHT,
  [Actions.RIGHT]: Actions.LEFT,
};

const OppositeTurns = {
  [TurnDirections.RIGHT_UP]: TurnDirections.DOWN_LEFT,
  [TurnDirections.LEFT_UP]: TurnDirections.DOWN_RIGHT,
  [TurnDirections.RIGHT_DOWN]: TurnDirections.UP_LEFT,
  [TurnDirections.LEFT_DOWN]: TurnDirections.UP_RIGHT,
};

const Speed = {
  START: 200,
  NORMAL: 80,
  SPEEDY: 65,
  TURBO: 50,
};

const StartPosition = {
  '11_6': { direction: Directions.UP, type: SnekPieces.HEAD },
  '11_7': {
    direction: Directions.UP,
    type: SnekPieces.BODY,
    previousPiece: '11_6',
  },
  '11_8': {
    direction: Directions.UP,
    type: SnekPieces.BODY,
    previousPiece: '11_7',
  },
  '11_9': {
    direction: Directions.UP,
    type: SnekPieces.TAIL,
    previousPiece: '11_8',
  },
};

const ITEM_SOUND = require('./sounds/snek_item.mp3').default;
const FEDORA_SOUND = require('./sounds/snek_fedora.mp3').default;

const Items = {
  EGG: {
    name: 'egg',
    weight: 6,
    points: 3,
    imgSrc: require('./images/item_egg.png').default,
    textImgSrc: require('./images/t_egg.png').default,
  },
  FEDORA: {
    name: 'fedora',
    weight: 1,
    points: 10,
    imgSrc: require('./images/item_fedora.png').default,
    textImgSrc: require('./images/t_fedora.png').default,
  },
  MOUSE: {
    name: 'mouse',
    weight: 3,
    points: 5,
    imgSrc: require('./images/item_mouse.png').default,
    textImgSrc: require('./images/t_mouse.png').default,
  },
  APPLE: {
    name: 'apple',
    weight: 10,
    points: 1,
    imgSrc: require('./images/item_apple.png').default,
    textImgSrc: require('./images/t_apple.png').default,
  },
};

const Images = {
  FENCE: {
    src: require('./images/snek_fence.png').default,
  },
  BIG_SNEK: {
    src: require('./images/snek.png').default,
    x: CANVAS_WIDTH - SNEK_FACE_WIDTH,
    y: CANVAS_HEIGHT - SCOREBOARD_HEIGHT,
  },
  SPEECH_BUBBLE: {
    src: require('./images/snek_chat.png').default,
  },
  SNEK: {
    src: require('./images/snek_sprite.png').default,
  },
  BACKGROUND: {
    src: require('./images/snek2_title_bg.png').default,
    x: 0,
    y: 0,
  },
  TITLE_HERO: {
    src: require('./images/snek2_title.png').default,
    modifier: -40,
  },
  PUSH_SNEK: {
    src: require('./images/t_pushsnek.png').default,
    modifier: 40,
  },
  SOUND_ON: {
    src: require('./images/icon_audio_on.png').default,
    x: 10,
    y: Dimensions.FULL_HEIGHT - SCALE - 10,
  },
  SOUND_OFF: {
    src: require('./images/icon_audio_off.png').default,
    x: 10,
    y: Dimensions.FULL_HEIGHT - SCALE - 10,
  },
  DOOR: {
    src: require('./images/door.png').default,
    x: Dimensions.CANVAS_WIDTH_HALVED - SCALE * 2,
    y: Dimensions.CANVAS_HEIGHT / 2 - SCALE * 4,
  },
};

const TitleImages = {
  BACKGROUND: Images.BACKGROUND,
  TITLE_HERO: Images.TITLE_HERO,
  PUSH_SNEK: Images.PUSH_SNEK,
  SOUND_ON: Images.SOUND_ON,
  SOUND_OFF: Images.SOUND_OFF,
};

const Death = keyMirror({
  BY_FENCE: null,
  BY_STEP_ON_SNEK: null,
});

const Colors = {
  GREEN_LAWN: '#7f986a',
  SHEER_OVERLAY: 'rgba(0, 0, 0, 0.6)',
  BLACK: '#000000',
};

const Buttons = {
  UP: 'up',
  DOWN: 'down',
};

const MAX_ITEMS_ON_BOARD = 4;
const GENERATE_ITEM_MODIFIER = 7;
const NORMAL_VOLUME = 0.09;

export {
  Dimensions,
  Positions,
  Buttons,
  Moves,
  SnekPieces,
  KeyCodes,
  Controls,
  SnekSpriteSheet,
  OppositeDirections,
  OppositeTurns,
  Speed,
  StartPosition,
  Items,
  Images,
  TitleImages,
  Actions,
  Death,
  Colors,
  KonamiCode,
  SCALE,
  MAX_ITEMS_ON_BOARD,
  GENERATE_ITEM_MODIFIER,
  NORMAL_VOLUME,
  ITEM_SOUND,
  FEDORA_SOUND,
};
