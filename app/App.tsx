import React, { useEffect, useRef, useCallback } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { Audio, AVPlaybackStatus } from 'expo-av';

// --- Audio crossfade config ---
const TARGET_VOLUME = 0.4;     // Normal playback volume
const FADE_DURATION = 2000;    // Fade in/out duration in ms
const FADE_STEPS = 20;         // Number of volume steps during fade
const FADE_INTERVAL = FADE_DURATION / FADE_STEPS; // ms between each step
const FADE_OUT_BUFFER = 2500;  // Start fading out this many ms before track ends

export default function App() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const isFadingOut = useRef(false);
  const fadeTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);

  // Smooth fade: ramp volume from `from` to `to` over FADE_DURATION ms
  const fadeVolume = useCallback((from: number, to: number, onComplete?: () => void) => {
    if (fadeTimer.current) clearInterval(fadeTimer.current);

    const sound = soundRef.current;
    if (!sound) { onComplete?.(); return; }

    let step = 0;
    const delta = (to - from) / FADE_STEPS;

    fadeTimer.current = setInterval(async () => {
      step++;
      const vol = Math.max(0, Math.min(1, from + delta * step));

      try {
        if (mountedRef.current && soundRef.current) {
          await soundRef.current.setVolumeAsync(vol);
        }
      } catch { /* sound may have been unloaded */ }

      if (step >= FADE_STEPS) {
        if (fadeTimer.current) clearInterval(fadeTimer.current);
        fadeTimer.current = null;
        onComplete?.();
      }
    }, FADE_INTERVAL);
  }, []);

  // Restart track from beginning with fade-in
  const restartWithFadeIn = useCallback(async () => {
    const sound = soundRef.current;
    if (!sound || !mountedRef.current) return;

    try {
      isFadingOut.current = false;
      await sound.setPositionAsync(0);
      await sound.setVolumeAsync(0);
      await sound.playAsync();
      fadeVolume(0, TARGET_VOLUME);
    } catch (e) {
      console.log('Restart failed:', e);
    }
  }, [fadeVolume]);

  // Monitor playback position — trigger fade-out near end
  const onPlaybackStatus = useCallback((status: AVPlaybackStatus) => {
    if (!status.isLoaded || !mountedRef.current) return;

    const { positionMillis, durationMillis, didJustFinish } = status;

    // Track finished — restart with fade-in
    if (didJustFinish) {
      restartWithFadeIn();
      return;
    }

    // Near the end? Start fading out (only once per loop)
    if (
      durationMillis &&
      durationMillis > FADE_OUT_BUFFER &&
      positionMillis >= durationMillis - FADE_OUT_BUFFER &&
      !isFadingOut.current
    ) {
      isFadingOut.current = true;
      fadeVolume(TARGET_VOLUME, 0);
    }
  }, [fadeVolume, restartWithFadeIn]);

  useEffect(() => {
    mountedRef.current = true;

    const loadAndPlay = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });

        const { sound } = await Audio.Sound.createAsync(
          require('./assets/background-music.wav'),
          {
            isLooping: false,  // We handle looping manually for crossfade
            volume: 0,         // Start silent, will fade in
            progressUpdateIntervalMillis: 500,
          }
        );

        if (!mountedRef.current) {
          await sound.unloadAsync();
          return;
        }

        soundRef.current = sound;
        sound.setOnPlaybackStatusUpdate(onPlaybackStatus);

        // Start playing with fade-in
        await sound.playAsync();
        fadeVolume(0, TARGET_VOLUME);
      } catch (e) {
        console.log('Audio playback not available:', e);
      }
    };

    loadAndPlay();

    return () => {
      mountedRef.current = false;
      if (fadeTimer.current) clearInterval(fadeTimer.current);
      if (soundRef.current) {
        soundRef.current.setOnPlaybackStatusUpdate(null);
        soundRef.current.stopAsync().then(() => soundRef.current?.unloadAsync());
      }
    };
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
