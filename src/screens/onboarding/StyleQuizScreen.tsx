import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/types';
import { STYLE_OPTIONS } from '../../data/onboardingQuiz';
import { QuizOptionCard } from '../../components/QuizOptionCard';
import { GradientButton } from '../../components/GradientButton';
import { colors, gradients, spacing, typography } from '../../theme/colors';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'StyleQuiz'>;

export default function StyleQuizScreen({ navigation, route }: Props) {
  const [selected, setSelected] = useState<string | undefined>();

  return (
    <LinearGradient colors={gradients.glamUpOnboarding} style={styles.fill}>
      <SafeAreaView style={styles.content}>
        <Text style={styles.eyebrow}>STEP 2 OF 2</Text>
        <Text style={styles.title}>How would you describe your style?</Text>
        <View style={styles.options}>
          {STYLE_OPTIONS.map((opt) => (
            <QuizOptionCard
              key={opt.id}
              option={opt}
              selected={selected === opt.id}
              onPress={() => setSelected(opt.id)}
            />
          ))}
        </View>
        <GradientButton
          label="See My Results"
          icon="sparkles-outline"
          variant="white"
          disabled={!selected}
          onPress={() =>
            selected &&
            navigation.navigate('CreatingProfile', { goalId: route.params.goalId, styleId: selected })
          }
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.lg },
  eyebrow: {
    fontFamily: typography.bodySemiBold,
    fontSize: 12,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  title: {
    fontFamily: typography.display,
    fontSize: 24,
    color: colors.ivory,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  options: { marginBottom: spacing.lg },
});
