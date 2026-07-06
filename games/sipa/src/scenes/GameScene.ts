import Phaser from "phaser";
import { getAudioSettings, playSfx } from "../audio";
import type { AudioSettings } from "../audio";
import {
  ANIM_KEYS,
  AUDIO,
  AUDIO_KEYS,
  BALL,
  CONTROLS,
  GAME_HEIGHT,
  GAME_WIDTH,
  GROUND_HEIGHT,
  MODES,
  PLAYER,
  SCENE_KEYS,
  TEXTURE_KEYS,
  VERSUS,
} from "../config";
import type { GameMode } from "../config";
import { AudioControls } from "../objects/AudioControls";
import { Ball } from "../objects/Ball";
import { Enemy } from "../objects/Enemy";
import { Player } from "../objects/Player";
import { TouchControls } from "../objects/TouchControls";

interface GameSceneData {
  mode?: GameMode;
}

interface KickBinding {
  keys: Phaser.Input.Keyboard.Key[];
  kicker: Player;
}

const HUD_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  fontFamily: "monospace",
  fontSize: "28px",
  color: "#ffffff",
  stroke: "#000000",
  strokeThickness: 4,
};

export class GameScene extends Phaser.Scene {
  private mode: GameMode = MODES.onePlayer;
  private player!: Player;
  private player2?: Player;
  private enemy?: Enemy;
  private ball!: Ball;
  private ground!: Phaser.Physics.Arcade.Image;
  private kickBindings: KickBinding[] = [];
  private score = 0;
  private combo = 1;
  private bestCombo = 1;
  private p1Score = 0;
  private p2Score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private comboText?: Phaser.GameObjects.Text;
  private bgm!: Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound;
  private ballLive = false;
  private servePending = false;
  private pauseKeys: Phaser.Input.Keyboard.Key[] = [];

  constructor() {
    super(SCENE_KEYS.game);
  }

  create(data: GameSceneData): void {
    this.mode = data.mode ?? MODES.onePlayer;
    this.score = 0;
    this.combo = 1;
    this.bestCombo = 1;
    this.p1Score = 0;
    this.p2Score = 0;
    this.ballLive = false;
    this.servePending = false;
    this.kickBindings = [];

    const settings = getAudioSettings(this);
    // The base manager returns BaseSound, which lacks setVolume; both real backends support it.
    this.bgm = this.sound.add(AUDIO_KEYS.bgm, {
      loop: true,
      volume: AUDIO.bgmVolume * settings.volume,
    }) as Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound;
    if (settings.musicOn) {
      this.bgm.play();
    }

    this.add
      .image(GAME_WIDTH / 2, GAME_HEIGHT / 2, TEXTURE_KEYS.background)
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
      .setDepth(-1);

    const groundY = GAME_HEIGHT - GROUND_HEIGHT / 2;
    this.ground = this.physics.add.staticImage(GAME_WIDTH / 2, groundY, TEXTURE_KEYS.ground);
    // The background art already renders its own ground, so this collider stays invisible.
    this.ground.setVisible(false);

    this.spawnCharacters();

    this.ball = new Ball(this, this.initialDropX(), BALL.startDropY);
    this.physics.add.collider(this.ball, this.ground, () => this.onBallGrounded());

    this.bindKickKeys();
    this.createHud();

    new AudioControls(this, (changed) => this.applyAudioSettings(changed));

    if (this.sys.game.device.input.touch && this.mode === MODES.onePlayer) {
      new TouchControls(this, this.player.touchState, () => this.tryKick(this.player));
    }
  }

  update(): void {
    // A scene transition (e.g. quitting to menu) can destroy this scene's physics
    // objects mid-frame while one more update tick is still in flight; bail out rather
    // than touch destroyed bodies.
    if (!this.ball?.body) {
      return;
    }
    this.player.update();
    this.player2?.update();
    this.enemy?.update(this.ball, this.player.x);

    for (const binding of this.kickBindings) {
      if (binding.keys.some((key) => Phaser.Input.Keyboard.JustDown(key))) {
        this.tryKick(binding.kicker);
      }
    }

    if (this.pauseKeys.some((key) => Phaser.Input.Keyboard.JustDown(key))) {
      this.pauseGame();
    }

    // Safety net: the collider callback can be missed on fast bounces, so also
    // handle the ball resting against the ground.
    if (this.ball.body !== null && this.ball.body.blocked.down) {
      this.onBallGrounded();
    }
  }

  private spawnCharacters(): void {
    // Spawn well clear of the ground collider and let gravity settle the characters onto it.
    const spawnY = GAME_HEIGHT - GROUND_HEIGHT - PLAYER.displayHeight;
    const halfWidth = PLAYER.displayWidth / 2;

    if (this.mode === MODES.onePlayer) {
      this.player = new Player(this, GAME_WIDTH * 0.35, spawnY);
      this.enemy = new Enemy(this, GAME_WIDTH * 0.75, spawnY);
      this.physics.add.collider(this.enemy, this.ground);
    } else {
      const versus = this.mode === MODES.versus;
      this.player = new Player(this, GAME_WIDTH * 0.25, spawnY, {
        texture: TEXTURE_KEYS.playerRest,
        idleAnim: ANIM_KEYS.playerIdle,
        kickAnim: ANIM_KEYS.playerKick,
        controls: CONTROLS.p1,
        maxX: versus ? GAME_WIDTH / 2 - halfWidth : undefined,
      });
      this.player2 = new Player(this, GAME_WIDTH * 0.75, spawnY, {
        texture: TEXTURE_KEYS.enemyRest,
        idleAnim: ANIM_KEYS.enemyIdle,
        kickAnim: ANIM_KEYS.enemyKick,
        controls: CONTROLS.p2,
        minX: versus ? GAME_WIDTH / 2 + halfWidth : undefined,
        startFlipX: true,
      });
      this.physics.add.collider(this.player2, this.ground);
      if (versus) {
        // Midline marker so both sides can see their court.
        this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - GROUND_HEIGHT - 55, 4, 110, 0xffffff, 0.5);
      }
    }
    this.physics.add.collider(this.player, this.ground);
  }

  private bindKickKeys(): void {
    const keyboard = this.input.keyboard;
    if (!keyboard) {
      throw new Error("Keyboard input is required for Sipa");
    }
    const bind = (codes: readonly number[], kicker: Player): void => {
      this.kickBindings.push({ keys: codes.map((code) => keyboard.addKey(code)), kicker });
    };
    if (this.mode === MODES.onePlayer) {
      bind(CONTROLS.solo.kick, this.player);
    } else if (this.player2) {
      bind(CONTROLS.p1.kick, this.player);
      bind(CONTROLS.p2.kick, this.player2);
    }
    this.pauseKeys = [Phaser.Input.Keyboard.KeyCodes.ESC, Phaser.Input.Keyboard.KeyCodes.P].map((code) =>
      keyboard.addKey(code),
    );
  }

  private createHud(): void {
    if (this.mode === MODES.versus) {
      this.scoreText = this.add.text(GAME_WIDTH / 2, 16, "0 - 0", HUD_STYLE).setOrigin(0.5, 0);
    } else {
      this.scoreText = this.add.text(16, 16, "Sipa: 0", HUD_STYLE);
      this.comboText = this.add.text(16, 52, "Combo: x1", {
        ...HUD_STYLE,
        fontSize: "20px",
        color: "#ffff88",
        strokeThickness: 3,
      });
    }

    const instructions =
      this.mode === MODES.onePlayer
        ? "Move: <->/AD  Jump: ^/W  Kick: SPACE"
        : "P1: A/D move, W jump, F kick    P2: arrows, SPACE kick";
    this.add
      .text(GAME_WIDTH / 2, 60, instructions, {
        ...HUD_STYLE,
        fontSize: "16px",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    const pauseButton = this.add
      .text(GAME_WIDTH - 16, 104, "[ Pause ]", {
        ...HUD_STYLE,
        fontSize: "18px",
        strokeThickness: 3,
      })
      .setOrigin(1, 0)
      .setInteractive({ useHandCursor: true });
    pauseButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => pauseButton.setColor("#ffff88"));
    pauseButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => pauseButton.setColor("#ffffff"));
    pauseButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => this.pauseGame());
  }

  private pauseGame(): void {
    this.scene.launch(SCENE_KEYS.pause);
    this.scene.pause();
  }

  private initialDropX(): number {
    // Versus serves start on player 1's side; the conceding side serves after each point.
    return this.mode === MODES.versus ? GAME_WIDTH * 0.25 : BALL.startDropX;
  }

  private tryKick(kicker: Player): void {
    if (this.servePending) {
      return;
    }
    const distance = Phaser.Math.Distance.Between(kicker.x, kicker.y, this.ball.x, this.ball.y);
    if (distance > BALL.kickRange) {
      return;
    }
    this.ball.kick(kicker.x);
    kicker.playKick();
    playSfx(this, AUDIO_KEYS.kick);
    this.ballLive = true;
    this.cameras.main.shake(60, 0.004);

    if (this.mode === MODES.versus) {
      return;
    }
    // Consecutive kicks without a ground touch are worth more each time.
    this.score += this.combo;
    this.bestCombo = Math.max(this.bestCombo, this.combo);
    this.combo += 1;
    this.scoreText.setText(`Sipa: ${this.score}`);
    this.comboText?.setText(`Combo: x${this.combo}`);
  }

  private onBallGrounded(): void {
    if (this.mode === MODES.versus) {
      this.onPointConceded();
      return;
    }
    // The drop before the first kick should not end the run.
    if (!this.ballLive) {
      this.combo = 1;
      this.comboText?.setText(`Combo: x${this.combo}`);
      return;
    }
    this.bgm.stop();
    this.scene.start(SCENE_KEYS.gameOver, { mode: this.mode, score: this.score, combo: this.bestCombo });
  }

  private onPointConceded(): void {
    if (this.servePending) {
      return;
    }
    this.servePending = true;
    const concededByP1 = this.ball.x < GAME_WIDTH / 2;
    if (concededByP1) {
      this.p2Score += 1;
    } else {
      this.p1Score += 1;
    }
    this.scoreText.setText(`${this.p1Score} - ${this.p2Score}`);

    if (this.p1Score >= VERSUS.targetScore || this.p2Score >= VERSUS.targetScore) {
      this.bgm.stop();
      this.scene.start(SCENE_KEYS.gameOver, { mode: this.mode, p1: this.p1Score, p2: this.p2Score });
      return;
    }
    const serveX = concededByP1 ? GAME_WIDTH * 0.25 : GAME_WIDTH * 0.75;
    this.time.delayedCall(VERSUS.serveDelayMs, () => this.serve(serveX));
  }

  private serve(x: number): void {
    this.ball.setVelocity(0, 0);
    this.ball.setAngularVelocity(0);
    this.ball.setPosition(x, BALL.startDropY);
    this.ballLive = false;
    this.servePending = false;
  }

  private applyAudioSettings(settings: AudioSettings): void {
    this.bgm.setVolume(AUDIO.bgmVolume * settings.volume);
    if (settings.musicOn && !this.bgm.isPlaying) {
      this.bgm.play();
    } else if (!settings.musicOn && this.bgm.isPlaying) {
      this.bgm.stop();
    }
  }
}
