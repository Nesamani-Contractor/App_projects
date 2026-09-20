import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '../theme/colors';
import { GradientButton } from './GradientButton';

type Tip = { text: string; type: 'do' | 'dont' };

const TIPS: Tip[] = [
  { text: 'Look straight at the camera', type: 'do' },
  { text: 'Find a clear wall behind you', type: 'do' },
  { text: "Don't use any filters", type: 'dont' },
  { text: "Don't wear hats or glasses", type: 'dont' },
  { text: "Don't cover your beautiful face", type: 'dont' },
];

export const DoDontCard = ({
  onClose,
  onConfirm,
  confirmLabel = 'Got It, Start Scan',
}: {
  onClose?: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
}) => {
  return (
    <BlurView intensity={50} tint="dark" style={styles.wrap}>
      <View style={styles.tint} />
      <View style={styles.headerRow}>
        <Ionicons name="sparkles" size={18} color={colors.roseDeep} />
        <Text style={styles.title}>Do's & Don'ts for your scan</Text>
        {onClose && (
          <Ionicons
            name="close"
            size={20}
            color="rgba(255,255,255,0.7)"
            onPress={onClose}
            style={styles.close}
            suppressHighlighting
          />
        )}
      </View>
      {TIPS.map((tip) => (
        <View style={styles.row} key={tip.text}>
          <View style={[styles.iconCircle, { backgroundColor: tip.type === 'do' ? colors.success : colors.roseDeep }]}>
            <Ionicons name={tip.type === 'do' ? 'checkmark' : 'close'} size={14} color={colors.ivory} />
          </View>
          <Text style={styles.rowText}>{tip.text}</Text>
        </View>
      ))}
      {onConfirm && (
        <GradientButton
          label={confirmLabel}
          icon="camera"
          onPress={onConfirm}
          style={{ marginTop: spacing.lg }}
        />
      )}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radii.xl,
    padding: spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  tint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  title: {
    fontFamily: typography.bodySemiBold,
    fontSize: 17,
    color: colors.ivory,
    marginLeft: 8,
    flex: 1,
  },
  close: { padding: 2 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm + 2 },
  iconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    fontFamily: typography.bodyMedium,
    fontSize: 15,
    color: colors.ivory,
    marginLeft: 12,
    flex: 1,
  },
});
