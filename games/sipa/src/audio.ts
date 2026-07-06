import Phaser from "phaser";
import { AUDIO, REGISTRY_KEYS } from "./config";

export interface AudioSettings {
  musicOn: boolean;
  sfxOn: boolean;
  volume: number;
}

const STORAGE_KEY = "sipa-audio-settings";

const DEFAULT_SETTINGS: AudioSettings = {
  musicOn: true,
  sfxOn: true,
  volume: AUDIO.defaultVolume,
};

function isAudioSettings(value: unknown): value is AudioSettings {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const v = value as Record<string, unknown>;
  return typeof v.musicOn === "boolean" && typeof v.sfxOn === "boolean" && typeof v.volume === "number";
}

function loadStoredSettings(): AudioSettings {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const parsed: unknown = JSON.parse(raw);
      if (isAudioSettings(parsed)) {
        return { ...parsed, volume: Phaser.Math.Clamp(parsed.volume, 0, 1) };
      }
    }
  } catch {
    // Storage unavailable or corrupt; fall back to defaults.
  }
  return { ...DEFAULT_SETTINGS };
}

// The registry is shared across scenes, so settings survive scene restarts.
export function getAudioSettings(scene: Phaser.Scene): AudioSettings {
  const existing: unknown = scene.registry.get(REGISTRY_KEYS.audioSettings);
  if (isAudioSettings(existing)) {
    return existing;
  }
  const loaded = loadStoredSettings();
  scene.registry.set(REGISTRY_KEYS.audioSettings, loaded);
  return loaded;
}

export function updateAudioSettings(scene: Phaser.Scene, changes: Partial<AudioSettings>): AudioSettings {
  const next = { ...getAudioSettings(scene), ...changes };
  next.volume = Phaser.Math.Clamp(next.volume, 0, 1);
  scene.registry.set(REGISTRY_KEYS.audioSettings, next);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Persisting is best-effort; the in-game registry still holds the value.
  }
  return next;
}

export function playSfx(scene: Phaser.Scene, key: string): void {
  const settings = getAudioSettings(scene);
  if (settings.sfxOn) {
    scene.sound.play(key, { volume: settings.volume });
  }
}
