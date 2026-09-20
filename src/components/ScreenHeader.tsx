import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme/colors';

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
};

export const ScreenHeader = ({ eyebrow, title, subtitle, onBack, right }: Props) => {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        {onBack && (
          <Pressable onPress={onBack} style={styles.backBtn} hitSlop={10}>
            <Ionicons name="chevron-back" size={20} color={colors.plum} />
          </Pressable>
        )}
        <View>
          {eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      {right}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: { flexDirection: 'row', alignItems: 'center', flexShrink: 1 },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eyebrow: {
    fontFamily: typography.bodySemiBold,
    fontSize: 12,
    letterSpacing: 1.5,
    color: colors.goldDeep,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  title: {
    fontFamily: typography.display,
    fontSize: 26,
    color: colors.plum,
  },
  subtitle: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.slate,
    marginTop: 2,
  },
});
