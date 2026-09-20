import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '../theme/colors';

type Tip = { text: string; type: 'do' | 'dont' };

const TIPS: Tip[] = [
  { text: 'Look straight at the camera', type: 'do' },
  { text: "Find a clear wall behind you", type: 'do' },
  { text: "Don't use any filters", type: 'dont' },
  { text: "Don't wear hats or glasses", type: 'dont' },
  { text: "Don't cover your beautiful face", type: 'dont' },
];

export const DoDontCard = ({ onClose }: { onClose?: () => void }) => {
  return (
    <BlurView intensity={40} tint="light" style={styles.wrap}>
      <View style={styles.headerRow}>
        <Ionicons name="sparkles" size={16} color={colors.goldDeep} />
        <Text style={styles.title}>Do's & Don'ts for your scan</Text>
        {onClose && (
          <Ionicons
            name="close"
            size={18}
            color={colors.slate}
            onPress={onClose}
            style={styles.close}
            suppressHighlighting
          />
        )}
      </View>
      {TIPS.map((tip) => (
        <View style={styles.row} key={tip.text}>
          <Ionicons
            name={tip.type === 'do' ? 'checkmark-circle' : 'close-circle'}
            size={16}
            color={tip.type === 'do' ? colors.success : colors.roseDeep}
          />
          <Text style={styles.rowText}>{tip.text}</Text>
        </View>
      ))}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radii.lg,
    padding: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  title: {
    fontFamily: typography.bodySemiBold,
    fontSize: 13,
    color: colors.ivory,
    marginLeft: 6,
    flex: 1,
  },
  close: { padding: 2 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  rowText: {
    fontFamily: typography.body,
    fontSize: 12.5,
    color: colors.ivory,
    marginLeft: 8,
  },
});
