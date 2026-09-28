import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScanStackParamList } from '../../navigation/types';
import { colors, gradients, spacing, typography } from '../../theme/colors';
import { API_BASE_URL } from '../../config/api';
import { photoUriToBase64 } from '../../utils/photo';
import { useAppState } from '../../context/AppStateContext';
import { GradientButton } from '../../components/GradientButton';

type Props = NativeStackScreenProps<ScanStackParamList, 'Analyzing'>;

const STEPS = [
  { icon: 'color-palette-outline' as const, label: 'Reading your undertone…' },
  { icon: 'happy-outline' as const, label: 'Mapping your facial features…' },
  { icon: 'sparkles-outline' as const, label: 'Finding your perfect colors…' },
  { icon: 'heart-outline' as const, label: 'Checking in with the AI Face Reader…' },
];

export default function AnalyzingScreen({ navigation, route }: Props) {
  const { photoUri } = route.params;
  const { journeyAnswers } = useAppState();
  const [stepIndex, setStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
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
    }, 1500);

    let cancelled = false;

    (async () => {
      try {
        const imageBase64 = await photoUriToBase64(photoUri);
        const res = await fetch(`${API_BASE_URL}/api/scan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64, mediaType: 'image/jpeg', profile: journeyAnswers }),
        });
        const body = await res.json();
        if (cancelled) return;

        if (!res.ok) {
          setErrorMessage(body.message || "We couldn't read that photo. Please retake it.");
          return;
        }

        navigation.replace('Results', {
          scanId: body.scanId,
          scan: body.scan,
          timestamp: new Date().toISOString(),
          photoUri,
        });
      } catch (err: any) {
        if (!cancelled) {
          setErrorMessage(
            `Couldn't reach the Shine Me AI server (${API_BASE_URL}). Make sure the backend in /server is running.`
          );
        }
      }
    })();

    return () => {
      cancelled = true;
      spinLoop.stop();
      clearInterval(interval);
    };
  }, [navigation, spin, photoUri, journeyAnswers]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  if (errorMessage) {
    return (
      <LinearGradient colors={gradients.vaultHeader} style={styles.fill}>
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={40} color={colors.ivory} />
          <Text style={styles.title}>Couldn't complete that scan</Text>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <GradientButton
            label="Retake Photo"
            icon="camera-outline"
            variant="white"
            onPress={() => navigation.goBack()}
            style={{ marginTop: spacing.lg, width: 220 }}
          />
        </View>
      </LinearGradient>
    );
  }

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
                name={i <= stepIndex ? 'checkmark-circle' : (step.icon as any)}
                size={16}
                color={i <= stepIndex ? colors.ivory : 'rgba(255,255,255,0.45)'}
              />
              <Text style={[styles.stepText, i > stepIndex && styles.stepTextPending]}>
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  ringWrap: { width: 90, height: 90, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  ring: { width: 90, height: 90, borderRadius: 45, position: 'absolute' },
  ringGradient: { flex: 1, borderRadius: 45 },
  ringInner: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: colors.roseDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: typography.heading,
    fontSize: 20,
    color: colors.ivory,
    textAlign: 'center',
    lineHeight: 27,
  },
  errorText: {
    fontFamily: typography.body,
    fontSize: 13.5,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  stepsWrap: { marginTop: spacing.xl, alignSelf: 'stretch' },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  stepText: {
    fontFamily: typography.bodyMedium,
    fontSize: 13.5,
    color: colors.ivory,
    marginLeft: 10,
  },
  stepTextPending: { color: 'rgba(255,255,255,0.55)' },
});
