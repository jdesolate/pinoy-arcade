import Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH, SCENE_KEYS } from "../config";

interface GameOverData {
  score: number;
}

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.gameOver);
  }

  create(data: GameOverData): void {
    const centerX = GAME_WIDTH / 2;

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
      .text(centerX, GAME_HEIGHT * 0.5, `You kept the sipa up ${data.score} time${data.score === 1 ? "" : "s"}!`, {
        fontFamily: "monospace",
        fontSize: "24px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, GAME_HEIGHT * 0.65, "Press SPACE to play again", {
        fontFamily: "monospace",
        fontSize: "20px",
        color: "#ffff88",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.input.keyboard?.once("keydown-SPACE", () => {
      this.scene.start(SCENE_KEYS.game);
    });
  }
}
