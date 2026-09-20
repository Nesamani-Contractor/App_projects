import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StripedBackground } from '../components/StripedBackground';
import { ShineLogoMark } from '../components/ShineLogoMark';
import { colors, typography } from '../theme/colors';

export default function SplashHomeScreen() {
  return (
    <StripedBackground>
      <View style={styles.center}>
        <View style={styles.lockup}>
          <ShineLogoMark size={44} color={colors.plum} />
          <Text style={styles.wordmark}>Shine Me</Text>
        </View>
      </View>
    </StripedBackground>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  lockup: { flexDirection: 'row', alignItems: 'center' },
  wordmark: {
    fontFamily: typography.display,
    fontSize: 34,
    color: colors.plum,
    marginLeft: 14,
  },
});
