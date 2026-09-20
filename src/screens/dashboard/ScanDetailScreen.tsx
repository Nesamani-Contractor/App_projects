import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DashboardStackParamList } from '../../navigation/types';
import { MOCK_HISTORY } from '../../data/mockHistory';
import { COLOR_SEASONS } from '../../data/colorSeasons';
import { getLookById } from '../../data/looks';
import { FACIAL_TRAITS, SHINE_GUIDE_STEPS } from '../../data/insights';
import { GeneratedPortrait, getPortraitVariantCount } from '../../components/GeneratedPortrait';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionCard } from '../../components/SectionCard';
import { GoldBadge } from '../../components/GoldBadge';
import { colors, gradients, radii, spacing, typography } from '../../theme/colors';
import { formatDateTime } from '../../utils/formatDate';
import { useAppState } from '../../context/AppStateContext';

type Props = NativeStackScreenProps<DashboardStackParamList, 'ScanDetail'>;

export default function ScanDetailScreen({ route, navigation }: Props) {
  const { scanHistory } = useAppState();
  const record = [...scanHistory, ...MOCK_HISTORY].find((r) => r.id === route.params.recordId);
  if (!record) return null;

  const season = COLOR_SEASONS.find((s) => s.id === record.seasonId)!;
  const look = getLookById(record.lookId)!;
  const portraitVariant = record.id.length % getPortraitVariantCount(look.id);

  return (
    <View style={styles.fill}>
      <LinearGradient colors={gradients.vaultHeader} style={styles.header}>
        <SafeAreaView edges={['top']}>
          <ScreenHeader
            onBack={() => navigation.goBack()}
            eyebrow="ARCHIVED SCAN"
            title={formatDateTime(record.timestamp)}
            subtitle={undefined}
          />
          <Text style={styles.praise}>"{record.praise}"</Text>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.lookPreview}>
          <LinearGradient colors={look.gradient as any} style={styles.lookHero}>
            {record.photoUri ? (
              <Image source={{ uri: record.photoUri }} style={styles.lookPhoto} />
            ) : (
              <GeneratedPortrait lookId={look.id} variant={portraitVariant} size={150} />
            )}
          </LinearGradient>
          <View style={styles.lookMeta}>
            <GoldBadge icon="sparkles-outline" label={`${record.score} Shine Score`} />
            <Text style={styles.lookTitle}>{look.title}</Text>
            <Text style={styles.lookTagline}>{look.tagline}</Text>
          </View>
        </View>

        <SectionCard icon="color-palette-outline" title="Color Analysis" subtitle={season.name}>
          <Text style={styles.bodyText}>{season.description}</Text>
          <View style={styles.paletteRow}>
            {season.palette.map((c) => (
              <View key={c} style={[styles.swatch, { backgroundColor: c }]} />
            ))}
          </View>
        </SectionCard>

        <SectionCard icon="book-outline" title="Shine Me Guide" subtitle="Your steps from this scan">
          {SHINE_GUIDE_STEPS.slice(0, 3).map((step) => (
            <View key={step.id} style={styles.guideRow}>
              <Ionicons name="checkmark-circle-outline" size={15} color={colors.goldDeep} />
              <Text style={styles.guideText}>{step.title}</Text>
            </View>
          ))}
        </SectionCard>

        <SectionCard icon="scan-outline" title="Facial Analysis" subtitle="Recorded at this scan">
          {FACIAL_TRAITS.slice(0, 3).map((trait) => (
            <View key={trait.id} style={styles.traitRow}>
              <Text style={styles.traitLabel}>{trait.label}</Text>
              <Text style={styles.traitValue}>{trait.value}</Text>
            </View>
          ))}
        </SectionCard>
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
  praise: {
    fontFamily: typography.displayItalic,
    fontSize: 16,
    color: colors.ivory,
    marginTop: spacing.md,
    lineHeight: 22,
  },
  scroll: { padding: spacing.lg, paddingBottom: spacing.tabBarClearance },
  lookPreview: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  lookHero: {
    width: 100,
    height: 100,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: spacing.md,
  },
  lookPhoto: { width: '100%', height: '100%' },
  lookMeta: { flex: 1 },
  lookTitle: { fontFamily: typography.display, fontSize: 19, color: colors.plum, marginTop: 6 },
  lookTagline: { fontFamily: typography.body, fontSize: 12.5, color: colors.slate, marginTop: 2 },
  bodyText: { fontFamily: typography.body, fontSize: 13, color: colors.slate, lineHeight: 19 },
  paletteRow: { flexDirection: 'row', marginTop: spacing.md },
  swatch: { width: 28, height: 28, borderRadius: 14, marginRight: 8, borderWidth: 2, borderColor: colors.white },
  guideRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  guideText: { fontFamily: typography.bodyMedium, fontSize: 13, color: colors.plum, marginLeft: 8 },
  traitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(229,72,122,0.15)',
  },
  traitLabel: { fontFamily: typography.body, fontSize: 12.5, color: colors.slate },
  traitValue: { fontFamily: typography.bodySemiBold, fontSize: 12.5, color: colors.berry },
});
