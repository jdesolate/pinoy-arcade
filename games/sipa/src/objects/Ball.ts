import Phaser from "phaser";
import { BALL, TEXTURE_KEYS } from "../config";

export class Ball extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, TEXTURE_KEYS.ball);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCircle(BALL.radius);
    this.setBounce(BALL.bounce, BALL.bounce);
    this.setCollideWorldBounds(true);
  }

  kick(fromX: number): void {
    // Offset from the kicker steers the ball, like a real sipa flick.
    const offset = this.x - fromX;
    const vx = Phaser.Math.Clamp(offset * BALL.kickSpinFactor, -BALL.maxVelocityX, BALL.maxVelocityX);
    this.setVelocity(vx, BALL.kickVelocityY);
    this.setAngularVelocity(vx * 2);
  }
}
