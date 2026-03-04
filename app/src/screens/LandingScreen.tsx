import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../theme';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Landing'>;

const { width } = Dimensions.get('window');

export default function LandingScreen({ navigation }: Props) {
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const statsOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(titleOpacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(subtitleOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(statsOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(buttonOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(buttonScale, { toValue: 1, friction: 6, useNativeDriver: true }),
      ]),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Background accents */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <View style={styles.content}>
        {/* Decorative hourglass icon */}
        <Animated.Text style={[styles.heroIcon, { opacity: titleOpacity }]}>
          ⏳
        </Animated.Text>

        {/* App title */}
        <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
          DEATH{'\n'}CLOCK
        </Animated.Text>

        {/* Tagline */}
        <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
          Discover Your Predicted Lifespan
        </Animated.Text>
        <Animated.Text style={[styles.subtext, { opacity: subtitleOpacity }]}>
          Answer 30 lifestyle questions. Get your predicted{'\n'}
          death date and personalized longevity insights.
        </Animated.Text>

        {/* Quick stats */}
        <Animated.View style={[styles.statsRow, { opacity: statsOpacity }]}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>30</Text>
            <Text style={styles.statLabel}>Questions</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>~3</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>9</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
        </Animated.View>

        {/* CTA button */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: buttonOpacity,
              transform: [{ scale: Animated.multiply(buttonScale, pulseAnim) }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Questionnaire')}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>BEGIN TEST</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Feature highlights */}
        <Animated.View style={[styles.features, { opacity: statsOpacity }]}>
          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>🔒</Text>
            <Text style={styles.featureText}>100% private — no data leaves your device</Text>
          </View>
          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>📱</Text>
            <Text style={styles.featureText}>Shareable results with friends</Text>
          </View>
        </Animated.View>
      </View>

      {/* Disclaimer */}
      <Text style={styles.disclaimer}>
        This app is for entertainment purposes only{'\n'}and is not medical advice.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  bgCircle1: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    backgroundColor: theme.colors.primary,
    opacity: 0.03,
    top: -width * 0.5,
    left: -width * 0.25,
  },
  bgCircle2: {
    position: 'absolute',
    width: width,
    height: width,
    borderRadius: width * 0.5,
    backgroundColor: theme.colors.secondary,
    opacity: 0.03,
    bottom: -width * 0.3,
    right: -width * 0.3,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  heroIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.hero,
    fontWeight: '900',
    color: theme.colors.text,
    textAlign: 'center',
    letterSpacing: 8,
    lineHeight: 68,
  },
  subtitle: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.primary,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
    fontWeight: '300',
  },
  subtext: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  statItem: { alignItems: 'center', flex: 1 },
  statNumber: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.primary,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textDim,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: theme.colors.border,
  },
  buttonContainer: {
    marginTop: theme.spacing.xl,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xxl,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    minWidth: 220,
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonText: {
    color: theme.colors.background,
    fontSize: theme.fontSize.lg,
    fontWeight: '800',
    letterSpacing: 3,
  },
  features: {
    marginTop: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  featureIcon: { fontSize: 16 },
  featureText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textDim,
  },
  disclaimer: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textDim,
    textAlign: 'center',
    lineHeight: 18,
    paddingBottom: 40,
  },
});
