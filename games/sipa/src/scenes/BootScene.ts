import Phaser from "phaser";
import {
  ANIM,
  ANIM_KEYS,
  ASSET_PATHS,
  AUDIO_KEYS,
  COLORS,
  GAME_WIDTH,
  GROUND_HEIGHT,
  SCENE_KEYS,
  TEXTURE_KEYS,
} from "../config";

// Ground is a small procedural strip; the characters and takyan are AI-generated sprites.
export class BootScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.boot);
  }

  preload(): void {
    this.load.image(TEXTURE_KEYS.playerRest, ASSET_PATHS.playerRest);
    this.load.image(TEXTURE_KEYS.playerBounce, ASSET_PATHS.playerBounce);
    this.load.image(TEXTURE_KEYS.playerKick1, ASSET_PATHS.playerKick1);
    this.load.image(TEXTURE_KEYS.playerKick2, ASSET_PATHS.playerKick2);
    this.load.image(TEXTURE_KEYS.playerKick3, ASSET_PATHS.playerKick3);
    this.load.image(TEXTURE_KEYS.enemyRest, ASSET_PATHS.enemyRest);
    this.load.image(TEXTURE_KEYS.enemyBounce, ASSET_PATHS.enemyBounce);
    this.load.image(TEXTURE_KEYS.enemyKick1, ASSET_PATHS.enemyKick1);
    this.load.image(TEXTURE_KEYS.enemyKick2, ASSET_PATHS.enemyKick2);
    this.load.image(TEXTURE_KEYS.enemyKick3, ASSET_PATHS.enemyKick3);
    this.load.image(TEXTURE_KEYS.ball, ASSET_PATHS.ball);
    this.load.image(TEXTURE_KEYS.background, ASSET_PATHS.background);
    this.load.audio(AUDIO_KEYS.kick, ASSET_PATHS.kickSfx);
    this.load.audio(AUDIO_KEYS.bgm, ASSET_PATHS.bgm);
    this.load.audio(AUDIO_KEYS.gameOver, ASSET_PATHS.gameOverSfx);
  }

  create(): void {
    this.createGroundTexture();
    this.createAnimations();
    this.scene.start(SCENE_KEYS.game);
  }

  private createAnimations(): void {
    // Frames live in separate single-image textures, so animations reference texture keys directly.
    this.anims.create({
      key: ANIM_KEYS.playerIdle,
      frames: [{ key: TEXTURE_KEYS.playerRest }, { key: TEXTURE_KEYS.playerBounce }],
      frameRate: ANIM.idleFrameRate,
      repeat: -1,
    });
    this.anims.create({
      key: ANIM_KEYS.playerKick,
      frames: [
        { key: TEXTURE_KEYS.playerKick1 },
        { key: TEXTURE_KEYS.playerKick2 },
        { key: TEXTURE_KEYS.playerKick3 },
      ],
      frameRate: ANIM.kickFrameRate,
      repeat: 0,
    });
    this.anims.create({
      key: ANIM_KEYS.enemyIdle,
      frames: [{ key: TEXTURE_KEYS.enemyRest }, { key: TEXTURE_KEYS.enemyBounce }],
      frameRate: ANIM.idleFrameRate,
      repeat: -1,
    });
    this.anims.create({
      key: ANIM_KEYS.enemyKick,
      frames: [
        { key: TEXTURE_KEYS.enemyKick1 },
        { key: TEXTURE_KEYS.enemyKick2 },
        { key: TEXTURE_KEYS.enemyKick3 },
      ],
      frameRate: ANIM.kickFrameRate,
      repeat: 0,
    });
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
