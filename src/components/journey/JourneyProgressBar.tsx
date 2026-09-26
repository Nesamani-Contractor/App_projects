import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/colors';

type Props = {
  sectionLabel: string;
  current: number;
  total: number;
};

export const JourneyProgressBar = ({ sectionLabel, current, total }: Props) => {
  const progress = total > 0 ? Math.min(1, current / total) : 0;
  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <Text style={styles.sectionLabel}>{sectionLabel.toUpperCase()}</Text>
        <Text style={styles.countLabel}>
          {current} / {total}
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  sectionLabel: {
    fontFamily: typography.bodySemiBold,
    fontSize: 11,
    letterSpacing: 1.2,
    color: 'rgba(255,255,255,0.85)',
  },
  countLabel: {
    fontFamily: typography.bodyMedium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  track: {
    height: 6,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radii.pill,
    backgroundColor: colors.ivory,
  },
});
