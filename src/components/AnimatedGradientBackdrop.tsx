import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { gradients } from '../theme/colors';

const { width, height } = Dimensions.get('window');

type BlobProps = {
  size: number;
  colors: readonly [string, string, ...string[]];
  top: number;
  left: number;
  driftX: number;
  driftY: number;
  duration: number;
};

const Blob = ({ size, colors, top, left, driftX, driftY, duration }: BlobProps) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [anim, duration]);

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [0, driftX] });
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, driftY] });
  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.14] });

  return (
    <Animated.View
      style={[
        styles.blobWrap,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          top,
          left,
          transform: [{ translateX }, { translateY }, { scale }],
        },
      ]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0.15, y: 0.1 }}
        end={{ x: 0.9, y: 0.9 }}
        style={[styles.blobFill, { borderRadius: size / 2 }]}
      />
    </Animated.View>
  );
};

export const AnimatedGradientBackdrop = ({ children }: { children?: React.ReactNode }) => {
  return (
    <View style={styles.container}>
      <View style={styles.backdrop} pointerEvents="none">
        <LinearGradient
          colors={gradients.heroSignature}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={styles.backdrop}
        />
        <View style={styles.backdrop}>
          <Blob
            size={width * 0.9}
            colors={gradients.blobGold}
            top={-height * 0.06}
            left={-width * 0.25}
            driftX={30}
            driftY={20}
            duration={9000}
          />
          <Blob
            size={width * 0.8}
            colors={gradients.blobViolet}
            top={height * 0.3}
            left={width * 0.55}
            driftX={-24}
            driftY={26}
            duration={11000}
          />
          <Blob
            size={width * 0.75}
            colors={gradients.blobPink}
            top={height * 0.66}
            left={-width * 0.2}
            driftX={20}
            driftY={-18}
            duration={10000}
          />
        </View>
        <BlurView intensity={45} tint="default" style={styles.backdrop} />
        <View style={[styles.backdrop, styles.scrim]} />
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  blobWrap: { position: 'absolute' },
  blobFill: { flex: 1 },
  scrim: { backgroundColor: 'rgba(30,10,30,0.15)' },
});
