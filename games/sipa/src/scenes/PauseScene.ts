import Phaser from "phaser";
import { AUDIO_KEYS, GAME_HEIGHT, GAME_WIDTH, SCENE_KEYS } from "../config";

const TEXT_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  fontFamily: "monospace",
  color: "#ffffff",
  stroke: "#000000",
  strokeThickness: 4,
};

// Overlay launched on top of a paused GameScene.
export class PauseScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.pause);
  }

  create(): void {
    const centerX = GAME_WIDTH / 2;

    this.add.rectangle(centerX, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.55);

    this.add.text(centerX, GAME_HEIGHT * 0.32, "PAUSED", { ...TEXT_STYLE, fontSize: "48px", strokeThickness: 6 }).setOrigin(0.5);

    this.addButton(centerX, GAME_HEIGHT * 0.5, "Resume (ESC)", () => this.resumeGame());
    this.addButton(centerX, GAME_HEIGHT * 0.6, "Quit to menu (M)", () => this.quitToMenu());

    this.input.keyboard?.once("keydown-ESC", () => this.resumeGame());
    this.input.keyboard?.once("keydown-P", () => this.resumeGame());
    this.input.keyboard?.once("keydown-M", () => this.quitToMenu());
  }

  private addButton(x: number, y: number, label: string, onClick: () => void): void {
    const text = this.add
      .text(x, y, label, { ...TEXT_STYLE, fontSize: "24px" })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    text.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => text.setColor("#ffff88"));
    text.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => text.setColor("#ffffff"));
    text.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, onClick);
  }

  private resumeGame(): void {
    this.scene.stop();
    this.scene.resume(SCENE_KEYS.game);
  }

  private quitToMenu(): void {
    // The music belongs to the paused GameScene; stop it before abandoning that scene.
    this.sound.stopByKey(AUDIO_KEYS.bgm);
    this.scene.stop(SCENE_KEYS.game);
    this.scene.start(SCENE_KEYS.menu);
  }
}
