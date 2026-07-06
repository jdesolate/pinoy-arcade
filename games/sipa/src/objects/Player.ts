import Phaser from "phaser";
import { ANIM_KEYS, CONTROLS, PLAYER, TEXTURE_KEYS } from "../config";
import type { ControlScheme } from "../config";

export interface PlayerOptions {
  texture: string;
  idleAnim: string;
  kickAnim: string;
  controls: ControlScheme;
  // Court limits for versus mode; omitted means full-field movement.
  minX?: number;
  maxX?: number;
  startFlipX?: boolean;
}

const DEFAULT_OPTIONS: PlayerOptions = {
  texture: TEXTURE_KEYS.playerRest,
  idleAnim: ANIM_KEYS.playerIdle,
  kickAnim: ANIM_KEYS.playerKick,
  controls: CONTROLS.solo,
};

// Held-button state fed by the on-screen touch controls.
export interface TouchState {
  left: boolean;
  right: boolean;
  jump: boolean;
}

export class Player extends Phaser.Physics.Arcade.Sprite {
  readonly touchState: TouchState = { left: false, right: false, jump: false };
  private leftKeys: Phaser.Input.Keyboard.Key[];
  private rightKeys: Phaser.Input.Keyboard.Key[];
  private upKeys: Phaser.Input.Keyboard.Key[];
  private options: PlayerOptions;

  constructor(scene: Phaser.Scene, x: number, y: number, options: PlayerOptions = DEFAULT_OPTIONS) {
    super(scene, x, y, options.texture);
    this.options = options;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDisplaySize(PLAYER.displayWidth, PLAYER.displayHeight);
    this.setCollideWorldBounds(true);
    if (options.startFlipX === true) {
      this.setFlipX(true);
    }

    const body = this.body as Phaser.Physics.Arcade.Body;
    // Body size is in unscaled texture units; divide out the display scale.
    // Anchor the body to the bottom-center of the frame so the feet sit on the ground.
    const bodyWidth = PLAYER.bodyWidth / this.scaleX;
    const bodyHeight = PLAYER.bodyHeight / this.scaleY;
    body.setSize(bodyWidth, bodyHeight, false);
    body.setOffset((this.width - bodyWidth) / 2, this.height - bodyHeight);

    const keyboard = scene.input.keyboard;
    if (!keyboard) {
      throw new Error("Keyboard input is required for Sipa");
    }
    this.leftKeys = options.controls.left.map((code) => keyboard.addKey(code));
    this.rightKeys = options.controls.right.map((code) => keyboard.addKey(code));
    this.upKeys = options.controls.up.map((code) => keyboard.addKey(code));

    this.play(options.idleAnim);
  }

  playKick(): void {
    this.play(this.options.kickAnim);
    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.play(this.options.idleAnim);
    });
  }

  update(): void {
    const left = this.leftKeys.some((k) => k.isDown) || this.touchState.left;
    const right = this.rightKeys.some((k) => k.isDown) || this.touchState.right;
    const jump = this.upKeys.some((k) => k.isDown) || this.touchState.jump;

    if (left && !right) {
      this.setVelocityX(-PLAYER.moveSpeed);
      this.setFlipX(true);
    } else if (right && !left) {
      this.setVelocityX(PLAYER.moveSpeed);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    if (jump && this.body && this.body.blocked.down) {
      this.setVelocityY(PLAYER.jumpVelocity);
    }

    this.clampToCourt();
  }

  private clampToCourt(): void {
    const { minX, maxX } = this.options;
    if (minX !== undefined && this.x < minX) {
      this.setX(minX);
      this.setVelocityX(Math.max(0, this.body?.velocity.x ?? 0));
    }
    if (maxX !== undefined && this.x > maxX) {
      this.setX(maxX);
      this.setVelocityX(Math.min(0, this.body?.velocity.x ?? 0));
    }
  }
}
