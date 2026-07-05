export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

export const GRAVITY_Y = 900;

export const PLAYER = {
  width: 48,
  height: 72,
  moveSpeed: 320,
  jumpVelocity: -420,
} as const;

export const BALL = {
  radius: 14,
  bounce: 0.85,
  // How close the ball must be to the player for a kick to connect.
  kickRange: 90,
  kickVelocityY: -560,
  // Horizontal speed added per pixel of offset between ball and player.
  kickSpinFactor: 6,
  maxVelocityX: 420,
  startDropX: GAME_WIDTH / 2,
  startDropY: 120,
} as const;

export const COLORS = {
  sky: 0x7ec8e3,
  ground: 0x8b5a2b,
  grass: 0x4caf50,
  player: 0x1565c0,
  playerSkin: 0xffcc99,
  ball: 0xffd54f,
  ballTrim: 0xef5350,
} as const;

export const GROUND_HEIGHT = 60;

export const SCENE_KEYS = {
  boot: "BootScene",
  game: "GameScene",
  gameOver: "GameOverScene",
} as const;

export const TEXTURE_KEYS = {
  player: "tex-player",
  ball: "tex-ball",
  ground: "tex-ground",
} as const;
