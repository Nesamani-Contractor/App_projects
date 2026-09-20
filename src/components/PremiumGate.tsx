import React, { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '../theme/colors';

type Props = PropsWithChildren<{
  locked: boolean;
  onUnlock: () => void;
}>;

export const PremiumGate = ({ locked, onUnlock, children }: Props) => {
  if (!locked) return <>{children}</>;

  return (
    <View style={styles.wrap}>
      <View pointerEvents="none">{children}</View>
      <BlurView intensity={18} tint="light" style={styles.overlay}>
        <View style={styles.card}>
          <Ionicons name="lock-closed" size={16} color={colors.goldDeep} />
          <Text style={styles.text}>Unlock with Premium</Text>
        </View>
        <Pressable onPress={onUnlock} style={styles.pressable} />
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { position: 'relative' },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    shadowColor: colors.cardShadow,
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  text: {
    fontFamily: typography.bodySemiBold,
    fontSize: 12.5,
    color: colors.goldDeep,
    marginLeft: 6,
  },
  pressable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
