export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

export const GRAVITY_Y = 900;

export const PLAYER = {
  // Source art is trimmed to the character silhouette (825x905), so the frame equals the visible art.
  displayWidth: 100,
  displayHeight: 110,
  // Physics body is narrower than the art so collisions feel fair against the loose silhouette.
  bodyWidth: 44,
  bodyHeight: 100,
  moveSpeed: 320,
  jumpVelocity: -420,
} as const;

export const ENEMY = {
  moveSpeed: 260,
  // Enemy patrols the right side of the field.
  minX: GAME_WIDTH * 0.55,
  // Delay between enemy kicks so it cannot juggle the ball on its own.
  kickCooldownMs: 500,
  kickRange: 110,
} as const;

export const BALL = {
  // Source art is trimmed to the takyan silhouette (540x862).
  displayWidth: 36,
  displayHeight: 57,
  // Physics circle wraps the woven base at the bottom of the art, not the tall feather tuft.
  bodyRadius: 12,
  bounce: 0.85,
  // How close the ball must be to the player for a kick to connect.
  kickRange: 100,
  kickVelocityY: -560,
  // Horizontal speed added per pixel of offset between ball and player.
  kickSpinFactor: 6,
  maxVelocityX: 420,
  // Horizontal speed per pixel of distance when the enemy returns the ball.
  returnFactor: 1.4,
  startDropX: GAME_WIDTH / 2,
  startDropY: 120,
} as const;

export const COLORS = {
  sky: 0x7ec8e3,
  ground: 0x8b5a2b,
  grass: 0x4caf50,
} as const;

export const GROUND_HEIGHT = 60;

export const SCENE_KEYS = {
  boot: "BootScene",
  game: "GameScene",
  gameOver: "GameOverScene",
} as const;

export const TEXTURE_KEYS = {
  player: "tex-player",
  enemy: "tex-enemy",
  ball: "tex-ball",
  ground: "tex-ground",
  background: "tex-background",
} as const;

// Served from the portal app's /public/games/sipa folder.
export const ASSET_PATHS = {
  player: "/games/sipa/player.png",
  enemy: "/games/sipa/enemy.png",
  ball: "/games/sipa/takyan.png",
  background: "/games/sipa/background.png",
} as const;
