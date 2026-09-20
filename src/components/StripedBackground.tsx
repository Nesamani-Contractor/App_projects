import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const STRIPES: readonly [string, string][] = [
  ['#FFF6F9', '#FBC9DA'],
  ['#FFEFF5', '#F7BAD1'],
  ['#FFF8FA', '#FDD3E1'],
  ['#FDEDF3', '#F6B9D2'],
  ['#FFF4F8', '#FCCCDD'],
  ['#FEEBF2', '#F5B3CE'],
  ['#FFF7F9', '#FCD1DF'],
  ['#FDECF3', '#F7BCD3'],
  ['#FFF5F8', '#FBCADB'],
  ['#FEEAF1', '#F4B1CC'],
];

export const StripedBackground = ({ children }: { children?: React.ReactNode }) => (
  <View style={styles.fill}>
    <View style={styles.stripesRow}>
      {STRIPES.map((pair, i) => (
        <LinearGradient
          key={i}
          colors={pair}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.stripe}
        />
      ))}
    </View>
    {children}
  </View>
);

const styles = StyleSheet.create({
  fill: { flex: 1 },
  stripesRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  stripe: { flex: 1 },
});
