import Phaser from "phaser";
import { ASSET_PATHS, COLORS, GAME_WIDTH, GROUND_HEIGHT, SCENE_KEYS, TEXTURE_KEYS } from "../config";

// Ground is a small procedural strip; the character and takyan are AI-generated sprites.
export class BootScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.boot);
  }

  preload(): void {
    this.load.image(TEXTURE_KEYS.player, ASSET_PATHS.player);
    this.load.image(TEXTURE_KEYS.enemy, ASSET_PATHS.enemy);
    this.load.image(TEXTURE_KEYS.ball, ASSET_PATHS.ball);
    this.load.image(TEXTURE_KEYS.background, ASSET_PATHS.background);
  }

  create(): void {
    this.createGroundTexture();
    this.scene.start(SCENE_KEYS.game);
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
