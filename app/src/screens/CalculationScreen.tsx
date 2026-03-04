import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme } from '../theme';
import { RootStackParamList } from '../types';
import { calculateLocalPrediction } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Calculation'>;

// Dramatic suspense messages with icons
const SUSPENSE_MESSAGES = [
  { text: 'Analyzing your lifestyle data', icon: '📊' },
  { text: 'Comparing with population datasets', icon: '🌍' },
  { text: 'Evaluating genetic factors', icon: '🧬' },
  { text: 'Processing health indicators', icon: '❤️' },
  { text: 'Running actuarial models', icon: '📈' },
  { text: 'Estimating life expectancy', icon: '⏳' },
  { text: 'Calculating your death date', icon: '💀' },
];

export default function CalculationScreen({ navigation, route }: Props) {
  const { responses } = route.params;
  const [messageIndex, setMessageIndex] = useState(0);
  const [dots, setDots] = useState('');
  const [completedSteps, setCompletedSteps] = useState(0);

  const messageOpacity = useRef(new Animated.Value(1)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.3)).current;
  const ringRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulsing orb
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    // Spinning ring
    Animated.loop(
      Animated.timing(ringRotation, { toValue: 1, duration: 3000, useNativeDriver: true })
    ).start();

    // Dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);

    // Rotate messages every 1.5s
    const messageInterval = setInterval(() => {
      Animated.timing(messageOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
        setMessageIndex((prev) => {
          const next = prev + 1;
          if (next >= SUSPENSE_MESSAGES.length) return prev;
          setCompletedSteps(next);
          return next;
        });
        Animated.timing(messageOpacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
      });
    }, 1500);

    // Progress bar
    const totalDuration = SUSPENSE_MESSAGES.length * 1500;
    Animated.timing(progressWidth, {
      toValue: 1,
      duration: totalDuration,
      useNativeDriver: false,
    }).start();

    // FIX: Use local prediction only — fetch to localhost hangs on mobile
    // because phone's localhost != computer's localhost
    const timeout = setTimeout(() => {
      const birthDateResponse = responses.find((r) => r.questionId === 'birth_date');
      const birthDate = birthDateResponse?.answer || '1990-01-01';
      const prediction = calculateLocalPrediction(responses, birthDate);
      navigation.replace('Reveal', { prediction });
    }, totalDuration + 800);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(messageInterval);
      clearTimeout(timeout);
    };
  }, []);

  const { width: screenWidth } = Dimensions.get('window');
  const spin = ringRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Background glow */}
      <View style={styles.bgGlow} />

      {/* Spinning ring + pulsing orb */}
      <View style={styles.orbContainer}>
        <Animated.View style={[styles.spinRing, { transform: [{ rotate: spin }] }]}>
          <View style={styles.ringDot} />
        </Animated.View>
        <Animated.View style={[styles.pulseOrb, { opacity: pulseAnim }]} />
      </View>

      {/* Current message */}
      <Animated.View style={[styles.messageRow, { opacity: messageOpacity }]}>
        <Text style={styles.messageIcon}>{SUSPENSE_MESSAGES[messageIndex].icon}</Text>
        <Text style={styles.messageText}>
          {SUSPENSE_MESSAGES[messageIndex].text}{dots}
        </Text>
      </Animated.View>

      {/* Step dots */}
      <View style={styles.stepsRow}>
        {SUSPENSE_MESSAGES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.stepDot,
              i <= completedSteps && styles.stepDotActive,
              i === messageIndex && styles.stepDotCurrent,
            ]}
          />
        ))}
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressWidth.interpolate({
                inputRange: [0, 1],
                outputRange: [0, screenWidth - 80],
              }),
            },
          ]}
        />
      </View>

      <View style={styles.bottomInfo}>
        <Text style={styles.processingLabel}>
          Processing {responses.length} responses
        </Text>
        <Text style={styles.warning}>Do not close this screen</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  bgGlow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: theme.colors.primary,
    opacity: 0.03,
  },
  orbContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  spinRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: theme.colors.primary,
    borderRightColor: 'rgba(0, 212, 255, 0.3)',
  },
  ringDot: {
    position: 'absolute',
    top: -3,
    left: '50%',
    marginLeft: -3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
  },
  pulseOrb: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 25,
    elevation: 10,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 30,
  },
  messageIcon: { fontSize: 20 },
  messageText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontWeight: '500',
  },
  stepsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: theme.spacing.xl,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.surfaceLight,
  },
  stepDotActive: { backgroundColor: theme.colors.primaryDim },
  stepDotCurrent: {
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 3,
  },
  progressContainer: {
    width: '100%',
    height: 3,
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: 2,
    marginTop: theme.spacing.xl,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  bottomInfo: {
    marginTop: theme.spacing.xl,
    alignItems: 'center',
    gap: 4,
  },
  processingLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  warning: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textDim,
  },
});
