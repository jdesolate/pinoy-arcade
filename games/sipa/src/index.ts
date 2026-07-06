import Phaser from "phaser";
import { COLORS, GAME_HEIGHT, GAME_WIDTH, GRAVITY_Y } from "./config";
import { BootScene } from "./scenes/BootScene";
import { GameOverScene } from "./scenes/GameOverScene";
import { GameScene } from "./scenes/GameScene";
import { MenuScene } from "./scenes/MenuScene";
import { PauseScene } from "./scenes/PauseScene";

export function createSipaGame(parent: HTMLElement): Phaser.Game {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: COLORS.sky,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: GRAVITY_Y },
      },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, MenuScene, GameScene, PauseScene, GameOverScene],
  });
}
