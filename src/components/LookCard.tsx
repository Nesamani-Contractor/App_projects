import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { LookOption } from '../data/looks';
import { colors, radii, spacing, typography } from '../theme/colors';

export const LookCard = ({
  look,
  onPress,
  recommended,
}: {
  look: LookOption;
  onPress: () => void;
  recommended?: boolean;
}) => {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.wrap, pressed && { opacity: 0.9 }]}>
      <LinearGradient
        colors={look.gradient as any}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.card}
      >
        {recommended && (
          <View style={styles.recBadge}>
            <Ionicons name="star" size={10} color={colors.plum} />
            <Text style={styles.recText}>For You</Text>
          </View>
        )}
        <View style={styles.iconCircle}>
          <Ionicons name={look.icon} size={22} color={colors.ivory} />
        </View>
        <Text style={styles.title}>{look.title}</Text>
        <Text style={styles.tagline}>{look.tagline}</Text>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrap: { width: '48%', marginBottom: spacing.md },
  card: {
    borderRadius: radii.lg,
    padding: spacing.md,
    minHeight: 150,
    justifyContent: 'flex-end',
    shadowColor: colors.cardShadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: typography.heading,
    fontSize: 16,
    color: colors.ivory,
  },
  tagline: {
    fontFamily: typography.body,
    fontSize: 11.5,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  recBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.goldLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
  },
  recText: {
    fontFamily: typography.bodySemiBold,
    fontSize: 9.5,
    color: colors.plum,
    marginLeft: 3,
  },
});
