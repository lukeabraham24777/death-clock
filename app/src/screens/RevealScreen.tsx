import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme } from '../theme';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Reveal'>;

export default function RevealScreen({ navigation, route }: Props) {
  const { prediction } = route.params;

  const line1Opacity = useRef(new Animated.Value(0)).current;
  const line2Opacity = useRef(new Animated.Value(0)).current;
  const dateOpacity = useRef(new Animated.Value(0)).current;
  const dateScale = useRef(new Animated.Value(0.5)).current;
  const daysOpacity = useRef(new Animated.Value(0)).current;
  const scoreOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  const deathDate = new Date(prediction.deathDate);
  const formattedDate = deathDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Longevity score color
  const scoreColor =
    prediction.longevityScore >= 70
      ? theme.colors.success
      : prediction.longevityScore >= 40
      ? theme.colors.warning
      : theme.colors.danger;

  useEffect(() => {
    // Dramatic reveal timeline
    Animated.sequence([
      Animated.delay(1500),
      Animated.timing(line1Opacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(line2Opacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.parallel([
        Animated.timing(dateOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.spring(dateScale, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
      ]),
      Animated.delay(1500),
      Animated.timing(daysOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.delay(800),
      Animated.timing(scoreOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.delay(600),
      Animated.timing(buttonOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Background glow behind the date */}
      <View style={styles.bgGlow} />

      <Animated.Text style={[styles.line1, { opacity: line1Opacity }]}>
        Based on your lifestyle...
      </Animated.Text>

      <Animated.Text style={[styles.line2, { opacity: line2Opacity }]}>
        Your predicted death date is
      </Animated.Text>

      {/* THE DATE */}
      <Animated.Text
        style={[
          styles.deathDate,
          { opacity: dateOpacity, transform: [{ scale: dateScale }] },
        ]}
      >
        {formattedDate}
      </Animated.Text>

      {/* Days remaining + longevity score */}
      <Animated.View style={[styles.statsRow, { opacity: daysOpacity }]}>
        <View style={styles.revealStat}>
          <Text style={styles.revealStatValue}>
            {prediction.daysRemaining.toLocaleString()}
          </Text>
          <Text style={styles.revealStatLabel}>days remaining</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.scoreBadge, { opacity: scoreOpacity }]}>
        <Text style={styles.scoreBadgeLabel}>LONGEVITY SCORE</Text>
        <Text style={[styles.scoreBadgeValue, { color: scoreColor }]}>
          {prediction.longevityScore}
        </Text>
        <Text style={styles.scoreBadgeMax}>/100</Text>
      </Animated.View>

      {/* Lifespan summary */}
      <Animated.Text style={[styles.lifespanNote, { opacity: scoreOpacity }]}>
        Predicted lifespan: {prediction.predictedLifespan} years
      </Animated.Text>

      {/* Action buttons */}
      <Animated.View style={[styles.buttonContainer, { opacity: buttonOpacity }]}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.replace('Dashboard', { prediction })}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryBtnText}>VIEW YOUR DASHBOARD</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('Share', { prediction })}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryBtnText}>SHARE RESULT</Text>
        </TouchableOpacity>
      </Animated.View>
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
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: theme.colors.primary,
    opacity: 0.04,
  },
  line1: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontWeight: '300',
    marginBottom: theme.spacing.lg,
  },
  line2: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textDim,
    textAlign: 'center',
    fontWeight: '300',
    marginBottom: theme.spacing.xl,
  },
  deathDate: {
    fontSize: 44,
    color: theme.colors.text,
    textAlign: 'center',
    fontWeight: '900',
    lineHeight: 54,
    letterSpacing: 1,
    textShadowColor: theme.colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  statsRow: {
    marginTop: theme.spacing.xl,
    alignItems: 'center',
  },
  revealStat: { alignItems: 'center' },
  revealStatValue: {
    fontSize: theme.fontSize.xxl,
    color: theme.colors.primary,
    fontWeight: '800',
  },
  revealStatLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textDim,
    marginTop: 2,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    marginTop: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 4,
  },
  scoreBadgeLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textDim,
    letterSpacing: 1,
    marginRight: theme.spacing.sm,
  },
  scoreBadgeValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: '800',
  },
  scoreBadgeMax: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textDim,
  },
  lifespanNote: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textDim,
    marginTop: theme.spacing.md,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 30,
    left: theme.spacing.xl,
    right: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  primaryBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryBtnText: {
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    color: theme.colors.background,
    letterSpacing: 2,
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.primary,
    letterSpacing: 2,
  },
});
