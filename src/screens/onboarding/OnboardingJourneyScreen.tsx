import React, { useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/types';
import { AnimatedGradientBackdrop } from '../../components/AnimatedGradientBackdrop';
import { GlassCard } from '../../components/GlassCard';
import { GradientButton } from '../../components/GradientButton';
import { MagoAvatar } from '../../components/journey/MagoAvatar';
import { JourneyProgressBar } from '../../components/journey/JourneyProgressBar';
import { JourneyOptionRow } from '../../components/journey/JourneyOptionRow';
import { JourneyEmojiScale } from '../../components/journey/JourneyEmojiScale';
import { JourneySlider } from '../../components/journey/JourneySlider';
import {
  JOURNEY_STEPS,
  JourneyAnswers,
  getRecommendedLookId,
  getTopGoalLabel,
} from '../../data/onboardingJourney';
import { useAppState } from '../../context/AppStateContext';
import { colors, spacing, typography } from '../../theme/colors';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Journey'>;
type Phase = 'intro' | 'question' | 'reveal';

const initialAnswers = (): JourneyAnswers => {
  const defaults: JourneyAnswers = {};
  JOURNEY_STEPS.forEach((s) => {
    if (s.type === 'slider') defaults[s.id] = s.defaultIndex;
  });
  return defaults;
};

export default function OnboardingJourneyScreen({ navigation }: Props) {
  const { saveJourneyAnswers } = useAppState();
  const [phase, setPhase] = useState<Phase>('intro');
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<JourneyAnswers>(initialAnswers);
  const [introExpanded, setIntroExpanded] = useState(false);
  const [feedback, setFeedback] = useState<string | undefined>();
  const feedbackOpacity = useRef(new Animated.Value(0)).current;

  const step = JOURNEY_STEPS[stepIdx];

  const showFeedback = (text: string) => {
    setFeedback(text);
    feedbackOpacity.setValue(0);
    Animated.sequence([
      Animated.timing(feedbackOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(500),
      Animated.timing(feedbackOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const advance = () => {
    if (stepIdx < JOURNEY_STEPS.length - 1) {
      setStepIdx((i) => i + 1);
    } else {
      setPhase('reveal');
    }
  };

  const goBack = () => {
    if (phase === 'reveal') {
      setPhase('question');
      return;
    }
    if (phase === 'question') {
      if (stepIdx === 0) {
        setPhase('intro');
      } else {
        setStepIdx((i) => i - 1);
      }
      return;
    }
    navigation.goBack();
  };

  const selectSingle = (optionId: string, feedbackText?: string) => {
    setAnswers((a) => ({ ...a, [step.id]: optionId }));
    showFeedback(feedbackText ?? 'Got it!');
    setTimeout(advance, 750);
  };

  const toggleMulti = (optionId: string) => {
    if (step.type !== 'multi') return;
    const exclusive = step.exclusiveOptionId;
    setAnswers((a) => {
      const current = (a[step.id] as string[]) ?? [];
      let next: string[];
      if (exclusive && optionId === exclusive) {
        next = current.includes(exclusive) ? [] : [exclusive];
      } else if (exclusive && current.includes(exclusive)) {
        next = [optionId];
      } else {
        next = current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];
      }
      return { ...a, [step.id]: next };
    });
  };

  const finish = () => {
    saveJourneyAnswers(answers);
    navigation.navigate('CreatingProfile', { lookId: getRecommendedLookId(answers) });
  };

  return (
    <AnimatedGradientBackdrop>
      <SafeAreaView style={styles.fill}>
        <View style={styles.headerRow}>
          <Pressable onPress={goBack} style={styles.backBtn} hitSlop={10}>
            <Ionicons name="chevron-back" size={20} color={colors.ivory} />
          </Pressable>
        </View>

        {phase === 'intro' && (
          <View style={styles.introWrap}>
            <MagoAvatar size={72} />
            <Text style={styles.name}>Mago</Text>
            <Text style={styles.introText}>
              Hi, I'm Mago ✨ I'd love to get to know your beauty journey so I can build a plan
              that's truly yours. This takes about 60 seconds. Ready?
            </Text>
            {introExpanded && (
              <Text style={styles.introMore}>
                We'll ask about your goals, skin, routine, and lifestyle — {JOURNEY_STEPS.length}{' '}
                quick questions in all. Your answers shape your personalized plan and Shine Me
                Guide. Nothing is shared, and you can update your answers anytime.
              </Text>
            )}
            <View style={styles.introButtons}>
              <GradientButton
                label="Let's glow"
                icon="sparkles"
                variant="white"
                onPress={() => setPhase('question')}
              />
              {!introExpanded && (
                <Pressable onPress={() => setIntroExpanded(true)} style={styles.introSecondary}>
                  <Text style={styles.introSecondaryText}>Tell me more first</Text>
                </Pressable>
              )}
            </View>
          </View>
        )}

        {phase === 'question' && step && (
          <ScrollView
            contentContainerStyle={styles.questionScroll}
            showsVerticalScrollIndicator={false}
          >
            <JourneyProgressBar
              sectionLabel={step.section}
              current={stepIdx + 1}
              total={JOURNEY_STEPS.length}
            />
            <GlassCard>
              <Text style={styles.question}>{step.question}</Text>

              {step.type === 'single' && (
                <View>
                  {step.options.map((opt) => (
                    <JourneyOptionRow
                      key={opt.id}
                      option={opt}
                      selected={answers[step.id] === opt.id}
                      onPress={() => selectSingle(opt.id, opt.feedback)}
                    />
                  ))}
                </View>
              )}

              {step.type === 'emoji-scale' && (
                <JourneyEmojiScale
                  options={step.options}
                  selected={answers[step.id] as string | undefined}
                  onSelect={(id) => {
                    const opt = step.options.find((o) => o.id === id);
                    selectSingle(id, opt?.feedback);
                  }}
                />
              )}

              {step.type === 'multi' && (
                <View>
                  {step.options.map((opt) => (
                    <JourneyOptionRow
                      key={opt.id}
                      option={opt}
                      selected={((answers[step.id] as string[]) ?? []).includes(opt.id)}
                      onPress={() => toggleMulti(opt.id)}
                    />
                  ))}
                </View>
              )}

              {step.type === 'slider' && (
                <JourneySlider
                  labels={step.labels}
                  value={(answers[step.id] as number) ?? step.defaultIndex}
                  onChange={(idx) => setAnswers((a) => ({ ...a, [step.id]: idx }))}
                />
              )}
            </GlassCard>

            {feedback && (
              <Animated.View style={[styles.feedbackPill, { opacity: feedbackOpacity }]}>
                <Ionicons name="sparkles" size={13} color={colors.plum} />
                <Text style={styles.feedbackText}>{feedback}</Text>
              </Animated.View>
            )}

            {(step.type === 'multi' || step.type === 'slider') && (
              <GradientButton
                label="Continue"
                icon="arrow-forward"
                variant="white"
                style={styles.continueBtn}
                disabled={step.type === 'multi' && ((answers[step.id] as string[]) ?? []).length === 0}
                onPress={advance}
              />
            )}
          </ScrollView>
        )}

        {phase === 'reveal' && (
          <View style={styles.introWrap}>
            <MagoAvatar size={72} />
            <Text style={styles.name}>Mago</Text>
            <Text style={styles.introText}>
              Amazing! Based on your answers, I've built a starter plan focused on{' '}
              <Text style={styles.highlight}>{getTopGoalLabel(answers).toLowerCase()}</Text>. Now
              let's capture your Day 1 photo so we can track your glow-up over time 📸
            </Text>
            <Text style={styles.consent}>
              Your photo is analyzed on-device to build your beauty profile and is never shared
              without your permission.
            </Text>
            <GradientButton
              label="Take my first scan"
              icon="camera"
              variant="white"
              style={styles.continueBtn}
              onPress={finish}
            />
          </View>
        )}
      </SafeAreaView>
    </AnimatedGradientBackdrop>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  headerRow: { paddingHorizontal: spacing.lg, paddingTop: 4 },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  introWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  name: {
    fontFamily: typography.display,
    fontSize: 22,
    color: colors.ivory,
    marginTop: spacing.md,
  },
  introText: {
    fontFamily: typography.body,
    fontSize: 15,
    color: 'rgba(255,255,255,0.92)',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  introMore: {
    fontFamily: typography.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 19,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  highlight: { fontFamily: typography.bodySemiBold, color: colors.ivory },
  consent: {
    fontFamily: typography.body,
    fontSize: 11.5,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 17,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  introButtons: { width: '100%', marginTop: spacing.xl, alignItems: 'center' },
  introSecondary: { marginTop: spacing.md, padding: spacing.xs },
  introSecondaryText: {
    fontFamily: typography.bodyMedium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    textDecorationLine: 'underline',
  },
  questionScroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
    justifyContent: 'center',
  },
  question: {
    fontFamily: typography.heading,
    fontSize: 18,
    color: colors.ivory,
    marginBottom: spacing.md,
    lineHeight: 25,
  },
  continueBtn: { marginTop: spacing.lg },
  feedbackPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.ivory,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginTop: spacing.md,
  },
  feedbackText: {
    fontFamily: typography.bodyMedium,
    fontSize: 12.5,
    color: colors.plum,
    marginLeft: 6,
  },
});
