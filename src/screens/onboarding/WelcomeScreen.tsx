import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/types';
import { GradientButton } from '../../components/GradientButton';
import { HeroPhotoCollage } from '../../components/HeroPhotoCollage';
import { AnimatedGradientBackdrop } from '../../components/AnimatedGradientBackdrop';
import { GlassCard } from '../../components/GlassCard';
import { GradientText } from '../../components/GradientText';
import { colors, gradients, radii, spacing, typography } from '../../theme/colors';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Welcome'>;

const { width } = Dimensions.get('window');
const titleWidth = Math.min(width - spacing.lg * 2, 320);

const FEATURES = [
  'Scan your face for a color & style analysis',
  'Get a personalized Shine Me Guide',
  'Discover the makeup look made for you',
];

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <AnimatedGradientBackdrop>
      <SafeAreaView style={styles.fill}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <HeroPhotoCollage height={210} />
          <Text style={styles.joinCaption}>Join thousands shining today</Text>

          <View style={styles.titleWrap}>
            <GradientText
              text="Shine Me"
              width={titleWidth}
              height={58}
              fontSize={42}
              colors={gradients.titleGradient}
              fontFamily={typography.display}
            />
          </View>

          <Text style={styles.tagline}>Your personal AI beauty consultant for the ultimate glow up</Text>

          <GlassCard style={styles.featureCard}>
            {FEATURES.map((f) => (
              <View style={styles.featureRow} key={f}>
                <LinearGradient colors={gradients.iconBadge} style={styles.featureIcon}>
                  <Ionicons name="checkmark" size={13} color={colors.plum} />
                </LinearGradient>
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </GlassCard>

          <View style={styles.ctaWrap}>
            <GradientButton
              label="Get Started"
              icon="arrow-forward"
              variant="white"
              onPress={() => navigation.navigate('Journey')}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </AnimatedGradientBackdrop>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  joinCaption: {
    fontFamily: typography.bodySemiBold,
    fontSize: 12,
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  titleWrap: { alignItems: 'center', justifyContent: 'center' },
  tagline: {
    fontFamily: typography.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    lineHeight: 20,
  },
  featureCard: { marginTop: spacing.xl },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  featureIcon: {
    width: 26,
    height: 26,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontFamily: typography.bodyMedium,
    fontSize: 13.5,
    color: colors.ivory,
    marginLeft: 12,
    flexShrink: 1,
  },
  ctaWrap: {
    marginTop: spacing.xl,
    shadowColor: colors.ivory,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
});
