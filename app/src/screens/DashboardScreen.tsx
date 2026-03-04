import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme } from '../theme';
import { RootStackParamList } from '../types';
import CountdownTimer from '../components/CountdownTimer';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 48; // padding on both sides
const CARD_SPACING = 12;

export default function DashboardScreen({ navigation, route }: Props) {
  const { prediction } = route.params;
  const deathDate = new Date(prediction.deathDate);
  const scrollRef = useRef<ScrollView>(null);
  const [activeCard, setActiveCard] = React.useState(0);

  // Compute death age
  const birthDateResp = deathDate; // death date is already computed
  const deathAge = prediction.predictedLifespan;

  // "Improved" death date: add 18 years, 2 months, 3 days to current death date
  const improvedDate = new Date(deathDate.getTime());
  improvedDate.setFullYear(improvedDate.getFullYear() + 18);
  improvedDate.setMonth(improvedDate.getMonth() + 2);
  improvedDate.setDate(improvedDate.getDate() + 3);
  const improvedAge = deathAge + 18;

  const formatDateLong = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Derived stats
  const yearsLeft = Math.floor(prediction.daysRemaining / 365.25);
  const weeksLeft = Math.floor(prediction.daysRemaining / 7);
  const monthsLeft = Math.floor(prediction.daysRemaining / 30.44);

  const scoreColor =
    prediction.longevityScore >= 70
      ? theme.colors.success
      : prediction.longevityScore >= 40
      ? theme.colors.warning
      : theme.colors.danger;

  // Handle carousel scroll
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / (CARD_WIDTH + CARD_SPACING));
    setActiveCard(idx);
  };

  // Photo card data
  const cards = [
    {
      key: 'death',
      topIcon: '💀',
      topLabel: 'MEMENTO MORI',
      mainText: 'Save the date:',
      emphasis: `You are going to die\n${formatDateLong(deathDate)}`,
      bottomText: `at age ${deathAge}`,
      borderColor: '#FF4444',
      glowColor: 'rgba(255, 68, 68, 0.08)',
      accentColor: '#FF4444',
    },
    {
      key: 'live',
      topIcon: '✨',
      topLabel: 'MEMENTO VIVERE',
      mainText: 'Save the date:',
      emphasis: `You are going to live\nuntil ${formatDateLong(improvedDate)}`,
      bottomText: `to age ${improvedAge} by improving your lifestyle`,
      borderColor: theme.colors.success,
      glowColor: 'rgba(0, 255, 136, 0.06)',
      accentColor: theme.colors.success,
    },
    {
      key: 'stats',
      topIcon: '⏳',
      topLabel: 'YOUR REMAINING TIME',
      mainText: '',
      emphasis: '',
      bottomText: '',
      borderColor: theme.colors.primary,
      glowColor: 'rgba(0, 212, 255, 0.06)',
      accentColor: theme.colors.primary,
      isStats: true,
    },
    {
      key: 'score',
      topIcon: '🩺',
      topLabel: 'THE DOCTOR\'S VERDICT',
      mainText: 'Longevity Score',
      emphasis: `${prediction.longevityScore}`,
      bottomText: prediction.longevityScore >= 70
        ? 'The plague spares you... for now.'
        : prediction.longevityScore >= 40
        ? 'You walk among the living, but barely.'
        : 'The bells toll for thee.',
      borderColor: scoreColor,
      glowColor: `${scoreColor}11`,
      accentColor: scoreColor,
      isScore: true,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header - plague doctor themed */}
        <View style={styles.headerSection}>
          <Text style={styles.plagueIcon}>🦠</Text>
          <Text style={styles.headerTitle}>THE DEATH CLOCK</Text>
          <Text style={styles.headerSubtitle}>Your fate has been sealed</Text>
        </View>

        {/* Live countdown timer - prominent */}
        <View style={styles.countdownSection}>
          <View style={styles.countdownBorder}>
            <View style={styles.countdownInner}>
              <View style={styles.countdownLabelRow}>
                <Text style={styles.countdownSkull}>💀</Text>
                <Text style={styles.countdownLabel}>TIME REMAINING</Text>
                <Text style={styles.countdownSkull}>💀</Text>
              </View>
              <CountdownTimer targetDate={prediction.deathDate} />
              <Text style={styles.countdownCaption}>
                Every second you see here... you will never get back.
              </Text>
            </View>
          </View>
        </View>

        {/* Swipeable photo cards carousel */}
        <View style={styles.carouselSection}>
          <Text style={styles.carouselLabel}>SWIPE TO REVEAL YOUR FATE</Text>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled={false}
            snapToInterval={CARD_WIDTH + CARD_SPACING}
            snapToAlignment="start"
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            onScroll={onScroll}
            scrollEventThrottle={16}
          >
            {cards.map((card) => (
              <View
                key={card.key}
                style={[
                  styles.photoCard,
                  {
                    width: CARD_WIDTH,
                    borderColor: card.borderColor,
                    backgroundColor: card.glowColor,
                  },
                ]}
              >
                {/* Ornate top */}
                <View style={styles.cardOrnateTop}>
                  <View style={[styles.ornamentLine, { backgroundColor: card.accentColor }]} />
                  <Text style={styles.cardTopIcon}>{card.topIcon}</Text>
                  <View style={[styles.ornamentLine, { backgroundColor: card.accentColor }]} />
                </View>

                <Text style={[styles.cardTopLabel, { color: card.accentColor }]}>
                  {card.topLabel}
                </Text>

                {/* Stats card variant */}
                {card.isStats ? (
                  <View style={styles.statsCardBody}>
                    <View style={styles.statsRow}>
                      <View style={styles.statsItem}>
                        <Text style={[styles.statsValue, { color: card.accentColor }]}>
                          {prediction.daysRemaining.toLocaleString()}
                        </Text>
                        <Text style={styles.statsUnit}>days</Text>
                      </View>
                      <View style={styles.statsDivider} />
                      <View style={styles.statsItem}>
                        <Text style={[styles.statsValue, { color: card.accentColor }]}>
                          {weeksLeft.toLocaleString()}
                        </Text>
                        <Text style={styles.statsUnit}>weeks</Text>
                      </View>
                    </View>
                    <View style={styles.statsRow}>
                      <View style={styles.statsItem}>
                        <Text style={[styles.statsValue, { color: card.accentColor }]}>
                          {monthsLeft.toLocaleString()}
                        </Text>
                        <Text style={styles.statsUnit}>months</Text>
                      </View>
                      <View style={styles.statsDivider} />
                      <View style={styles.statsItem}>
                        <Text style={[styles.statsValue, { color: card.accentColor }]}>
                          {yearsLeft}
                        </Text>
                        <Text style={styles.statsUnit}>years</Text>
                      </View>
                    </View>
                    <Text style={styles.statsCaption}>
                      The sand in your hourglass grows thin.
                    </Text>
                  </View>
                ) : card.isScore ? (
                  /* Score card variant */
                  <View style={styles.scoreCardBody}>
                    <Text style={styles.cardMainText}>{card.mainText}</Text>
                    <Text style={[styles.scoreNumber, { color: card.accentColor }]}>
                      {card.emphasis}
                    </Text>
                    <Text style={styles.scoreOutOf}>/100</Text>
                    <View style={styles.scoreBarOuter}>
                      <View
                        style={[
                          styles.scoreBarInner,
                          { width: `${prediction.longevityScore}%`, backgroundColor: card.accentColor },
                        ]}
                      />
                    </View>
                    <Text style={styles.cardCaption}>{card.bottomText}</Text>
                  </View>
                ) : (
                  /* Standard "save the date" cards */
                  <View style={styles.cardBody}>
                    <Text style={styles.cardMainText}>{card.mainText}</Text>
                    <Text style={[styles.cardEmphasis, { color: card.accentColor }]}>
                      {card.emphasis}
                    </Text>
                    <View style={[styles.cardDivider, { backgroundColor: card.accentColor }]} />
                    <Text style={styles.cardBottomText}>{card.bottomText}</Text>
                  </View>
                )}

                {/* Ornate bottom */}
                <View style={styles.cardOrnateBottom}>
                  <Text style={styles.ornateSymbol}>☠</Text>
                  <Text style={[styles.ornateText, { color: card.accentColor }]}>
                    DEATH CLOCK
                  </Text>
                  <Text style={styles.ornateSymbol}>☠</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Dot indicators */}
          <View style={styles.dotsRow}>
            {cards.map((card, i) => (
              <View
                key={card.key}
                style={[
                  styles.dot,
                  activeCard === i && [styles.dotActive, { backgroundColor: cards[i].accentColor }],
                ]}
              />
            ))}
          </View>
        </View>

        {/* Longevity insights - tappable, plague themed */}
        {prediction.insights.length > 0 && (
          <View style={styles.insightsSection}>
            <View style={styles.insightsSectionHeader}>
              <Text style={styles.insightsIcon}>🧪</Text>
              <View>
                <Text style={styles.insightsTitle}>THE DOCTOR'S PRESCRIPTIONS</Text>
                <Text style={styles.insightsSubtitle}>
                  Remedies to delay your appointment with death
                </Text>
              </View>
            </View>
            {prediction.insights.map((insight, index) => (
              <TouchableOpacity
                key={index}
                style={styles.insightCard}
                onPress={() => navigation.navigate('InsightDetail', { insight })}
                activeOpacity={0.7}
              >
                <View style={styles.insightLeft}>
                  <Text style={styles.insightRoman}>
                    {['I', 'II', 'III', 'IV', 'V'][index] ?? String(index + 1)}
                  </Text>
                </View>
                <View style={styles.insightRight}>
                  <View style={styles.insightHeaderRow}>
                    <Text style={styles.insightCategory}>{insight.category}</Text>
                    <View
                      style={[
                        styles.impactBadge,
                        {
                          backgroundColor: insight.yearsImpact > 0
                            ? 'rgba(0, 255, 136, 0.12)'
                            : 'rgba(255, 68, 68, 0.12)',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.impactText,
                          {
                            color: insight.yearsImpact > 0
                              ? theme.colors.success
                              : theme.colors.danger,
                          },
                        ]}
                      >
                        {insight.yearsImpact > 0 ? '+' : ''}{insight.yearsImpact}y
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <Text style={styles.insightDesc} numberOfLines={2}>
                    {insight.description}
                  </Text>
                  <Text style={styles.insightCta}>Read the prescription →</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Ominous disclaimer */}
        <View style={styles.disclaimerSection}>
          <Text style={styles.disclaimerSymbol}>⚰️</Text>
          <Text style={styles.disclaimerText}>
            This app is for entertainment purposes only and is not medical advice.
            The plague doctor is not a real physician. Results are based on statistical
            averages and should not replace professional health guidance.
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
          <Text style={styles.shareBtnText}>☠  SHARE YOUR FATE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.retakeBtn}
          onPress={() => navigation.popToTop()}
          activeOpacity={0.8}
        >
          <Text style={styles.retakeBtnText}>↺  CHEAT DEATH</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050508',
  },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 100,
  },

  // Header
  headerSection: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  plagueIcon: { fontSize: 28, marginBottom: theme.spacing.sm },
  headerTitle: {
    fontSize: theme.fontSize.lg,
    color: '#AA3333',
    fontWeight: '900',
    letterSpacing: 6,
  },
  headerSubtitle: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textDim,
    fontStyle: 'italic',
    marginTop: theme.spacing.xs,
    letterSpacing: 2,
  },

  // Countdown
  countdownSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  countdownBorder: {
    borderWidth: 1,
    borderColor: '#331111',
    borderRadius: theme.borderRadius.lg,
    padding: 2,
  },
  countdownInner: {
    backgroundColor: '#0A0608',
    borderRadius: theme.borderRadius.lg - 2,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
  },
  countdownLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  countdownSkull: { fontSize: 12 },
  countdownLabel: {
    fontSize: theme.fontSize.xs,
    color: '#AA3333',
    letterSpacing: 3,
    fontWeight: '700',
  },
  countdownCaption: {
    fontSize: 11,
    color: theme.colors.textDim,
    fontStyle: 'italic',
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },

  // Carousel
  carouselSection: {
    marginBottom: theme.spacing.xl,
  },
  carouselLabel: {
    fontSize: 10,
    color: theme.colors.textDim,
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  carouselContent: {
    paddingHorizontal: 24,
    gap: CARD_SPACING,
  },

  // Photo cards
  photoCard: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 340,
    justifyContent: 'space-between',
  },
  cardOrnateTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  ornamentLine: {
    flex: 1,
    height: 1,
    opacity: 0.3,
  },
  cardTopIcon: {
    fontSize: 24,
  },
  cardTopLabel: {
    fontSize: 10,
    letterSpacing: 4,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },

  // Standard card body
  cardBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardMainText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textDim,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  cardEmphasis: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 32,
  },
  cardDivider: {
    width: 40,
    height: 1,
    marginVertical: theme.spacing.md,
    opacity: 0.4,
  },
  cardBottomText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  cardCaption: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textDim,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: theme.spacing.md,
  },

  // Stats card body
  statsCardBody: {
    flex: 1,
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },
  statsItem: {
    flex: 1,
    alignItems: 'center',
  },
  statsValue: {
    fontSize: 28,
    fontWeight: '900',
  },
  statsUnit: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textDim,
    marginTop: 2,
    letterSpacing: 1,
  },
  statsDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.border,
    alignSelf: 'center',
  },
  statsCaption: {
    fontSize: 11,
    color: theme.colors.textDim,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },

  // Score card body
  scoreCardBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 72,
    fontWeight: '900',
    lineHeight: 80,
  },
  scoreOutOf: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textDim,
    fontWeight: '300',
    marginBottom: theme.spacing.md,
  },
  scoreBarOuter: {
    width: '80%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
  },
  scoreBarInner: {
    height: '100%',
    borderRadius: 3,
  },

  // Card ornate bottom
  cardOrnateBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  ornateSymbol: {
    fontSize: 10,
    color: theme.colors.textDim,
  },
  ornateText: {
    fontSize: 9,
    letterSpacing: 4,
    fontWeight: '600',
  },

  // Dots
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: theme.spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.surfaceLight,
  },
  dotActive: {
    width: 24,
    borderRadius: 4,
  },

  // Insights
  insightsSection: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  insightsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  insightsIcon: { fontSize: 20 },
  insightsTitle: {
    fontSize: theme.fontSize.sm,
    color: '#AA3333',
    fontWeight: '700',
    letterSpacing: 2,
  },
  insightsSubtitle: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textDim,
    fontStyle: 'italic',
    marginTop: 1,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#0A0A10',
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1A1A28',
  },
  insightLeft: {
    width: 44,
    backgroundColor: 'rgba(170, 51, 51, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightRoman: {
    fontSize: theme.fontSize.sm,
    color: '#AA3333',
    fontWeight: '800',
    fontStyle: 'italic',
  },
  insightRight: {
    flex: 1,
    padding: theme.spacing.md,
  },
  insightHeaderRow: {
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
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  impactText: {
    fontSize: theme.fontSize.xs,
    fontWeight: '700',
  },
  insightTitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  insightDesc: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  insightCta: {
    fontSize: theme.fontSize.xs,
    color: '#AA3333',
    marginTop: theme.spacing.sm,
    fontWeight: '600',
    fontStyle: 'italic',
  },

  // Disclaimer
  disclaimerSection: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    gap: theme.spacing.sm,
    backgroundColor: '#0A0608',
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#1A1118',
  },
  disclaimerSymbol: { fontSize: 16 },
  disclaimerText: {
    flex: 1,
    fontSize: theme.fontSize.xs,
    color: theme.colors.textDim,
    lineHeight: 18,
    fontStyle: 'italic',
  },

  // Bottom bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    paddingTop: theme.spacing.md,
    backgroundColor: '#050508',
    borderTopWidth: 1,
    borderTopColor: '#1A1118',
    gap: theme.spacing.sm,
  },
  shareBtn: {
    flex: 1,
    backgroundColor: '#AA3333',
    borderRadius: theme.borderRadius.full,
    paddingVertical: 14,
    alignItems: 'center',
  },
  shareBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: theme.fontSize.sm,
    letterSpacing: 1,
  },
  retakeBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#331111',
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
