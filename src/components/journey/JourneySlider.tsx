import React, { useRef, useState } from 'react';
import { LayoutChangeEvent, PanResponder, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radii, spacing, typography } from '../../theme/colors';

type Props = {
  labels: string[];
  value: number;
  onChange: (index: number) => void;
};

const THUMB_SIZE = 24;

export const JourneySlider = ({ labels, value, onChange }: Props) => {
  const [trackWidth, setTrackWidth] = useState(0);
  const steps = labels.length - 1;

  const handleLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  };

  const setFromX = (x: number) => {
    if (trackWidth <= 0) return;
    const clamped = Math.max(0, Math.min(trackWidth, x));
    const index = Math.round((clamped / trackWidth) * steps);
    onChange(index);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => setFromX(evt.nativeEvent.locationX),
      onPanResponderMove: (evt) => setFromX(evt.nativeEvent.locationX),
    })
  ).current;

  const thumbLeft = trackWidth > 0 ? (value / steps) * trackWidth : 0;

  return (
    <View style={styles.wrap}>
      <Text style={styles.valueLabel}>{labels[value]} hrs</Text>
      <View style={styles.touchArea} onLayout={handleLayout} {...panResponder.panHandlers}>
        <View style={styles.trackBg} />
        <LinearGradient
          colors={gradients.goldButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.trackFill, { width: thumbLeft }]}
        />
        <View style={[styles.thumb, { left: Math.max(0, thumbLeft - THUMB_SIZE / 2) }]} />
      </View>
      <View style={styles.tickRow}>
        {labels.map((l, i) => (
          <Text key={l} style={[styles.tickLabel, i === value && styles.tickLabelActive]}>
            {l}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { paddingVertical: spacing.sm },
  valueLabel: {
    fontFamily: typography.display,
    fontSize: 22,
    color: colors.ivory,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  touchArea: { height: 36, justifyContent: 'center' },
  trackBg: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 6,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  trackFill: {
    position: 'absolute',
    left: 0,
    height: 6,
    borderRadius: radii.pill,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.ivory,
    borderWidth: 3,
    borderColor: colors.goldDeep,
  },
  tickRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  tickLabel: {
    fontFamily: typography.bodyMedium,
    fontSize: 10.5,
    color: 'rgba(255,255,255,0.65)',
  },
  tickLabelActive: { color: colors.ivory, fontFamily: typography.bodySemiBold },
});
