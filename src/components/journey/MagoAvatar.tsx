import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ShineLogoMark } from '../ShineLogoMark';
import { colors, gradients } from '../../theme/colors';

export const MagoAvatar = ({ size = 64 }: { size?: number }) => (
  <View style={[styles.wrap, { width: size, height: size, borderRadius: size / 2 }]}>
    <LinearGradient colors={gradients.goldButton} style={[styles.fill, { borderRadius: size / 2 }]}>
      <ShineLogoMark size={size * 0.5} color={colors.ivory} />
    </LinearGradient>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    shadowColor: colors.goldDeep,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  fill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
