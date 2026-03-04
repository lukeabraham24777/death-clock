import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme } from '../theme';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const { width } = Dimensions.get('window');

export default function SplashScreen({ navigation }: Props) {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.6)).current;
  const glowScale = useRef(new Animated.Value(0.8)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;
  const ring2Opacity = useRef(new Animated.Value(0)).current;
  const hourglassScale = useRef(new Animated.Value(0.3)).current;
  const particleAnims = useRef(
    Array.from({ length: 8 }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(0),
      translateX: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    // Hourglass entrance: scale up + start spinning
    Animated.parallel([
      Animated.spring(hourglassScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(ringOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous spin
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 2400,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      })
    ).start();

    // Pulsing glow behind hourglass
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow scale pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowScale, {
          toValue: 1.3,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowScale, {
          toValue: 0.8,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Outer ring fade in
    Animated.timing(ring2Opacity, {
      toValue: 0.5,
      duration: 1000,
      delay: 400,
      useNativeDriver: true,
    }).start();

    // Particles floating outward
    particleAnims.forEach((p, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const delay = i * 150;
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(p.opacity, {
              toValue: 0.8,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(p.translateX, {
              toValue: Math.cos(angle) * 80,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(p.translateY, {
              toValue: Math.sin(angle) * 80,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(p.opacity, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(p.translateX, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(p.translateY, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    });

    // Title and subtitle stagger
    Animated.sequence([
      Animated.delay(800),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.delay(300),
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to Landing after splash
    const timeout = setTimeout(() => {
      navigation.replace('Landing');
    }, 3500);

    return () => clearTimeout(timeout);
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Background gradient circles */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      {/* Pulsing glow behind hourglass */}
      <Animated.View
        style={[
          styles.glowOrb,
          {
            opacity: pulseAnim,
            transform: [{ scale: glowScale }],
          },
        ]}
      />

      {/* Outer rotating ring */}
      <Animated.View
        style={[
          styles.outerRing,
          {
            opacity: ring2Opacity,
            transform: [{ rotate: spin }],
          },
        ]}
      />

      {/* Inner rotating ring (opposite direction) */}
      <Animated.View
        style={[
          styles.innerRing,
          {
            opacity: ringOpacity,
            transform: [
              {
                rotate: spinAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['360deg', '0deg'],
                }),
              },
            ],
          },
        ]}
      />

      {/* Floating particles */}
      {particleAnims.map((p, i) => (
        <Animated.View
          key={i}
          style={[
            styles.particle,
            {
              opacity: p.opacity,
              transform: [
                { translateX: p.translateX },
                { translateY: p.translateY },
              ],
            },
          ]}
        />
      ))}

      {/* Spinning hourglass */}
      <Animated.Text
        style={[
          styles.hourglass,
          {
            transform: [{ scale: hourglassScale }, { rotate: spin }],
          },
        ]}
      >
        ⏳
      </Animated.Text>

      {/* Title */}
      <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
        DEATH CLOCK
      </Animated.Text>

      {/* Subtitle */}
      <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
        How long do you have?
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgCircle1: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: theme.colors.primary,
    opacity: 0.02,
    top: -width * 0.3,
  },
  bgCircle2: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: theme.colors.secondary,
    opacity: 0.02,
    bottom: -width * 0.2,
  },
  glowOrb: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: theme.colors.primary,
    opacity: 0.15,
  },
  outerRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: 'transparent',
    borderTopColor: theme.colors.primary,
    borderRightColor: 'rgba(0, 212, 255, 0.2)',
  },
  innerRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'transparent',
    borderBottomColor: theme.colors.secondary,
    borderLeftColor: 'rgba(123, 47, 190, 0.3)',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
  },
  hourglass: {
    fontSize: 64,
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: '900',
    color: theme.colors.text,
    letterSpacing: 6,
    textShadowColor: theme.colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textDim,
    marginTop: theme.spacing.sm,
    letterSpacing: 3,
  },
});
