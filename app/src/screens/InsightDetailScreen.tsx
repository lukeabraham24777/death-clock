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
import { insightDetails } from '../data/insightDetails';

type Props = NativeStackScreenProps<RootStackParamList, 'InsightDetail'>;

export default function InsightDetailScreen({ navigation, route }: Props) {
  const { insight } = route.params;
  const detail = insightDetails[insight.title];

  // Fallback if no detailed content exists for this insight
  if (!detail) {
    return (
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backArrow}>‹</Text>
            <Text style={styles.backLabel}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.fallbackWrap}>
          <Text style={styles.fallbackIcon}>💡</Text>
          <Text style={styles.fallbackTitle}>{insight.title}</Text>
          <Text style={styles.fallbackDesc}>{insight.description}</Text>
          <View style={styles.impactRow}>
            <Text style={styles.impactLabel}>Impact on lifespan:</Text>
            <Text
              style={[
                styles.impactValue,
                {
                  color:
                    insight.yearsImpact > 0
                      ? theme.colors.success
                      : theme.colors.danger,
                },
              ]}
            >
              {insight.yearsImpact > 0 ? '+' : ''}
              {insight.yearsImpact} years
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backLabel}>Back</Text>
        </TouchableOpacity>
        <View style={styles.categoryPill}>
          <Text style={styles.categoryPillText}>{insight.category}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.heroSection}>
          <Text style={styles.heroIcon}>{detail.icon}</Text>
          <Text style={styles.heroHeadline}>{detail.headline}</Text>
          <View style={styles.impactBadgeLarge}>
            <Text
              style={[
                styles.impactBadgeText,
                {
                  color:
                    insight.yearsImpact > 0
                      ? theme.colors.success
                      : theme.colors.danger,
                },
              ]}
            >
              {insight.yearsImpact > 0 ? '+' : ''}
              {insight.yearsImpact} years impact
            </Text>
          </View>
        </View>

        {/* Intro */}
        <Text style={styles.introText}>{detail.intro}</Text>

        {/* Content sections */}
        {detail.sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionDot} />
              <Text style={styles.sectionHeading}>{section.heading}</Text>
            </View>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}

        {/* Quick tip callout */}
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>⚡</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipLabel}>QUICK ACTION</Text>
            <Text style={styles.tipText}>{detail.quickTip}</Text>
          </View>
        </View>

        {/* Bottom spacer */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    paddingRight: theme.spacing.md,
  },
  backArrow: {
    fontSize: 32,
    color: theme.colors.textSecondary,
    fontWeight: '300',
    lineHeight: 32,
    marginRight: 4,
  },
  backLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  categoryPill: {
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  categoryPillText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primary,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },

  // Hero
  heroSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  heroIcon: {
    fontSize: 56,
    marginBottom: theme.spacing.md,
  },
  heroHeadline: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.text,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 34,
  },
  impactBadgeLarge: {
    marginTop: theme.spacing.md,
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  impactBadgeText: {
    fontSize: theme.fontSize.sm,
    fontWeight: '700',
  },

  // Intro
  introText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    lineHeight: 26,
    marginBottom: theme.spacing.xl,
  },

  // Sections
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  sectionHeading: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text,
    fontWeight: '700',
  },
  sectionBody: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 24,
    paddingLeft: theme.spacing.lg,
  },

  // Quick tip
  tipCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 212, 255, 0.08)',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
    gap: theme.spacing.md,
  },
  tipIcon: {
    fontSize: 24,
  },
  tipContent: {
    flex: 1,
  },
  tipLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primary,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: theme.spacing.xs,
  },
  tipText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    lineHeight: 22,
  },

  // Fallback
  fallbackWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  fallbackIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  fallbackTitle: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.text,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  fallbackDesc: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  impactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  impactLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textDim,
  },
  impactValue: {
    fontSize: theme.fontSize.lg,
    fontWeight: '800',
  },
});
