import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { GeneratedPortrait, getPortraitVariantCount } from './GeneratedPortrait';
import { LOOKS, LookId } from '../data/looks';

const { width, height } = Dimensions.get('window');
const POOL = LOOKS.map((l) => l.id).filter((id) => id !== 'choose-for-me') as LookId[];
const MAX_OPACITY = 0.22;

const randomPick = () => {
  const lookId = POOL[Math.floor(Math.random() * POOL.length)];
  const variant = Math.floor(Math.random() * getPortraitVariantCount(lookId));
  return { lookId, variant };
};

const FloatingSlot = ({
  top,
  left,
  size,
  delay,
}: {
  top: number;
  left: number;
  size: number;
  delay: number;
}) => {
  const [pick, setPick] = useState(randomPick);
  const floatY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: MAX_OPACITY,
      duration: 1000,
      delay,
      useNativeDriver: true,
    }).start();

    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, {
          toValue: -18,
          duration: 3400 + delay,
          useNativeDriver: true,
        }),
        Animated.timing(floatY, {
          toValue: 0,
          duration: 3400 + delay,
          useNativeDriver: true,
        }),
      ])
    );
    floatLoop.start();

    const swapInterval = setInterval(() => {
      Animated.timing(opacity, { toValue: 0, duration: 700, useNativeDriver: true }).start(() => {
        setPick(randomPick());
        Animated.timing(opacity, {
          toValue: MAX_OPACITY,
          duration: 700,
          useNativeDriver: true,
        }).start();
      });
    }, 5800 + delay);

    return () => {
      floatLoop.stop();
      clearInterval(swapInterval);
    };
  }, [delay, floatY, opacity]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top,
        left,
        opacity,
        transform: [{ translateY: floatY }],
      }}
    >
      <GeneratedPortrait lookId={pick.lookId} variant={pick.variant} size={size} />
    </Animated.View>
  );
};

export const AnimatedFacesBackdrop = () => {
  return (
    <View style={styles.fill} pointerEvents="none">
      <FloatingSlot top={-50} left={-70} size={220} delay={0} />
      <FloatingSlot top={height * 0.3} left={width - 160} size={200} delay={450} />
      <FloatingSlot top={height * 0.6} left={-80} size={230} delay={900} />
      <View style={styles.dim} />
    </View>
  );
};

const styles = StyleSheet.create({
  fill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  dim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(30,10,30,0.3)',
  },
});
