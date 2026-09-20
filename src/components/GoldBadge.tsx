import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, typography } from '../theme/colors';

export const GoldBadge = ({
  label,
  icon,
  tone = 'default',
}: {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  tone?: 'default' | 'onPink';
}) => {
  const onPink = tone === 'onPink';
  return (
    <View style={[styles.badge, onPink && styles.badgeOnPink]}>
      {icon && (
        <Ionicons
          name={icon}
          size={12}
          color={onPink ? colors.plum : colors.goldDeep}
          style={{ marginRight: 4 }}
        />
      )}
      <Text style={[styles.text, onPink && styles.textOnPink]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(229,72,122,0.14)',
    borderColor: 'rgba(229,72,122,0.4)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  badgeOnPink: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderColor: 'rgba(255,255,255,0.9)',
  },
  text: {
    fontFamily: typography.bodySemiBold,
    fontSize: 11,
    color: colors.goldDeep,
    letterSpacing: 0.4,
  },
  textOnPink: { color: colors.plum },
});
