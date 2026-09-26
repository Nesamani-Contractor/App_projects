import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { radii } from '../theme/colors';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
};

export const GlassCard = ({ children, style, intensity = 35 }: Props) => (
  <View style={[styles.wrap, style]}>
    <BlurView intensity={intensity} tint="light" style={styles.fill} />
    <View style={[styles.fill, styles.tint]} pointerEvents="none" />
    <View style={[styles.fill, styles.border]} pointerEvents="none" />
    <View style={styles.content}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.12)',
    shadowColor: '#5C1B54',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 6,
  },
  fill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  tint: { backgroundColor: 'rgba(255,255,255,0.08)' },
  border: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  content: { padding: 18 },
});
