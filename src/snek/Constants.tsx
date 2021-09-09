export enum GameItem {
  EGG,
  FEDORA,
  MOUSE,
  APPLE,
}

export const GameItemData = {
  [GameItem.EGG]: {
    value: 3,
    dropRate: 6,
  },
  [GameItem.FEDORA]: {
    value: 10,
    dropRate: 1,
  },
  [GameItem.MOUSE]: {
    value: 5,
    dropRate: 3,
  },
  [GameItem.APPLE]: {
    value: 1,
    dropRate: 10,
  },
};

export const KeyCodes = {
  ENTER: 'Enter',
  ESC: 'Escape',
  LEFT_ARROW: 'ArrowLeft',
  UP_ARROW: 'ArrowUp',
  RIGHT_ARROW: 'ArrowRight',
  DOWN_ARROW: 'ArrowDown',
  W: 'w',
  A: 'a',
  S: 's',
  D: 'd',
  B: 'b',
};

export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export const DirectionMovement = {
  [Direction.UP]: 1,
  [Direction.DOWN]: -1,
  [Direction.LEFT]: -1,
  [Direction.RIGHT]: 1,
};

export const KeyCodeToDirection = {
  [KeyCodes.W]: Direction.UP,
  [KeyCodes.D]: Direction.RIGHT,
  [KeyCodes.A]: Direction.LEFT,
  [KeyCodes.S]: Direction.DOWN,
  [KeyCodes.RIGHT_ARROW]: Direction.RIGHT,
  [KeyCodes.LEFT_ARROW]: Direction.LEFT,
  [KeyCodes.DOWN_ARROW]: Direction.DOWN,
};

export enum SnekBodyParts {
  HEAD,
  BODY,
  TURN,
  TAIL,
}

export const FenceCoordinates = {
  HORIZONTAL: {
    min: 0,
    max: 23,
  },
  VERTICAL: {
    min: 0,
    max: 14,
  },
};

export const Colors = {
  GREEN_LAWN: '#7f986a',
  SHEER_OVERLAY: 'rgba(0, 0, 0, 0.6)',
  BLACK: '#000000',
};

export const CanvasSizes = {
  SCOREBOARD_HEIGHT: 60,
  GAME_AREA_HEIGHT: 240,
  TOTAL_GAME_HEIGHT: 300,
  GAME_WIDTH: 384,
};

export const SCALE = 16;

export enum Images {
  DOOR = 'DOOR',
  HOW_TO = 'HOW_TO',
  ICON_AUDIO_OFF = 'ICON_AUDIO_OFF',
  ICON_AUDIO_ON = 'ICON_AUDIO_ON',
  APPLE = 'APPLE',
  EGG = 'EGG',
  FEDORA = 'FEDORA',
  MOUSE = 'MOUSE',
  LOADING_SCREEN = 'LOADING_SCREEN',
  SNEK_CHAT = 'SNEK_CHAT',
  SNEK_FENCE = 'SNEK_FENCE',
  SNEK_SPRITE = 'SNEK_SPRITE',
  SNEK_TITLE_BG = 'SNEK_TITLE_BG',
  SNEK = 'SNEK',
  SNEK2_TITLE_BG = 'SNEK2_TITLE_BG',
  SNEK2_TITLE = 'SNEK2_TITLE',
  APPLE_TEXT = 'APPLE_TEXT',
  EGG_TEXT = 'EGG_TEXT',
  FEDORA_TEXT = 'FEDORA_TEXT',
  MOUSE_TEXT = 'MOUSE_TEXT',
  PUSH_SNEK_TEXT = 'PUSH_SNEK_TEXT',
  TITLE = 'TITLE',
}

export const ImageSources: Record<Images, string> = {
  [Images.DOOR]: require('./images/door.png').default,
  [Images.HOW_TO]: require('./images/how_to.png').default,
  [Images.ICON_AUDIO_OFF]: require('./images/icon_audio_off.png').default,
  [Images.ICON_AUDIO_ON]: require('./images/icon_audio_on.png').default,
  [Images.APPLE]: require('./images/item_apple.png').default,
  [Images.EGG]: require('./images/item_egg.png').default,
  [Images.FEDORA]: require('./images/item_fedora.png').default,
  [Images.MOUSE]: require('./images/item_mouse.png').default,
  [Images.LOADING_SCREEN]: require('./images/loading_screen.png').default,
  [Images.SNEK_CHAT]: require('./images/snek_chat.png').default,
  [Images.SNEK_FENCE]: require('./images/snek_fence.png').default,
  [Images.SNEK_SPRITE]: require('./images/snek_sprite.png').default,
  [Images.SNEK_TITLE_BG]: require('./images/snek_title_bg.png').default,
  [Images.SNEK]: require('./images/snek.png').default,
  [Images.SNEK2_TITLE_BG]: require('./images/snek2_title_bg.png').default,
  [Images.SNEK2_TITLE]: require('./images/snek2_title.png').default,
  [Images.APPLE_TEXT]: require('./images/t_apple.png').default,
  [Images.EGG_TEXT]: require('./images/t_egg.png').default,
  [Images.FEDORA_TEXT]: require('./images/t_fedora.png').default,
  [Images.MOUSE_TEXT]: require('./images/t_mouse.png').default,
  [Images.PUSH_SNEK_TEXT]: require('./images/t_pushsnek.png').default,
  [Images.TITLE]: require('./images/title.png').default,
};
