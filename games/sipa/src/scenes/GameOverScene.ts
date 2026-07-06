import Phaser from "phaser";
import { playSfx } from "../audio";
import { AUDIO_KEYS, GAME_HEIGHT, GAME_WIDTH, SCENE_KEYS } from "../config";

interface GameOverData {
  score: number;
  combo: number;
}

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.gameOver);
  }

  create(data: GameOverData): void {
    const centerX = GAME_WIDTH / 2;

    playSfx(this, AUDIO_KEYS.gameOver);

    this.add
      .text(centerX, GAME_HEIGHT * 0.35, "GAME OVER", {
        fontFamily: "monospace",
        fontSize: "48px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, GAME_HEIGHT * 0.5, `Final score: ${data.score}`, {
        fontFamily: "monospace",
        fontSize: "24px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, GAME_HEIGHT * 0.58, `Best combo: x${data.combo}`, {
        fontFamily: "monospace",
        fontSize: "20px",
        color: "#ffff88",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, GAME_HEIGHT * 0.7, "Press SPACE to play again", {
        fontFamily: "monospace",
        fontSize: "20px",
        color: "#ffff88",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.input.keyboard?.once("keydown-SPACE", () => {
      // The stinger can outlast this scene; cut it so it never overlaps the next run's music.
      this.sound.stopByKey(AUDIO_KEYS.gameOver);
      this.scene.start(SCENE_KEYS.game);
    });
  }
}
