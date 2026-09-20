import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScanStackParamList } from '../../navigation/types';
import { colors, gradients, typography } from '../../theme/colors';
import { COLOR_SEASONS } from '../../data/colorSeasons';

type Props = NativeStackScreenProps<ScanStackParamList, 'Analyzing'>;

const STEPS = [
  { icon: 'color-palette-outline' as const, label: 'Reading your undertone…' },
  { icon: 'happy-outline' as const, label: 'Mapping your facial features…' },
  { icon: 'sparkles-outline' as const, label: 'Finding your perfect colors…' },
  { icon: 'heart-outline' as const, label: 'Writing your Shine Me guide…' },
];

export default function AnalyzingScreen({ navigation }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinLoop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 2200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinLoop.start();

    const interval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    }, 750);

    const timeout = setTimeout(() => {
      const seed = Math.floor(Math.random() * 1000);
      navigation.replace('Results', {
        seasonId: COLOR_SEASONS[seed % COLOR_SEASONS.length].id,
        praiseIndex: seed,
        timestamp: new Date().toISOString(),
        score: 88 + (seed % 10),
      });
    }, 3200);

    return () => {
      spinLoop.stop();
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigation, spin]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <LinearGradient colors={gradients.vaultHeader} style={styles.fill}>
      <View style={styles.center}>
        <View style={styles.ringWrap}>
          <Animated.View style={[styles.ring, { transform: [{ rotate }] }]}>
            <LinearGradient
              colors={['#FFFFFF', 'rgba(255,255,255,0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ringGradient}
            />
          </Animated.View>
          <View style={styles.ringInner}>
            <Ionicons name="sparkles" size={30} color={colors.ivory} />
          </View>
        </View>

        <Text style={styles.title}>Your Shine Me AI{'\n'}is analyzing you</Text>

        <View style={styles.stepsWrap}>
          {STEPS.map((step, i) => (
            <View key={step.label} style={styles.stepRow}>
              <Ionicons
                name={i <= stepIndex ? 'checkmark-circle' : step.icon}
                size={16}
                color={i <= stepIndex ? colors.ivory : 'rgba(255,255,255,0.45)'}
              />
              <Text style={[styles.stepText, i <= stepIndex && styles.stepTextActive]}>
                {step.label}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  ringWrap: { width: 140, height: 140, alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
  ring: { position: 'absolute', width: 140, height: 140, borderRadius: 70 },
  ringGradient: { flex: 1, borderRadius: 70 },
  ringInner: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: 'rgba(229,72,122,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  title: {
    fontFamily: typography.display,
    fontSize: 22,
    color: colors.ivory,
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 28,
  },
  stepsWrap: { width: '100%', gap: 12 },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  stepText: {
    fontFamily: typography.body,
    fontSize: 13.5,
    color: 'rgba(255,255,255,0.55)',
    marginLeft: 10,
  },
  stepTextActive: { color: colors.ivory, fontFamily: typography.bodyMedium },
});
