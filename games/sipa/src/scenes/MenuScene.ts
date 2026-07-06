import Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH, MODES, SCENE_KEYS, TEXTURE_KEYS } from "../config";
import type { GameMode } from "../config";

const OPTIONS: { label: string; mode: GameMode; key: string }[] = [
  { label: "1  Solo vs computer", mode: MODES.onePlayer, key: "keydown-ONE" },
  { label: "2  Two players - versus", mode: MODES.versus, key: "keydown-TWO" },
  { label: "3  Two players - co-op rally", mode: MODES.coop, key: "keydown-THREE" },
];

export class MenuScene extends Phaser.Scene {
  constructor() {
    super(SCENE_KEYS.menu);
  }

  create(): void {
    const centerX = GAME_WIDTH / 2;

    this.add
      .image(centerX, GAME_HEIGHT / 2, TEXTURE_KEYS.background)
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
      .setDepth(-1);

    this.add
      .text(centerX, GAME_HEIGHT * 0.22, "SIPA", {
        fontFamily: "monospace",
        fontSize: "72px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
      })
      .setOrigin(0.5);

    OPTIONS.forEach((option, index) => {
      const text = this.add
        .text(centerX, GAME_HEIGHT * (0.42 + index * 0.1), option.label, {
          fontFamily: "monospace",
          fontSize: "26px",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 4,
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });
      text.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => text.setColor("#ffff88"));
      text.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => text.setColor("#ffffff"));
      text.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => this.startGame(option.mode));
      this.input.keyboard?.on(option.key, () => this.startGame(option.mode));
    });

    this.add
      .text(centerX, GAME_HEIGHT * 0.82, "P1: A/D move, W jump, F kick   P2: arrows move/jump, SPACE kick", {
        fontFamily: "monospace",
        fontSize: "15px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5);
  }

  private startGame(mode: GameMode): void {
    this.scene.start(SCENE_KEYS.game, { mode });
  }
}
