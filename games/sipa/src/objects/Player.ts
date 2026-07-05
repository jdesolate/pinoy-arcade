import Phaser from "phaser";
import { PLAYER, TEXTURE_KEYS } from "../config";

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys: { left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key; up: Phaser.Input.Keyboard.Key };

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, TEXTURE_KEYS.player);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);

    const keyboard = scene.input.keyboard;
    if (!keyboard) {
      throw new Error("Keyboard input is required for Sipa");
    }
    this.cursors = keyboard.createCursorKeys();
    this.keys = {
      left: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      up: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
    };
  }

  update(): void {
    const left = this.cursors.left.isDown || this.keys.left.isDown;
    const right = this.cursors.right.isDown || this.keys.right.isDown;
    const jump = this.cursors.up.isDown || this.keys.up.isDown;

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
  }
}
