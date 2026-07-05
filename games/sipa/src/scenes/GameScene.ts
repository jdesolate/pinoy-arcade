import Phaser from "phaser";
import { BALL, GAME_HEIGHT, GAME_WIDTH, GROUND_HEIGHT, PLAYER, SCENE_KEYS, TEXTURE_KEYS } from "../config";
import { Ball } from "../objects/Ball";
import { Enemy } from "../objects/Enemy";
import { Player } from "../objects/Player";

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private enemy!: Enemy;
  private ball!: Ball;
  private ground!: Phaser.Physics.Arcade.Image;
  private kickKey!: Phaser.Input.Keyboard.Key;
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private ballLive = false;

  constructor() {
    super(SCENE_KEYS.game);
  }

  create(): void {
    this.score = 0;
    this.ballLive = false;

    this.add
      .image(GAME_WIDTH / 2, GAME_HEIGHT / 2, TEXTURE_KEYS.background)
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
      .setDepth(-1);

    const groundY = GAME_HEIGHT - GROUND_HEIGHT / 2;
    this.ground = this.physics.add.staticImage(GAME_WIDTH / 2, groundY, TEXTURE_KEYS.ground);
    // The background art already renders its own ground, so this collider stays invisible.
    this.ground.setVisible(false);

    // Spawn well clear of the ground collider and let gravity settle the player onto it,
    // rather than placing it at a fixed offset that can overlap the ground on sprite resize.
    const spawnY = GAME_HEIGHT - GROUND_HEIGHT - PLAYER.displayHeight;
    this.player = new Player(this, GAME_WIDTH * 0.35, spawnY);
    this.physics.add.collider(this.player, this.ground);

    this.enemy = new Enemy(this, GAME_WIDTH * 0.75, spawnY);
    this.physics.add.collider(this.enemy, this.ground);

    this.ball = new Ball(this, BALL.startDropX, BALL.startDropY);
    this.physics.add.collider(this.ball, this.ground, () => this.onBallGrounded());

    const keyboard = this.input.keyboard;
    if (!keyboard) {
      throw new Error("Keyboard input is required for Sipa");
    }
    this.kickKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.scoreText = this.add.text(16, 16, "Sipa: 0", {
      fontFamily: "monospace",
      fontSize: "28px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 4,
    });

    this.add
      .text(GAME_WIDTH / 2, 60, "Move: ←→/AD  Jump: ↑/W  Kick: SPACE", {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5);
  }

  update(): void {
    this.player.update();
    this.enemy.update(this.ball, this.player.x);

    if (Phaser.Input.Keyboard.JustDown(this.kickKey)) {
      this.tryKick();
    }

    // Safety net: the collider callback can be missed on fast bounces, so also
    // end the run whenever the live ball is resting against the ground.
    if (this.ballLive && this.ball.body !== null && this.ball.body.blocked.down) {
      this.onBallGrounded();
    }
  }

  private tryKick(): void {
    const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.ball.x, this.ball.y);
    if (distance > BALL.kickRange) {
      return;
    }
    this.ball.kick(this.player.x);
    this.ballLive = true;
    this.score += 1;
    this.scoreText.setText(`Sipa: ${this.score}`);
    this.cameras.main.shake(60, 0.004);
  }

  private onBallGrounded(): void {
    // The drop before the first kick should not end the run.
    if (!this.ballLive) {
      return;
    }
    this.scene.start(SCENE_KEYS.gameOver, { score: this.score });
  }
}
