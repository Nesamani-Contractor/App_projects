import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { QuizOption } from '../data/onboardingQuiz';
import { colors, radii, spacing, typography } from '../theme/colors';

export const QuizOptionCard = ({
  option,
  selected,
  onPress,
}: {
  option: QuizOption;
  selected: boolean;
  onPress: () => void;
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, selected && styles.cardSelected]}
    >
      <View style={[styles.iconWrap, selected && styles.iconWrapSelected]}>
        <Ionicons name={option.icon} size={20} color={selected ? colors.ivory : colors.violetDeep} />
      </View>
      <Text style={[styles.label, selected && styles.labelSelected]}>{option.label}</Text>
      {selected && <Ionicons name="checkmark-circle" size={20} color={colors.ivory} />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  cardSelected: {
    backgroundColor: colors.violetDeep,
    borderColor: colors.lavender,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(142,95,199,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  iconWrapSelected: { backgroundColor: 'rgba(255,255,255,0.2)' },
  label: {
    flex: 1,
    fontFamily: typography.bodySemiBold,
    fontSize: 14.5,
    color: colors.violetDeep,
  },
  labelSelected: { color: colors.ivory },
});
