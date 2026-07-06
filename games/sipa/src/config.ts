export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

export const GRAVITY_Y = 900;

export const PLAYER = {
  // Animation frames share a per-character canvas (~396x662), so the frame equals the visible art.
  displayWidth: 66,
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
  playerRest: "tex-player-rest",
  playerBounce: "tex-player-bounce",
  playerKick1: "tex-player-kick1",
  playerKick2: "tex-player-kick2",
  playerKick3: "tex-player-kick3",
  enemyRest: "tex-enemy-rest",
  enemyBounce: "tex-enemy-bounce",
  enemyKick1: "tex-enemy-kick1",
  enemyKick2: "tex-enemy-kick2",
  enemyKick3: "tex-enemy-kick3",
  ball: "tex-ball",
  ground: "tex-ground",
  background: "tex-background",
} as const;

export const ANIM_KEYS = {
  playerIdle: "anim-player-idle",
  playerKick: "anim-player-kick",
  enemyIdle: "anim-enemy-idle",
  enemyKick: "anim-enemy-kick",
} as const;

export const ANIM = {
  idleFrameRate: 3,
  kickFrameRate: 18,
} as const;

export const AUDIO_KEYS = {
  kick: "sfx-kick",
  bgm: "bgm-game",
  gameOver: "sfx-gameover",
} as const;

export const AUDIO = {
  // Music is quieter than effects so it sits under the gameplay sounds.
  bgmVolume: 0.4,
  defaultVolume: 0.7,
  volumeStep: 0.1,
} as const;

export const REGISTRY_KEYS = {
  audioSettings: "audio-settings",
} as const;

// Served from the portal app's /public/games/sipa folder.
export const ASSET_PATHS = {
  playerRest: "/games/sipa/player_rest.png",
  playerBounce: "/games/sipa/player_bounce.png",
  playerKick1: "/games/sipa/player_kick1.png",
  playerKick2: "/games/sipa/player_kick2.png",
  playerKick3: "/games/sipa/player_kick3.png",
  enemyRest: "/games/sipa/enemy_rest.png",
  enemyBounce: "/games/sipa/enemy_bounce.png",
  enemyKick1: "/games/sipa/enemy_kick1.png",
  enemyKick2: "/games/sipa/enemy_kick2.png",
  enemyKick3: "/games/sipa/enemy_kick3.png",
  ball: "/games/sipa/takyan.png",
  background: "/games/sipa/background.png",
  kickSfx: "/games/sipa/kick.wav",
  bgm: "/games/sipa/bgm.wav",
  gameOverSfx: "/games/sipa/gameover.mp3",
} as const;
