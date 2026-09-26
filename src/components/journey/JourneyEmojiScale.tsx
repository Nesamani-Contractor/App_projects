import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { JourneyOption } from '../../data/onboardingJourney';
import { colors, radii, spacing, typography } from '../../theme/colors';

type Props = {
  options: JourneyOption[];
  selected?: string;
  onSelect: (id: string) => void;
};

export const JourneyEmojiScale = ({ options, selected, onSelect }: Props) => (
  <View style={styles.row}>
    {options.map((opt) => (
      <Pressable
        key={opt.id}
        onPress={() => onSelect(opt.id)}
        style={[styles.item, selected === opt.id && styles.itemActive]}
      >
        <Text style={styles.emoji}>{opt.emoji}</Text>
        <Text style={[styles.label, selected === opt.id && styles.labelActive]}>{opt.label}</Text>
      </Pressable>
    ))}
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginHorizontal: 3,
    borderRadius: radii.md,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  itemActive: {
    backgroundColor: colors.ivory,
    borderColor: colors.ivory,
  },
  emoji: { fontSize: 26 },
  label: {
    fontFamily: typography.bodyMedium,
    fontSize: 9.5,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  labelActive: { color: colors.plum, fontFamily: typography.bodySemiBold },
});
