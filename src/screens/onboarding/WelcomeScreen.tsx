import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/types';
import { GradientButton } from '../../components/GradientButton';
import { colors, gradients, spacing, typography } from '../../theme/colors';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <LinearGradient colors={gradients.glamUpOnboarding} style={styles.fill}>
      <SafeAreaView style={styles.content}>
        <View style={styles.badge}>
          <Ionicons name="sparkles" size={30} color={colors.violetDeep} />
        </View>
        <Text style={styles.title}>Shine Me</Text>
        <Text style={styles.tagline}>Your personal AI beauty consultant for the ultimate glow up</Text>

        <View style={styles.featureList}>
          {[
            'Scan your face for a color & style analysis',
            'Get a personalized Shine Me Guide',
            'Discover the makeup look made for you',
          ].map((f) => (
            <View style={styles.featureRow} key={f}>
              <Ionicons name="checkmark-circle" size={18} color={colors.violetDeep} />
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>

        <GradientButton
          label="Get Started"
          icon="arrow-forward"
          onPress={() => navigation.navigate('GoalQuiz')}
          style={{ marginTop: spacing.xl }}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.lg },
  badge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: typography.display,
    fontSize: 34,
    color: colors.violetDeep,
    textAlign: 'center',
  },
  tagline: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.plum,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    lineHeight: 20,
  },
  featureList: { marginTop: spacing.xl },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  featureText: {
    fontFamily: typography.bodyMedium,
    fontSize: 13.5,
    color: colors.violetDeep,
    marginLeft: 10,
  },
});
