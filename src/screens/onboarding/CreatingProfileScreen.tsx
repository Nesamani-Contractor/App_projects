import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/types';
import { STYLE_OPTIONS } from '../../data/onboardingQuiz';
import { colors, gradients, typography } from '../../theme/colors';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'CreatingProfile'>;

export default function CreatingProfileScreen({ navigation, route }: Props) {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 1600, easing: Easing.linear, useNativeDriver: true })
    );
    loop.start();
    const t = setTimeout(() => {
      const mappedLook = STYLE_OPTIONS.find((s) => s.id === route.params.styleId)?.mapsToLook;
      navigation.replace('Paywall', { source: 'onboarding', recommendedLookId: mappedLook });
    }, 2000);
    return () => {
      loop.stop();
      clearTimeout(t);
    };
  }, [navigation, spin, route.params.styleId]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <LinearGradient colors={gradients.glamUpOnboarding} style={styles.fill}>
      <View style={styles.center}>
        <Animated.View style={[styles.ring, { transform: [{ rotate }] }]}>
          <Ionicons name="sparkles" size={28} color={colors.ivory} />
        </Animated.View>
        <Text style={styles.title}>Creating your beauty profile…</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ring: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: colors.ivory,
    borderTopColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: { fontFamily: typography.heading, fontSize: 16, color: colors.ivory },
});
