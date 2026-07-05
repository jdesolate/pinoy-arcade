import Phaser from "phaser";
import { BALL, TEXTURE_KEYS } from "../config";

export class Ball extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, TEXTURE_KEYS.ball);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDisplaySize(BALL.displayWidth, BALL.displayHeight);
    this.setBounce(BALL.bounce, BALL.bounce);
    this.setCollideWorldBounds(true);

    // Circle values are in unscaled texture units; divide out the display scale.
    // Anchor the circle to the bottom-center of the frame so it wraps the woven base.
    const radius = BALL.bodyRadius / this.scaleX;
    const offsetX = this.width / 2 - radius;
    const offsetY = this.height - radius * 2;
    this.setCircle(radius, offsetX, offsetY);
  }

  kick(fromX: number): void {
    // Offset from the kicker steers the ball, like a real sipa flick.
    const offset = this.x - fromX;
    const vx = Phaser.Math.Clamp(offset * BALL.kickSpinFactor, -BALL.maxVelocityX, BALL.maxVelocityX);
    this.setVelocity(vx, BALL.kickVelocityY);
    this.setAngularVelocity(vx * 2);
  }

  returnKick(targetX: number): void {
    // Enemy return: aim the ball back toward a spot on the player's side.
    const vx = Phaser.Math.Clamp((targetX - this.x) * BALL.returnFactor, -BALL.maxVelocityX, BALL.maxVelocityX);
    this.setVelocity(vx, BALL.kickVelocityY);
    this.setAngularVelocity(vx * 2);
  }
}
