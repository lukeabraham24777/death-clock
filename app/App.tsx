import React, { useEffect, useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { Audio } from 'expo-av';

export default function App() {
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadAndPlay = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });

        const { sound } = await Audio.Sound.createAsync(
          require('./assets/background-music.wav'),
          { isLooping: true, volume: 0.4 }
        );

        if (mounted) {
          soundRef.current = sound;
          sound.playAsync(); // don’t await here
        }
      } catch (e) {
        console.log('Audio playback not available:', e);
      }
    };

    loadAndPlay();

    return () => {
      mounted = false;
      if (soundRef.current) {
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