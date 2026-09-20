import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ScanRecord } from '../data/mockHistory';
import { getLookById } from '../data/looks';
import { COLOR_SEASONS } from '../data/colorSeasons';
import { colors, gradients, radii, spacing, typography } from '../theme/colors';
import { formatDateTime, formatRelative } from '../utils/formatDate';

export const VaultCard = ({
  record,
  onPress,
}: {
  record: ScanRecord;
  onPress: () => void;
}) => {
  const look = getLookById(record.lookId);
  const season = COLOR_SEASONS.find((s) => s.id === record.seasonId);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.wrap, pressed && { opacity: 0.92 }]}>
      {record.photoUri ? (
        <Image source={{ uri: record.photoUri }} style={styles.thumb} />
      ) : (
        <LinearGradient
          colors={(look?.gradient ?? gradients.heroBackground) as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.thumb}
        >
          <Ionicons name={look?.icon ?? 'sparkles-outline'} size={20} color={colors.ivory} />
        </LinearGradient>
      )}

      <View style={styles.middle}>
        <Text style={styles.title}>{season?.name ?? 'Color Season'}</Text>
        <Text style={styles.subtitle}>{look?.title ?? 'Look'} · {formatRelative(record.timestamp)}</Text>
        <Text style={styles.timestamp}>{formatDateTime(record.timestamp)}</Text>
      </View>

      <View style={styles.scoreWrap}>
        <Text style={styles.score}>{record.score}</Text>
        <Text style={styles.scoreLabel}>Shine</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.slate} style={{ marginLeft: 4 }} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    shadowColor: colors.cardShadow,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(229,72,122,0.14)',
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  middle: { flex: 1 },
  title: { fontFamily: typography.heading, fontSize: 15, color: colors.plum },
  subtitle: { fontFamily: typography.bodyMedium, fontSize: 12, color: colors.berry, marginTop: 1 },
  timestamp: { fontFamily: typography.body, fontSize: 10.5, color: colors.slate, marginTop: 2 },
  scoreWrap: { alignItems: 'center', marginLeft: spacing.xs },
  score: { fontFamily: typography.display, fontSize: 18, color: colors.goldDeep },
  scoreLabel: {
    fontFamily: typography.body,
    fontSize: 9,
    color: colors.slate,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
