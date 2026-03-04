import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { PredictionResult } from '../types';

interface Props {
  prediction: PredictionResult;
}

// Visually striking share card for social media
// Rendered as an image via react-native-view-shot
export default function ShareCard({ prediction }: Props) {
  const deathDate = new Date(prediction.deathDate);
  const formattedDate = deathDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <View style={styles.card}>
      {/* Decorative top accent */}
      <View style={styles.topAccent} />

      {/* App branding */}
      <Text style={styles.brand}>DEATH CLOCK</Text>

      {/* Death date */}
      <Text style={styles.dateLabel}>MY PREDICTED DEATH DATE</Text>
      <Text style={styles.deathDate}>{formattedDate}</Text>

      {/* Days remaining */}
      <View style={styles.daysContainer}>
        <Text style={styles.daysNumber}>
          {prediction.daysRemaining.toLocaleString()}
        </Text>
        <Text style={styles.daysLabel}>DAYS REMAINING</Text>
      </View>

      {/* Longevity score */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>LONGEVITY SCORE</Text>
        <Text style={styles.scoreValue}>{prediction.longevityScore}/100</Text>
      </View>

      {/* Bottom branding */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          How long will you live?
        </Text>
        <Text style={styles.footerApp}>deathclock.app</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 340,
    backgroundColor: '#0A0A14',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  topAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: theme.colors.primary,
  },
  brand: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primary,
    letterSpacing: 6,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  dateLabel: {
    fontSize: 10,
    color: theme.colors.textDim,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  deathDate: {
    fontSize: theme.fontSize.xxl,
    color: theme.colors.text,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: theme.colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  daysContainer: {
    marginTop: theme.spacing.xl,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 212, 255, 0.08)',
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
  },
  daysNumber: {
    fontSize: theme.fontSize.xxl,
    color: theme.colors.primary,
    fontWeight: '800',
  },
  daysLabel: {
    fontSize: 10,
    color: theme.colors.textDim,
    letterSpacing: 2,
    marginTop: theme.spacing.xs,
  },
  scoreContainer: {
    marginTop: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
  },
  scoreLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textDim,
    letterSpacing: 1,
  },
  scoreValue: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontWeight: '700',
  },
  footer: {
    marginTop: theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
    alignItems: 'center',
  },
  footerText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  footerApp: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primary,
    letterSpacing: 1,
    marginTop: theme.spacing.xs,
    fontWeight: '600',
  },
});
