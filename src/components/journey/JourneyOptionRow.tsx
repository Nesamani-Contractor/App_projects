import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { JourneyOption } from '../../data/onboardingJourney';
import { colors, gradients, radii, spacing, typography } from '../../theme/colors';

type Props = {
  option: JourneyOption;
  selected: boolean;
  onPress: () => void;
};

export const JourneyOptionRow = ({ option, selected, onPress }: Props) => {
  const content = (
    <>
      {option.emoji && <Text style={styles.emoji}>{option.emoji}</Text>}
      <Text style={[styles.label, selected && styles.labelSelected]}>{option.label}</Text>
      {selected && <Ionicons name="checkmark-circle" size={20} color={colors.ivory} />}
    </>
  );

  if (selected) {
    return (
      <Pressable onPress={onPress} style={styles.pressable}>
        <LinearGradient colors={gradients.goldButton} style={[styles.row, styles.rowSelected]}>
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={[styles.row, styles.pressable]}>
      {content}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: { marginBottom: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: radii.md,
    paddingVertical: 13,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  rowSelected: { borderColor: 'transparent' },
  emoji: { fontSize: 18, marginRight: 10 },
  label: {
    flex: 1,
    fontFamily: typography.bodyMedium,
    fontSize: 13.5,
    color: colors.ivory,
  },
  labelSelected: { fontFamily: typography.bodySemiBold },
});
