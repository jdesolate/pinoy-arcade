import Phaser from "phaser";
import { BALL, GAME_HEIGHT, GAME_WIDTH, GROUND_HEIGHT, SCENE_KEYS, TEXTURE_KEYS } from "../config";
import { Ball } from "../objects/Ball";
import { Player } from "../objects/Player";

export class GameScene extends Phaser.Scene {
  private player!: Player;
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

    const groundY = GAME_HEIGHT - GROUND_HEIGHT / 2;
    this.ground = this.physics.add.staticImage(GAME_WIDTH / 2, groundY, TEXTURE_KEYS.ground);

    this.player = new Player(this, GAME_WIDTH / 2, GAME_HEIGHT - GROUND_HEIGHT - 40);
    this.physics.add.collider(this.player, this.ground);

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

    if (Phaser.Input.Keyboard.JustDown(this.kickKey)) {
      this.tryKick();
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
