import Phaser from "phaser";
import { getAudioSettings, updateAudioSettings } from "../audio";
import type { AudioSettings } from "../audio";
import { AUDIO, GAME_WIDTH } from "../config";

const STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  fontFamily: "monospace",
  fontSize: "18px",
  color: "#ffffff",
  stroke: "#000000",
  strokeThickness: 3,
};

// Text-based settings HUD in the top-right corner: music toggle, sfx toggle, volume steppers.
export class AudioControls {
  private musicText: Phaser.GameObjects.Text;
  private sfxText: Phaser.GameObjects.Text;
  private volumeText: Phaser.GameObjects.Text;

  constructor(
    private scene: Phaser.Scene,
    private onChange: (settings: AudioSettings) => void,
  ) {
    const right = GAME_WIDTH - 16;
    this.musicText = this.addButton(right, 16, () => this.toggleMusic());
    this.sfxText = this.addButton(right, 44, () => this.toggleSfx());
    this.volumeText = this.addButton(right - 96, 72, () => undefined).disableInteractive();
    this.addButton(right - 24, 72, () => this.stepVolume(AUDIO.volumeStep)).setText("[+]");
    this.addButton(right - 60, 72, () => this.stepVolume(-AUDIO.volumeStep)).setText("[-]");
    this.refresh(getAudioSettings(scene));
  }

  private addButton(x: number, y: number, onClick: () => void): Phaser.GameObjects.Text {
    return this.scene.add
      .text(x, y, "", STYLE)
      .setOrigin(1, 0)
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.POINTER_DOWN, onClick);
  }

  private toggleMusic(): void {
    const settings = getAudioSettings(this.scene);
    this.apply(updateAudioSettings(this.scene, { musicOn: !settings.musicOn }));
  }

  private toggleSfx(): void {
    const settings = getAudioSettings(this.scene);
    this.apply(updateAudioSettings(this.scene, { sfxOn: !settings.sfxOn }));
  }

  private stepVolume(delta: number): void {
    const settings = getAudioSettings(this.scene);
    this.apply(updateAudioSettings(this.scene, { volume: settings.volume + delta }));
  }

  private apply(settings: AudioSettings): void {
    this.refresh(settings);
    this.onChange(settings);
  }

  private refresh(settings: AudioSettings): void {
    this.musicText.setText(`Music: ${settings.musicOn ? "ON" : "OFF"}`);
    this.sfxText.setText(`SFX: ${settings.sfxOn ? "ON" : "OFF"}`);
    this.volumeText.setText(`Vol ${Math.round(settings.volume * 100)}%`);
  }
}
