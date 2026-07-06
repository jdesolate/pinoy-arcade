import Phaser from "phaser";
import { playSfx } from "../audio";
import { AUDIO_KEYS, GAME_HEIGHT, GAME_WIDTH, MODES, SCENE_KEYS } from "../config";
import type { GameMode } from "../config";

interface RallyResult {
  mode: typeof MODES.onePlayer | typeof MODES.coop;
  score: number;
  combo: number;
}

interface VersusResult {
  mode: typeof MODES.versus;
  p1: number;
  p2: number;
}

type GameOverData = RallyResult | VersusResult;

const TEXT_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  fontFamily: "monospace",
  color: "#ffffff",
  stroke: "#000000",
  strokeThickness: 4,
};

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.gameOver);
  }

  create(data: GameOverData): void {
    const centerX = GAME_WIDTH / 2;

    playSfx(this, AUDIO_KEYS.gameOver);

    const title = data.mode === MODES.versus ? (data.p1 > data.p2 ? "PLAYER 1 WINS!" : "PLAYER 2 WINS!") : "GAME OVER";
    this.add.text(centerX, GAME_HEIGHT * 0.35, title, { ...TEXT_STYLE, fontSize: "48px", strokeThickness: 6 }).setOrigin(0.5);

    if (data.mode === MODES.versus) {
      this.add
        .text(centerX, GAME_HEIGHT * 0.5, `Final score: ${data.p1} - ${data.p2}`, { ...TEXT_STYLE, fontSize: "24px" })
        .setOrigin(0.5);
    } else {
      this.add
        .text(centerX, GAME_HEIGHT * 0.5, `Final score: ${data.score}`, { ...TEXT_STYLE, fontSize: "24px" })
        .setOrigin(0.5);
      this.add
        .text(centerX, GAME_HEIGHT * 0.58, `Best combo: x${data.combo}`, {
          ...TEXT_STYLE,
          fontSize: "20px",
          color: "#ffff88",
        })
        .setOrigin(0.5);
    }

    this.add
      .text(centerX, GAME_HEIGHT * 0.7, "SPACE/tap: play again   M: menu", {
        ...TEXT_STYLE,
        fontSize: "20px",
        color: "#ffff88",
      })
      .setOrigin(0.5);

    this.input.keyboard?.once("keydown-SPACE", () => this.restart(data.mode));
    this.input.keyboard?.once("keydown-M", () => this.goTo(SCENE_KEYS.menu));
    this.input.once(Phaser.Input.Events.POINTER_DOWN, () => this.restart(data.mode));
  }

  private restart(mode: GameMode): void {
    this.goTo(SCENE_KEYS.game, { mode });
  }

  private goTo(scene: string, data?: object): void {
    // The stinger can outlast this scene; cut it so it never overlaps the next run's music.
    this.sound.stopByKey(AUDIO_KEYS.gameOver);
    this.scene.start(scene, data);
  }
}
