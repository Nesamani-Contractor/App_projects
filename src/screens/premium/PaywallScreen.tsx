import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList, OnboardingStackParamList } from '../../navigation/types';
import { PREMIUM_FEATURES, PRICING_PLANS } from '../../data/premium';
import { GradientButton } from '../../components/GradientButton';
import { colors, gradients, radii, spacing, typography } from '../../theme/colors';
import { useAppState } from '../../context/AppStateContext';

type Props =
  | NativeStackScreenProps<MainStackParamList, 'Paywall'>
  | NativeStackScreenProps<OnboardingStackParamList, 'Paywall'>;

export default function PaywallScreen({ navigation, route }: Props) {
  const { unlockPremium, completeOnboarding, hasOnboarded } = useAppState();
  const [selectedPlan, setSelectedPlan] = useState(PRICING_PLANS[1].id);
  const isOnboarding = !hasOnboarded || (route.params as any)?.source === 'onboarding';

  const recommendedLookId = (route.params as any)?.recommendedLookId;

  const dismiss = () => {
    if (isOnboarding) {
      completeOnboarding(recommendedLookId);
    } else {
      navigation.goBack();
    }
  };

  const startTrial = () => {
    unlockPremium();
    if (isOnboarding) {
      completeOnboarding(recommendedLookId);
    } else {
      navigation.goBack();
    }
  };

  return (
    <LinearGradient colors={gradients.glamUpPaywall} style={styles.fill}>
      <SafeAreaView style={styles.fill}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Pressable onPress={dismiss} style={styles.closeBtn} hitSlop={12}>
            <Ionicons name="close" size={20} color={colors.ivory} />
          </Pressable>

          <View style={styles.iconWrap}>
            <Ionicons name="diamond" size={30} color={colors.ivory} />
          </View>
          <Text style={styles.title}>Unlock Your Full Glow Up</Text>
          <Text style={styles.subtitle}>
            Your first scan is free. Go Premium for unlimited scans and every feature.
          </Text>

          <View style={styles.featureList}>
            {PREMIUM_FEATURES.map((f) => (
              <View style={styles.featureRow} key={f.label}>
                <Ionicons name={f.icon as any} size={18} color={colors.ivory} />
                <Text style={styles.featureText}>{f.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.plansRow}>
            {PRICING_PLANS.map((plan) => (
              <Pressable
                key={plan.id}
                onPress={() => setSelectedPlan(plan.id)}
                style={[styles.planCard, selectedPlan === plan.id && styles.planCardSelected]}
              >
                {plan.badge && (
                  <View style={styles.planBadge}>
                    <Text style={styles.planBadgeText}>{plan.badge}</Text>
                  </View>
                )}
                <Text style={styles.planLabel}>{plan.label}</Text>
                <Text style={styles.planPrice}>{plan.price}</Text>
                <Text style={styles.planPeriod}>{plan.period}</Text>
              </Pressable>
            ))}
          </View>

          <GradientButton label="Start Free Trial" icon="sparkles" variant="white" onPress={startTrial} />
          <Pressable onPress={dismiss} style={styles.notNow}>
            <Text style={styles.notNowText}>Not now</Text>
          </Pressable>

          <Text style={styles.finePrint}>
            Renews automatically 3 days before your trial ends. Cancel anytime before renewal.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl },
  closeBtn: { alignSelf: 'flex-end', padding: spacing.xs },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: typography.display,
    fontSize: 24,
    color: colors.ivory,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: typography.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 19,
    paddingHorizontal: spacing.sm,
  },
  featureList: { marginTop: spacing.lg, marginBottom: spacing.lg },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  featureText: {
    fontFamily: typography.bodyMedium,
    fontSize: 13.5,
    color: colors.ivory,
    marginLeft: 10,
  },
  plansRow: { flexDirection: 'row', gap: 10, marginBottom: spacing.lg },
  planCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  planCardSelected: { borderColor: colors.ivory, backgroundColor: 'rgba(255,255,255,0.18)' },
  planBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: colors.ivory,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.pill,
  },
  planBadgeText: { fontFamily: typography.bodySemiBold, fontSize: 9.5, color: colors.plum },
  planLabel: { fontFamily: typography.bodyMedium, fontSize: 12.5, color: 'rgba(255,255,255,0.85)' },
  planPrice: { fontFamily: typography.display, fontSize: 20, color: colors.ivory, marginTop: 4 },
  planPeriod: { fontFamily: typography.body, fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  notNow: { alignSelf: 'center', marginTop: spacing.md, padding: spacing.xs },
  notNowText: {
    fontFamily: typography.bodyMedium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    textDecorationLine: 'underline',
  },
  finePrint: {
    fontFamily: typography.body,
    fontSize: 10.5,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 15,
  },
});
