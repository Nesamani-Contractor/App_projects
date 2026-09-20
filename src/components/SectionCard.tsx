import React, { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '../theme/colors';

type Props = PropsWithChildren<{
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}>;

export const SectionCard = ({ icon, title, subtitle, children }: Props) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Ionicons name={icon} size={18} color={colors.goldDeep} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.body}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.cardShadow,
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(217,169,78,0.18)',
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  title: {
    fontFamily: typography.heading,
    fontSize: 17,
    color: colors.plum,
  },
  subtitle: {
    fontFamily: typography.body,
    fontSize: 12.5,
    color: colors.slate,
    marginTop: 1,
  },
  body: { marginTop: 4 },
});
