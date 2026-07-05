import Phaser from "phaser";
import { ENEMY, GAME_WIDTH, PLAYER, TEXTURE_KEYS } from "../config";
import type { Ball } from "./Ball";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private lastKickAt = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, TEXTURE_KEYS.enemy);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDisplaySize(PLAYER.displayWidth, PLAYER.displayHeight);
    this.setCollideWorldBounds(true);
    this.setFlipX(true);

    const body = this.body as Phaser.Physics.Arcade.Body;
    const bodyWidth = PLAYER.bodyWidth / this.scaleX;
    const bodyHeight = PLAYER.bodyHeight / this.scaleY;
    body.setSize(bodyWidth, bodyHeight, false);
    body.setOffset((this.width - bodyWidth) / 2, this.height - bodyHeight);
  }

  update(ball: Ball, playerX: number): void {
    this.chase(ball);
    this.tryReturn(ball, playerX);
  }

  private chase(ball: Ball): void {
    // Only chase while the ball is on the enemy's side; otherwise wait near the middle of it.
    const targetX = ball.x >= ENEMY.minX ? ball.x : (ENEMY.minX + GAME_WIDTH) / 2;
    const clampedX = Phaser.Math.Clamp(targetX, ENEMY.minX, GAME_WIDTH - PLAYER.displayWidth / 2);
    const distance = clampedX - this.x;

    if (Math.abs(distance) < 8) {
      this.setVelocityX(0);
      return;
    }
    this.setVelocityX(Math.sign(distance) * ENEMY.moveSpeed);
    this.setFlipX(distance < 0);
  }

  private tryReturn(ball: Ball, playerX: number): void {
    const now = this.scene.time.now;
    if (now - this.lastKickAt < ENEMY.kickCooldownMs) {
      return;
    }
    const falling = ball.body !== null && ball.body.velocity.y > 0;
    const inRange = Phaser.Math.Distance.Between(this.x, this.y, ball.x, ball.y) <= ENEMY.kickRange;
    if (!falling || !inRange || ball.x < ENEMY.minX) {
      return;
    }
    ball.returnKick(playerX);
    this.lastKickAt = now;
  }
}
