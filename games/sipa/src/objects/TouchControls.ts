import Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH, TOUCH } from "../config";
import type { TouchState } from "./Player";

// Semi-transparent on-screen buttons for touch devices: move/jump bottom-left, kick bottom-right.
export class TouchControls {
  constructor(
    private scene: Phaser.Scene,
    state: TouchState,
    onKick: () => void,
  ) {
    scene.input.addPointer(TOUCH.extraPointers);

    const y = GAME_HEIGHT - TOUCH.margin - TOUCH.buttonRadius;
    const step = TOUCH.buttonRadius * 2 + TOUCH.margin;
    const leftX = TOUCH.margin + TOUCH.buttonRadius;

    this.holdButton(leftX, y, "<", (down) => {
      state.left = down;
    });
    this.holdButton(leftX + step, y, ">", (down) => {
      state.right = down;
    });
    this.holdButton(leftX + step * 2, y, "^", (down) => {
      state.jump = down;
    });
    this.holdButton(GAME_WIDTH - TOUCH.margin - TOUCH.buttonRadius, y, "KICK", (down) => {
      if (down) {
        onKick();
      }
    });
  }

  private holdButton(x: number, y: number, label: string, onHold: (down: boolean) => void): void {
    const circle = this.scene.add
      .circle(x, y, TOUCH.buttonRadius, 0x000000, TOUCH.alpha)
      .setStrokeStyle(2, 0xffffff, TOUCH.alpha)
      // Hit areas are in local space with the origin at the top-left of the bounds.
      .setInteractive(
        new Phaser.Geom.Circle(TOUCH.buttonRadius, TOUCH.buttonRadius, TOUCH.buttonRadius),
        Phaser.Geom.Circle.Contains,
      )
      .setDepth(10);
    this.scene.add
      .text(x, y, label, {
        fontFamily: "monospace",
        fontSize: label.length > 1 ? "18px" : "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setAlpha(TOUCH.alpha + 0.3)
      .setDepth(10);

    circle.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => onHold(true));
    circle.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => onHold(false));
    circle.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => onHold(false));
  }
}
