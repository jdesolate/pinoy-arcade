import Phaser from "phaser";
import { BALL, COLORS, GAME_WIDTH, GROUND_HEIGHT, PLAYER, SCENE_KEYS, TEXTURE_KEYS } from "../config";

// Generates placeholder textures procedurally so the MVP ships with zero binary assets.
export class BootScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.boot);
  }

  create(): void {
    this.createPlayerTexture();
    this.createBallTexture();
    this.createGroundTexture();
    this.scene.start(SCENE_KEYS.game);
  }

  private createPlayerTexture(): void {
    const g = this.add.graphics();
    const { width, height } = PLAYER;
    g.fillStyle(COLORS.player);
    g.fillRoundedRect(0, height * 0.3, width, height * 0.7, 8);
    g.fillStyle(COLORS.playerSkin);
    g.fillCircle(width / 2, height * 0.18, height * 0.18);
    g.generateTexture(TEXTURE_KEYS.player, width, height);
    g.destroy();
  }

  private createBallTexture(): void {
    const g = this.add.graphics();
    const d = BALL.radius * 2;
    g.fillStyle(COLORS.ball);
    g.fillCircle(BALL.radius, BALL.radius, BALL.radius);
    g.fillStyle(COLORS.ballTrim);
    g.fillCircle(BALL.radius, BALL.radius, BALL.radius * 0.4);
    g.generateTexture(TEXTURE_KEYS.ball, d, d);
    g.destroy();
  }

  private createGroundTexture(): void {
    const g = this.add.graphics();
    g.fillStyle(COLORS.ground);
    g.fillRect(0, 0, GAME_WIDTH, GROUND_HEIGHT);
    g.fillStyle(COLORS.grass);
    g.fillRect(0, 0, GAME_WIDTH, GROUND_HEIGHT * 0.25);
    g.generateTexture(TEXTURE_KEYS.ground, GAME_WIDTH, GROUND_HEIGHT);
    g.destroy();
  }
}
