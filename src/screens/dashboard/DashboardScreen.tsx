import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DashboardStackParamList } from '../../navigation/types';
import { getHistoryStats, MOCK_HISTORY } from '../../data/mockHistory';
import { VaultCard } from '../../components/VaultCard';
import { colors, gradients, radii, spacing, typography } from '../../theme/colors';
import { useAppState } from '../../context/AppStateContext';

type Props = NativeStackScreenProps<DashboardStackParamList, 'Dashboard'>;

export default function DashboardScreen({ navigation }: Props) {
  const { totalScans, avgScore, favoriteLook } = getHistoryStats();
  const { isPremium } = useAppState();
  const sorted = [...MOCK_HISTORY].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <View style={styles.fill}>
      <LinearGradient colors={gradients.vaultHeader} style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.eyebrow}>YOUR SHINE VAULT</Text>
              <Text style={styles.title}>Beauty History</Text>
            </View>
            <View style={styles.avatarBadge}>
              <Ionicons name="sparkles" size={20} color={colors.ivory} />
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalScans}</Text>
              <Text style={styles.statLabel}>Total Scans</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{avgScore}</Text>
              <Text style={styles.statLabel}>Avg Shine</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, styles.statValueSmall]} numberOfLines={1}>
                {favoriteLook?.title ?? '—'}
              </Text>
              <Text style={styles.statLabel}>Fave Look</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={styles.fill}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!isPremium && (
          <Pressable
            onPress={() => (navigation.getParent() as any)?.getParent()?.navigate('Paywall', { source: 'dashboard' })}
          >
            <LinearGradient colors={gradients.glamUpPaywall} style={styles.premiumBanner}>
              <Ionicons name="diamond" size={20} color={colors.ivory} />
              <View style={{ flex: 1, marginLeft: spacing.sm }}>
                <Text style={styles.premiumBannerTitle}>Go Premium</Text>
                <Text style={styles.premiumBannerSubtitle}>Unlock unlimited scans & every feature</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.ivory} />
            </LinearGradient>
          </Pressable>
        )}

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Scan Timeline</Text>
          <View style={styles.sectionBadge}>
            <Ionicons name="lock-closed-outline" size={11} color={colors.goldDeep} />
            <Text style={styles.sectionBadgeText}>Private Vault</Text>
          </View>
        </View>

        {sorted.map((record) => (
          <VaultCard
            key={record.id}
            record={record}
            onPress={() => navigation.navigate('ScanDetail', { recordId: record.id })}
          />
        ))}

        <View style={styles.aiNote}>
          <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.goldDeep} />
          <Text style={styles.aiNoteText}>
            Your Shine Me AI assistant remembers every scan so your recommendations get more
            personal over time.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.ivory },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  eyebrow: {
    fontFamily: typography.bodySemiBold,
    fontSize: 11,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.85)',
  },
  title: { fontFamily: typography.display, fontSize: 26, color: colors.ivory, marginTop: 2 },
  avatarBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: { flexDirection: 'row', marginTop: spacing.lg, gap: 10 },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  statValue: { fontFamily: typography.display, fontSize: 20, color: colors.ivory },
  statValueSmall: { fontSize: 14 },
  statLabel: {
    fontFamily: typography.body,
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.tabBarClearance },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  premiumBannerTitle: { fontFamily: typography.heading, fontSize: 14.5, color: colors.ivory },
  premiumBannerSubtitle: { fontFamily: typography.body, fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 1 },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: { fontFamily: typography.heading, fontSize: 17, color: colors.plum },
  sectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(229,72,122,0.14)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.pill,
  },
  sectionBadgeText: {
    fontFamily: typography.bodySemiBold,
    fontSize: 10,
    color: colors.goldDeep,
    marginLeft: 3,
  },
  aiNote: {
    flexDirection: 'row',
    backgroundColor: colors.cream,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    alignItems: 'flex-start',
  },
  aiNoteText: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.slate,
    marginLeft: 8,
    flex: 1,
    lineHeight: 17,
  },
});
