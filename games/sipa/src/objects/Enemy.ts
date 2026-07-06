import Phaser from "phaser";
import { playSfx } from "../audio";
import { ANIM_KEYS, AUDIO_KEYS, ENEMY, GAME_WIDTH, PLAYER, TEXTURE_KEYS } from "../config";
import type { Ball } from "./Ball";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private lastKickAt = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, TEXTURE_KEYS.enemyRest);
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

    this.play(ANIM_KEYS.enemyIdle);
  }

  private playKick(): void {
    this.play(ANIM_KEYS.enemyKick);
    this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.play(ANIM_KEYS.enemyIdle);
    });
  }

  update(ball: Ball, playerX: number): void {
    // The scene can transition mid-frame (e.g. quitting to menu) and destroy this
    // sprite's or the ball's physics body before its own update loop stops calling us.
    if (!this.body || !ball.body) {
      return;
    }
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
    this.playKick();
    playSfx(this.scene, AUDIO_KEYS.kick);
    this.lastKickAt = now;
  }
}
