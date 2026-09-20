import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Defs, Mask, Rect, Circle } from 'react-native-svg';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');
const SIZE = width * 0.72;

export const CircularViewfinder = ({ scanning }: { scanning: boolean }) => {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!scanning) {
      pulse.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scanning, pulse]);

  const translateY = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [-SIZE / 2, SIZE / 2],
  });

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%">
        <Defs>
          <Mask id="mask" x="0" y="0" width="100%" height="100%">
            <Rect x="0" y="0" width="100%" height="100%" fill="#fff" />
            <Circle cx="50%" cy="42%" r={SIZE / 2} fill="#000" />
          </Mask>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="rgba(58,36,48,0.55)" mask="url(#mask)" />
        <Circle
          cx="50%"
          cy="42%"
          r={SIZE / 2}
          stroke={colors.gold}
          strokeWidth={3}
          fill="none"
        />
        <Circle
          cx="50%"
          cy="42%"
          r={SIZE / 2 + 8}
          stroke="rgba(255,255,255,0.5)"
          strokeWidth={1}
          fill="none"
        />
      </Svg>

      {scanning && (
        <View
          style={[
            styles.scanLineClip,
            {
              width: SIZE - 16,
              height: SIZE - 16,
              top: '42%',
              marginTop: -(SIZE - 16) / 2,
              left: '50%',
              marginLeft: -(SIZE - 16) / 2,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.scanLine,
              { width: SIZE - 16, transform: [{ translateY }] },
            ]}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scanLineClip: {
    position: 'absolute',
    borderRadius: 999,
    overflow: 'hidden',
  },
  scanLine: {
    height: 2,
    backgroundColor: colors.gold,
    shadowColor: colors.gold,
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
});
