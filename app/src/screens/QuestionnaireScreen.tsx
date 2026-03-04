import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Easing,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme } from '../theme';
import { RootStackParamList, UserResponse } from '../types';
import { questions } from '../data/questions';
import ProgressBar from '../components/ProgressBar';
import MicroReward from '../components/MicroReward';

type Props = NativeStackScreenProps<RootStackParamList, 'Questionnaire'>;

// Generate fake poll percentages that sum to 100%
function generateFakePolls(optionCount: number): number[] {
  if (optionCount <= 0) return [];
  // Generate random weights, then normalize to 100
  const raw = Array.from({ length: optionCount }, () => Math.random() * 40 + 5);
  const sum = raw.reduce((a, b) => a + b, 0);
  const percentages = raw.map((v) => Math.round((v / sum) * 100));
  // Fix rounding error on last item
  const diff = 100 - percentages.reduce((a, b) => a + b, 0);
  percentages[percentages.length - 1] += diff;
  return percentages;
}

const { width } = Dimensions.get('window');

// Category icons for visual polish
const CATEGORY_ICONS: Record<string, string> = {
  demographics: '👤',
  exercise: '🏃',
  diet: '🥗',
  sleep: '😴',
  habits: '⚡',
  mental_health: '🧠',
  social: '🤝',
  medical: '🏥',
};

// Category descriptions shown beneath the category label
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  demographics: 'Basic information about you',
  exercise: 'Your physical activity habits',
  diet: 'What you eat and drink',
  sleep: 'Your rest and recovery',
  habits: 'Daily choices that affect lifespan',
  mental_health: 'Your emotional wellbeing',
  social: 'Your connections with others',
  medical: 'Your health history',
};

// Auto-advance delay after selection (ms)
const AUTO_ADVANCE_DELAY = 600;

export default function QuestionnaireScreen({ navigation }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [numberValue, setNumberValue] = useState('');
  const [sliderValue, setSliderValue] = useState<number | null>(null);
  const [dateValue, setDateValue] = useState('');
  const [showReward, setShowReward] = useState(false);
  const [rewardMessage, setRewardMessage] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pollPercentages, setPollPercentages] = useState<number[]>([]);
  const [showPolls, setShowPolls] = useState(false);

  // Refs
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textInputRef = useRef<TextInput>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const optionScaleAnims = useRef<Animated.Value[]>([]);
  const pendulumAnim = useRef(new Animated.Value(0)).current;
  const pollFadeAnim = useRef(new Animated.Value(0)).current;

  const question = questions[currentIndex];
  const progress = (currentIndex + 1) / questions.length;

  // Initialize option scale animations when question changes
  useEffect(() => {
    const count = question.options?.length ?? 0;
    optionScaleAnims.current = Array.from({ length: count }, () => new Animated.Value(1));
  }, [currentIndex]);

  // Set default slider value when a slider question loads
  useEffect(() => {
    if (question.type === 'slider') {
      const min = question.min ?? 1;
      const max = question.max ?? 10;
      setSliderValue(Math.round((min + max) / 2));
    }
  }, [currentIndex, question]);

  // Pendulum swing animation - single continuous linear cycle
  // Uses sine-wave interpolation so pendulum is slowest at peaks, fastest at center (gravity)
  useEffect(() => {
    Animated.loop(
      Animated.timing(pendulumAnim, {
        toValue: 1,
        duration: 3200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Reset polls when question changes
  useEffect(() => {
    setShowPolls(false);
    pollFadeAnim.setValue(0);
  }, [currentIndex]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    };
  }, []);

  // ---- TRANSITION ANIMATIONS ----
  const animateForward = useCallback((callback: () => void) => {
    setIsTransitioning(true);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -width * 0.3, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      callback();
      slideAnim.setValue(width * 0.2);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, friction: 9, useNativeDriver: true }),
      ]).start(() => setIsTransitioning(false));
    });
  }, [fadeAnim, slideAnim]);

  const animateBackward = useCallback((callback: () => void) => {
    setIsTransitioning(true);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: width * 0.3, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      callback();
      slideAnim.setValue(-width * 0.2);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, friction: 9, useNativeDriver: true }),
      ]).start(() => setIsTransitioning(false));
    });
  }, [fadeAnim, slideAnim]);

  // ---- RECORD ANSWER & ADVANCE ----
  const recordAndAdvance = useCallback((overrideAnswer?: string, overrideImpact?: number) => {
    if (isTransitioning) return;
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);

    let impact = overrideImpact ?? 0;
    let answer = overrideAnswer ?? '';

    if (question.type === 'single') {
      const val = overrideAnswer || selectedOption || '';
      const opt = question.options?.find((o) => o.value === val);
      impact = overrideImpact ?? opt?.impact ?? 0;
      answer = val;
    } else if (question.type === 'number') {
      answer = numberValue;
      impact = 0;
    } else if (question.type === 'slider') {
      const sv = sliderValue ?? Math.round(((question.min ?? 1) + (question.max ?? 10)) / 2);
      answer = String(sv);
      if (question.id === 'sleep_hours') {
        impact = sv >= 7 && sv <= 9 ? 2 : sv < 5 ? -2 : 0;
      } else if (question.id === 'happiness') {
        impact = sv >= 7 ? 2 : sv <= 3 ? -2 : 0;
      } else if (question.id === 'sedentary_hours') {
        impact = sv > 10 ? -2 : sv > 6 ? -1 : 1;
      }
    } else if (question.type === 'date') {
      // If overrideAnswer is provided (pre-computed YYYY-MM-DD from handleTextChange), use it
      if (overrideAnswer) {
        answer = overrideAnswer;
      } else {
        // Fallback: convert MM-DD-YYYY display format to YYYY-MM-DD
        const digits = dateValue.replace(/\D/g, '');
        if (digits.length >= 8) {
          const mm = digits.slice(0, 2);
          const dd = digits.slice(2, 4);
          const yyyy = digits.slice(4, 8);
          answer = `${yyyy}-${mm}-${dd}`;
        } else {
          answer = dateValue;
        }
      }
      impact = 0;
    }

    const newResponse: UserResponse = { questionId: question.id, answer, impact };
    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);

    // Show micro-reward if available
    if (question.microReward) {
      setRewardMessage(question.microReward);
      setShowReward(true);
      setTimeout(() => setShowReward(false), 1800);
    }

    // Last question → go to calculation
    if (currentIndex >= questions.length - 1) {
      navigation.replace('Calculation', { responses: updatedResponses });
      return;
    }

    // Animate to next question
    animateForward(() => {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setNumberValue('');
      setSliderValue(null);
      setDateValue('');
    });
  }, [
    question, selectedOption, numberValue, sliderValue, dateValue,
    responses, currentIndex, navigation, animateForward, isTransitioning,
  ]);

  // ---- AUTO-ADVANCE: SINGLE CHOICE ----
  const handleOptionSelect = useCallback((value: string, impact: number, index: number) => {
    if (isTransitioning) return;
    setSelectedOption(value);

    // Show fake poll percentages
    const optCount = question.options?.length ?? 0;
    if (optCount > 0) {
      const polls = generateFakePolls(optCount);
      // Boost the selected option's percentage slightly for realism
      const boost = Math.floor(Math.random() * 10) + 5;
      polls[index] += boost;
      // Reduce others proportionally
      const totalOther = polls.reduce((s, v, i) => i !== index ? s + v : s, 0);
      if (totalOther > 0) {
        for (let i = 0; i < polls.length; i++) {
          if (i !== index) {
            polls[i] = Math.max(1, Math.round(polls[i] - (boost * polls[i] / totalOther)));
          }
        }
      }
      // Fix to 100%
      const sum = polls.reduce((a, b) => a + b, 0);
      polls[index] += (100 - sum);
      setPollPercentages(polls);
      setShowPolls(true);
      Animated.timing(pollFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

    // Quick pop animation on the selected option
    if (optionScaleAnims.current[index]) {
      Animated.sequence([
        Animated.timing(optionScaleAnims.current[index], {
          toValue: 0.96, duration: 80, useNativeDriver: true,
        }),
        Animated.spring(optionScaleAnims.current[index], {
          toValue: 1, friction: 5, useNativeDriver: true,
        }),
      ]).start();
    }

    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    autoAdvanceTimer.current = setTimeout(() => {
      recordAndAdvance(value, impact);
    }, AUTO_ADVANCE_DELAY);
  }, [isTransitioning, recordAndAdvance, question]);

  // ---- AUTO-ADVANCE: SLIDER ----
  const handleSliderSelect = useCallback((value: number) => {
    if (isTransitioning) return;
    setSliderValue(value);
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    autoAdvanceTimer.current = setTimeout(() => {
      recordAndAdvance();
    }, AUTO_ADVANCE_DELAY + 200);
  }, [isTransitioning, recordAndAdvance]);

  // ---- AUTO-ADVANCE: TEXT INPUT (number + date) ----
  const handleTextChange = useCallback((text: string) => {
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);

    if (question.type === 'date') {
      // Auto-format MM-DD-YYYY: insert dashes as user types digits
      const digits = text.replace(/\D/g, '');
      let formatted = digits;
      if (digits.length > 2) formatted = digits.slice(0, 2) + '-' + digits.slice(2);
      if (digits.length > 4) formatted = digits.slice(0, 2) + '-' + digits.slice(2, 4) + '-' + digits.slice(4, 8);
      setDateValue(formatted);

      // Auto-advance when full valid date entered (MM-DD-YYYY)
      if (digits.length >= 8) {
        const month = parseInt(digits.slice(0, 2), 10);
        const day = parseInt(digits.slice(2, 4), 10);
        const year = parseInt(digits.slice(4, 8), 10);
        if (year >= 1900 && year <= 2010 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
          // Pre-compute YYYY-MM-DD and pass directly to avoid stale closure
          const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          Keyboard.dismiss();
          autoAdvanceTimer.current = setTimeout(() => recordAndAdvance(isoDate, 0), AUTO_ADVANCE_DELAY);
        }
      }
    } else if (question.type === 'number') {
      const cleaned = text.replace(/\D/g, '');
      setNumberValue(cleaned);

      const num = parseInt(cleaned, 10);
      const min = question.min ?? 0;
      const max = question.max ?? 999;
      const minDigits = String(min).length;

      // Auto-advance when valid number with enough digits
      if (cleaned.length >= minDigits && num >= min && num <= max) {
        autoAdvanceTimer.current = setTimeout(() => {
          Keyboard.dismiss();
          setTimeout(() => recordAndAdvance(), 300);
        }, 1200);
      }
    }
  }, [question, recordAndAdvance]);

  // ---- BACK NAVIGATION ----
  const handleBack = useCallback(() => {
    if (isTransitioning) return;
    if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    Keyboard.dismiss();

    if (currentIndex === 0) {
      navigation.goBack();
      return;
    }

    // Remove last response
    setResponses((prev) => prev.slice(0, -1));

    animateBackward(() => {
      setCurrentIndex((prev) => prev - 1);
      setSelectedOption(null);
      setNumberValue('');
      setSliderValue(null);
      setDateValue('');
    });
  }, [currentIndex, navigation, animateBackward, isTransitioning]);

  // ---- RENDER SLIDER ----
  const renderSlider = () => {
    const min = question.min ?? 1;
    const max = question.max ?? 10;
    const steps: number[] = [];
    for (let i = min; i <= max; i++) steps.push(i);
    const sv = sliderValue ?? Math.round((min + max) / 2);

    return (
      <View style={styles.sliderContainer}>
        <View style={styles.sliderValueRow}>
          <Text style={styles.sliderValueBig}>{sv}</Text>
          <Text style={styles.sliderUnitText}>{question.unit || ''}</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sliderSteps}
        >
          {steps.map((step) => {
            const isActive = sv === step;
            return (
              <TouchableOpacity
                key={step}
                onPress={() => handleSliderSelect(step)}
                style={[styles.sliderStep, isActive && styles.sliderStepActive]}
                activeOpacity={0.7}
              >
                <Text style={[styles.sliderStepText, isActive && styles.sliderStepTextActive]}>
                  {step}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={styles.sliderRange}>
          <Text style={styles.sliderRangeText}>{min} {question.unit}</Text>
          <Text style={styles.sliderRangeText}>{max} {question.unit}</Text>
        </View>
      </View>
    );
  };

  // ---- RENDER ----
  const categoryKey = question.category;
  const icon = CATEGORY_ICONS[categoryKey] ?? '📊';
  const categoryDesc = CATEGORY_DESCRIPTIONS[categoryKey] ?? '';
  const isFirstInCategory =
    currentIndex === 0 || questions[currentIndex - 1].category !== question.category;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Progress bar */}
      <ProgressBar progress={progress} />

      {/* Top bar: back button + counter */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7}>
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backLabel}>{currentIndex === 0 ? 'Exit' : 'Back'}</Text>
        </TouchableOpacity>
        <View style={styles.counterPill}>
          <Text style={styles.counterCurrent}>{currentIndex + 1}</Text>
          <Text style={styles.counterSep}>/</Text>
          <Text style={styles.counterTotal}>{questions.length}</Text>
        </View>
      </View>

      {/* Micro reward overlay */}
      <MicroReward message={rewardMessage} visible={showReward} />

      {/* Question content */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.questionWrap,
            { opacity: fadeAnim, transform: [{ translateX: slideAnim }] },
          ]}
        >
          {/* Category badge on first question of each section */}
          {isFirstInCategory && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryIcon}>{icon}</Text>
              <View style={styles.categoryTextWrap}>
                <Text style={styles.categoryName}>
                  {categoryKey.replace('_', ' ').toUpperCase()}
                </Text>
                <Text style={styles.categoryDesc}>{categoryDesc}</Text>
              </View>
            </View>
          )}

          {/* Question number pill */}
          <View style={styles.qNumPill}>
            <Text style={styles.qNumText}>Q{currentIndex + 1}</Text>
          </View>

          {/* Question text */}
          <Text style={styles.questionText}>{question.text}</Text>
          {question.subtitle && <Text style={styles.subtitle}>{question.subtitle}</Text>}

          {/* Inputs */}
          <View style={styles.inputArea}>
            {question.type === 'single' && question.options?.map((option, idx) => {
              const isSelected = selectedOption === option.value;
              const scaleAnim = optionScaleAnims.current[idx];
              const pollPct = showPolls && pollPercentages[idx] != null ? pollPercentages[idx] : null;
              return (
                <Animated.View
                  key={option.value}
                  style={scaleAnim ? { transform: [{ scale: scaleAnim }] } : undefined}
                >
                  <TouchableOpacity
                    style={[styles.optionBtn, isSelected && styles.optionBtnSelected]}
                    onPress={() => handleOptionSelect(option.value, option.impact, idx)}
                    activeOpacity={0.7}
                    disabled={isTransitioning || showPolls}
                  >
                    {/* Poll fill bar behind the option */}
                    {pollPct !== null && (
                      <Animated.View
                        style={[
                          styles.pollFillBar,
                          {
                            width: `${pollPct}%`,
                            opacity: pollFadeAnim,
                            backgroundColor: isSelected
                              ? 'rgba(0, 212, 255, 0.15)'
                              : 'rgba(255, 255, 255, 0.04)',
                          },
                        ]}
                      />
                    )}
                    <View style={[styles.radio, isSelected && styles.radioSelected]}>
                      {isSelected && <View style={styles.radioDot} />}
                    </View>
                    <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                      {option.label}
                    </Text>
                    {pollPct !== null ? (
                      <Animated.Text style={[styles.pollText, { opacity: pollFadeAnim }]}>
                        {pollPct}%
                      </Animated.Text>
                    ) : isSelected ? (
                      <View style={styles.checkCircle}>
                        <Text style={styles.checkMark}>✓</Text>
                      </View>
                    ) : null}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
            {/* "Others selected" label when polls visible */}
            {showPolls && question.type === 'single' && (
              <Animated.Text style={[styles.pollLabel, { opacity: pollFadeAnim }]}>
                Based on other users' responses
              </Animated.Text>
            )}

            {question.type === 'number' && (
              <View style={styles.textInputWrap}>
                <TextInput
                  ref={textInputRef}
                  style={styles.bigInput}
                  value={numberValue}
                  onChangeText={handleTextChange}
                  keyboardType="number-pad"
                  placeholder="Enter value"
                  placeholderTextColor={theme.colors.textDim}
                  maxLength={5}
                  autoFocus
                />
                <View style={styles.inputMeta}>
                  <Text style={styles.inputUnit}>{question.unit}</Text>
                  <Text style={styles.inputRange}>Range: {question.min} – {question.max}</Text>
                </View>
              </View>
            )}

            {question.type === 'slider' && renderSlider()}

            {question.type === 'date' && (
              <View style={styles.textInputWrap}>
                <TextInput
                  ref={textInputRef}
                  style={styles.bigInput}
                  value={dateValue}
                  onChangeText={handleTextChange}
                  keyboardType="number-pad"
                  placeholder="MMDDYYYY"
                  placeholderTextColor={theme.colors.textDim}
                  maxLength={10}
                  autoFocus
                />
                <Text style={styles.inputHint}>Enter as MM-DD-YYYY</Text>
              </View>
            )}
          </View>

          {question.type === 'slider' && (
            <Text style={styles.tapHint}>Tap a value to continue</Text>
          )}
        </Animated.View>
      </ScrollView>

      {/* Swinging hourglass pendulum at bottom */}
      <View style={styles.pendulumContainer}>
        <View style={styles.pendulumLine} />
        <Animated.View
          style={[
            styles.pendulumArm,
            {
              transform: [
                {
                  // Sine-wave interpolation: 20 sample points around sin(2πt) * 30°
                  // Naturally slow at peaks (gravity), fast through center
                  rotate: pendulumAnim.interpolate({
                    inputRange: [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1],
                    outputRange: [
                      '0deg',    // sin(0) = 0
                      '9.3deg',  // sin(0.314) ≈ 0.309
                      '17.6deg', // sin(0.628) ≈ 0.588
                      '24deg',   // sin(0.942) ≈ 0.809
                      '27.8deg', // sin(1.257) ≈ 0.951
                      '28deg',   // sin(1.571) = 1.0 (peak)
                      '24.8deg', // sin(1.885) ≈ 0.951 (descending)
                      '18.5deg',
                      '10.5deg',
                      '2.8deg',
                      '0deg',    // sin(π) = 0 (center)
                      '-9.3deg',
                      '-17.6deg',
                      '-24deg',
                      '-27.8deg',
                      '-28deg',  // sin(4.712) = -1.0 (opposite peak)
                      '-24.8deg',
                      '-18.5deg',
                      '-10.5deg',
                      '-2.8deg',
                      '0deg',    // sin(2π) = 0 (seamless loop)
                    ],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.pendulumString} />
          <Text style={styles.pendulumIcon}>⏳</Text>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
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
  backButton: {
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
  counterPill: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  counterCurrent: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  counterSep: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textDim,
    marginHorizontal: 2,
  },
  counterTotal: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textDim,
    fontWeight: '500',
  },
  scrollArea: { flex: 1 },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: 40,
  },
  questionWrap: {},
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  categoryIcon: { fontSize: 24 },
  categoryTextWrap: {},
  categoryName: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primary,
    letterSpacing: 2,
    fontWeight: '700',
  },
  categoryDesc: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textDim,
    marginTop: 1,
  },
  qNumPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 212, 255, 0.12)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.sm,
  },
  qNumText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primary,
    fontWeight: '700',
    letterSpacing: 1,
  },
  questionText: {
    fontSize: 24,
    color: theme.colors.text,
    fontWeight: '700',
    lineHeight: 34,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    lineHeight: 22,
  },
  inputArea: { marginTop: theme.spacing.xl },

  // Options
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceLight,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.md,
    marginBottom: 10,
  },
  optionBtnSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(0, 212, 255, 0.08)',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.textDim,
    marginRight: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: { borderColor: theme.colors.primary },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  optionLabel: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  optionLabelSelected: { color: theme.colors.text },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: { color: theme.colors.background, fontSize: 14, fontWeight: '700' },

  // Text inputs
  textInputWrap: { alignItems: 'center' },
  bigInput: {
    backgroundColor: theme.colors.surfaceLight,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: 18,
    paddingHorizontal: theme.spacing.xl,
    fontSize: 32,
    color: theme.colors.text,
    textAlign: 'center',
    fontWeight: '700',
    width: '100%',
    letterSpacing: 2,
  },
  inputMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
  },
  inputUnit: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  inputRange: { fontSize: theme.fontSize.xs, color: theme.colors.textDim },
  inputHint: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textDim,
    marginTop: theme.spacing.sm,
  },

  // Slider
  sliderContainer: { alignItems: 'center' },
  sliderValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: theme.spacing.lg,
    gap: 6,
  },
  sliderValueBig: { fontSize: 48, color: theme.colors.primary, fontWeight: '800' },
  sliderUnitText: { fontSize: theme.fontSize.lg, color: theme.colors.textDim, fontWeight: '500' },
  sliderSteps: { flexDirection: 'row', gap: 8, paddingHorizontal: theme.spacing.sm },
  sliderStep: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: theme.colors.surfaceLight,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderStepActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  sliderStepText: { fontSize: theme.fontSize.sm, color: theme.colors.textSecondary, fontWeight: '600' },
  sliderStepTextActive: { color: theme.colors.background, fontWeight: '800' },
  sliderRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
  },
  sliderRangeText: { fontSize: theme.fontSize.xs, color: theme.colors.textDim },
  tapHint: {
    textAlign: 'center',
    color: theme.colors.textDim,
    fontSize: theme.fontSize.xs,
    marginTop: theme.spacing.xl,
    letterSpacing: 1,
  },

  // Poll percentages
  pollFillBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: theme.borderRadius.md,
  },
  pollText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: '700',
    minWidth: 40,
    textAlign: 'right',
  },
  pollLabel: {
    textAlign: 'center',
    fontSize: theme.fontSize.xs,
    color: theme.colors.textDim,
    marginTop: theme.spacing.sm,
    fontStyle: 'italic',
  },

  // Pendulum
  pendulumContainer: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  pendulumLine: {
    width: 1,
    height: 0,
    backgroundColor: theme.colors.border,
  },
  pendulumArm: {
    alignItems: 'center',
    // Pivot from top center
    transformOrigin: 'top center',
  },
  pendulumString: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(0, 212, 255, 0.3)',
  },
  pendulumIcon: {
    fontSize: 32,
    marginTop: -4,
  },
});
