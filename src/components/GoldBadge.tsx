import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, typography } from '../theme/colors';

export const GoldBadge = ({
  label,
  icon,
}: {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
}) => (
  <View style={styles.badge}>
    {icon && <Ionicons name={icon} size={12} color={colors.goldDeep} style={{ marginRight: 4 }} />}
    <Text style={styles.text}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(217,169,78,0.16)',
    borderColor: 'rgba(217,169,78,0.5)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  text: {
    fontFamily: typography.bodySemiBold,
    fontSize: 11,
    color: colors.goldDeep,
    letterSpacing: 0.4,
  },
});
