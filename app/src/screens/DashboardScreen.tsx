import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme } from '../theme';
import { RootStackParamList } from '../types';
import CountdownTimer from '../components/CountdownTimer';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export default function DashboardScreen({ navigation, route }: Props) {
  const { prediction } = route.params;
  const deathDate = new Date(prediction.deathDate);

  const scoreColor =
    prediction.longevityScore >= 70
      ? theme.colors.success
      : prediction.longevityScore >= 40
      ? theme.colors.warning
      : theme.colors.danger;

  // Calculate some derived stats
  const weeksLeft = Math.floor(prediction.daysRemaining / 7);
  const monthsLeft = Math.floor(prediction.daysRemaining / 30.44);
  const yearsLeft = Math.floor(prediction.daysRemaining / 365.25);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerIcon}>💀</Text>
          <Text style={styles.header}>YOUR LIFESPAN</Text>
        </View>

        {/* Death date card */}
        <View style={styles.dateCard}>
          <Text style={styles.dateLabel}>PREDICTED DEATH DATE</Text>
          <Text style={styles.dateValue}>
            {deathDate.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
          <Text style={styles.dateLifespan}>
            Age at death: {prediction.predictedLifespan} years
          </Text>
        </View>

        {/* Live countdown timer */}
        <View style={styles.countdownCard}>
          <Text style={styles.cardLabel}>⏱ TIME REMAINING</Text>
          <CountdownTimer targetDate={prediction.deathDate} />
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCardWide}>
            <Text style={styles.statEmoji}>📅</Text>
            <Text style={styles.statValue}>
              {prediction.daysRemaining.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Days Left</Text>
          </View>
          <View style={styles.statCardWide}>
            <Text style={styles.statEmoji}>📆</Text>
            <Text style={styles.statValue}>{weeksLeft.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Weeks Left</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCardWide}>
            <Text style={styles.statEmoji}>🗓</Text>
            <Text style={styles.statValue}>{monthsLeft.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Months Left</Text>
          </View>
          <View style={styles.statCardWide}>
            <Text style={styles.statEmoji}>🎯</Text>
            <Text style={[styles.statValue, { color: scoreColor }]}>
              {prediction.longevityScore}
            </Text>
            <Text style={styles.statLabel}>Longevity Score</Text>
          </View>
        </View>

        {/* Longevity score explanation */}
        <View style={styles.scoreExplainer}>
          <View style={styles.scoreBar}>
            <View
              style={[
                styles.scoreFill,
                {
                  width: `${prediction.longevityScore}%`,
                  backgroundColor: scoreColor,
                },
              ]}
            />
          </View>
          <View style={styles.scoreLabels}>
            <Text style={styles.scoreLabelText}>Poor</Text>
            <Text style={styles.scoreLabelText}>Average</Text>
            <Text style={styles.scoreLabelText}>Excellent</Text>
          </View>
        </View>

        {/* Longevity insights */}
        {prediction.insights.length > 0 && (
          <View style={styles.insightsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>💡</Text>
              <Text style={styles.sectionTitle}>HOW TO LIVE LONGER</Text>
            </View>
            {prediction.insights.map((insight, index) => (
              <View key={index} style={styles.insightCard}>
                <View style={styles.insightLeft}>
                  <Text style={styles.insightNumber}>{index + 1}</Text>
                </View>
                <View style={styles.insightRight}>
                  <View style={styles.insightHeader}>
                    <Text style={styles.insightCategory}>{insight.category}</Text>
                    <View style={styles.impactBadge}>
                      <Text style={styles.insightImpact}>
                        {insight.yearsImpact > 0 ? '+' : ''}{insight.yearsImpact}y
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <Text style={styles.insightDescription}>{insight.description}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Disclaimer */}
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerIcon}>ℹ️</Text>
          <Text style={styles.disclaimer}>
            This app is for entertainment purposes only and is not medical advice.
            Results are based on statistical averages and should not replace
            professional health guidance.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom action bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.shareBtn}
          onPress={() => navigation.navigate('Share', { prediction })}
          activeOpacity={0.8}
        >
          <Text style={styles.shareBtnText}>📤  SHARE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.retakeBtn}
          onPress={() => navigation.popToTop()}
          activeOpacity={0.8}
        >
          <Text style={styles.retakeBtnText}>↺  RETAKE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 100,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  headerIcon: { fontSize: 20 },
  header: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    letterSpacing: 4,
    fontWeight: '600',
  },
  dateCard: {
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  dateLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textDim,
    letterSpacing: 2,
    marginBottom: theme.spacing.sm,
  },
  dateValue: {
    fontSize: 28,
    color: theme.colors.text,
    fontWeight: '800',
    textShadowColor: theme.colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  dateLifespan: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textDim,
    marginTop: theme.spacing.xs,
  },
  countdownCard: {
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textDim,
    letterSpacing: 2,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  statCardWide: {
    flex: 1,
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statEmoji: { fontSize: 18, marginBottom: 4 },
  statValue: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.text,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textDim,
    marginTop: theme.spacing.xs,
  },
  scoreExplainer: {
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.xs,
  },
  scoreBar: {
    height: 6,
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    borderRadius: 3,
  },
  scoreLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  scoreLabelText: {
    fontSize: 10,
    color: theme.colors.textDim,
  },
  insightsSection: {
    marginTop: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  sectionIcon: { fontSize: 18 },
  sectionTitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    letterSpacing: 3,
    fontWeight: '600',
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  insightLeft: {
    width: 40,
    backgroundColor: 'rgba(0, 212, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightNumber: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontWeight: '800',
  },
  insightRight: {
    flex: 1,
    padding: theme.spacing.md,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  insightCategory: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textDim,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  impactBadge: {
    backgroundColor: 'rgba(255, 68, 68, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  insightImpact: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.danger,
    fontWeight: '700',
  },
  insightTitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  insightDescription: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  disclaimerBox: {
    flexDirection: 'row',
    marginTop: theme.spacing.xl,
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  disclaimerIcon: { fontSize: 16 },
  disclaimer: {
    flex: 1,
    fontSize: theme.fontSize.xs,
    color: theme.colors.textDim,
    lineHeight: 18,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    paddingTop: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  shareBtn: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    paddingVertical: 14,
    alignItems: 'center',
  },
  shareBtnText: {
    color: theme.colors.background,
    fontWeight: '700',
    fontSize: theme.fontSize.sm,
    letterSpacing: 1,
  },
  retakeBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.full,
    paddingVertical: 14,
    alignItems: 'center',
  },
  retakeBtnText: {
    color: theme.colors.textSecondary,
    fontWeight: '700',
    fontSize: theme.fontSize.sm,
    letterSpacing: 1,
  },
});
