import Phaser from "phaser";
import { ANIM_KEYS, PLAYER, TEXTURE_KEYS } from "../config";

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys: { left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key; up: Phaser.Input.Keyboard.Key };

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, TEXTURE_KEYS.playerRest);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDisplaySize(PLAYER.displayWidth, PLAYER.displayHeight);
    this.setCollideWorldBounds(true);

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
    this.cursors = keyboard.createCursorKeys();
    this.keys = {
      left: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      up: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
    };

    this.play(ANIM_KEYS.playerIdle);
  }

  playKick(): void {
    this.play(ANIM_KEYS.playerKick);
    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.play(ANIM_KEYS.playerIdle);
    });
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
