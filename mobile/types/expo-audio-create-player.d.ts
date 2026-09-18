import type { AudioPlayer, AudioPlayerOptions, AudioSource } from "expo-audio";

declare module "expo-audio" {
  export function createAudioPlayer(
    source?: AudioSource,
    options?: AudioPlayerOptions,
  ): AudioPlayer;
}
