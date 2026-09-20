import React, { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '../theme/colors';

export const ScreenBackground = ({ children }: PropsWithChildren) => {
  return (
    <View style={styles.fill}>
      <LinearGradient
        colors={gradients.heroBackground}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.blob, styles.blobTop]} />
      <View style={[styles.blob, styles.blobBottom]} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
  blob: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  blobTop: {
    width: 260,
    height: 260,
    top: -100,
    right: -80,
  },
  blobBottom: {
    width: 320,
    height: 320,
    bottom: -140,
    left: -100,
    backgroundColor: 'rgba(229,72,122,0.14)',
  },
});
