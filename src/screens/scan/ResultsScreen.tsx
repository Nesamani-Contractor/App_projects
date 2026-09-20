import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScanStackParamList } from '../../navigation/types';
import { colors, gradients, radii, spacing, typography } from '../../theme/colors';
import { COLOR_SEASONS, pickSeasonForSeed } from '../../data/colorSeasons';
import { recommendLookForSeason } from '../../data/looks';
import { FACIAL_TRAITS, pickPraise, SHINE_GUIDE_STEPS } from '../../data/insights';
import { pickStyleIcon } from '../../data/styleIcons';
import { getProductRecs } from '../../data/products';
import { SectionCard } from '../../components/SectionCard';
import { GoldBadge } from '../../components/GoldBadge';
import { GradientButton } from '../../components/GradientButton';
import { PremiumGate } from '../../components/PremiumGate';
import { formatDateTime } from '../../utils/formatDate';
import { useAppState } from '../../context/AppStateContext';

type Props = NativeStackScreenProps<ScanStackParamList, 'Results'>;

export default function ResultsScreen({ route, navigation }: Props) {
  const { seasonId, praiseIndex, timestamp, score } = route.params;
  const { isPremium } = useAppState();
  const season = useMemo(
    () => COLOR_SEASONS.find((s) => s.id === seasonId) ?? pickSeasonForSeed(0),
    [seasonId]
  );
  const praise = pickPraise(praiseIndex);
  const styleIcon = pickStyleIcon(praiseIndex);
  const products = getProductRecs(season.id);

  const goChooseLook = () => {
    (navigation.getParent() as any)?.navigate('LooksTab', {
      screen: 'ChooseLook',
      params: { recommendedLookId: recommendLookForSeason(season.id) },
    });
  };

  const goPaywall = () => {
    (navigation.getParent() as any)?.getParent()?.navigate('Paywall', { source: 'results' });
  };

  return (
    <View style={styles.fill}>
      <LinearGradient colors={gradients.vaultHeader} style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerTop}>
            <GoldBadge icon="time-outline" label={formatDateTime(timestamp)} />
            <View style={styles.scoreChip}>
              <Ionicons name="sparkles" size={12} color={colors.plum} />
              <Text style={styles.scoreChipText}>{score} Shine Score</Text>
            </View>
          </View>
          <Text style={styles.headerEyebrow}>SCAN COMPLETE</Text>
          <Text style={styles.praise}>"{praise}"</Text>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={styles.fill}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SectionCard
          icon="color-palette-outline"
          title="Color Analysis"
          subtitle="Find your color season & perfect colors"
        >
          <Text style={styles.seasonName}>{season.name}</Text>
          <Text style={styles.seasonSubtitle}>{season.subtitle}</Text>
          <Text style={styles.bodyText}>{season.description}</Text>
          <View style={styles.paletteRow}>
            {season.palette.map((c) => (
              <View key={c} style={[styles.swatch, { backgroundColor: c }]} />
            ))}
          </View>
          <View style={styles.metalRow}>
            <Ionicons name="diamond-outline" size={14} color={colors.goldDeep} />
            <Text style={styles.metalText}>Best metal tone: {season.metalTone}</Text>
          </View>
        </SectionCard>

        <SectionCard
          icon="book-outline"
          title="Shine Me Guide"
          subtitle='See yourself "shining" — your personal guide'
        >
          {SHINE_GUIDE_STEPS.map((step) => (
            <View key={step.id} style={styles.guideRow}>
              <View style={styles.guideNumber}>
                <Text style={styles.guideNumberText}>{step.id}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.guideTitle}>{step.title}</Text>
                <Text style={styles.guideDetail}>{step.detail}</Text>
              </View>
            </View>
          ))}
        </SectionCard>

        <SectionCard
          icon="scan-outline"
          title="Facial Analysis"
          subtitle="Your features & personalized recommendations"
        >
          {FACIAL_TRAITS.map((trait) => (
            <View key={trait.id} style={styles.traitRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.traitLabel}>{trait.label}</Text>
                <Text style={styles.traitNote}>{trait.note}</Text>
              </View>
              <View style={styles.traitValueChip}>
                <Text style={styles.traitValueText}>{trait.value}</Text>
              </View>
            </View>
          ))}
        </SectionCard>

        <PremiumGate locked={!isPremium} onUnlock={goPaywall}>
          <SectionCard
            icon="people-outline"
            title="Style Icon Match"
            subtitle="Who your features & coloring resemble"
          >
            <Text style={styles.styleIconName}>{styleIcon.name}</Text>
            <Text style={styles.seasonSubtitle}>{styleIcon.era}</Text>
            <Text style={styles.bodyText}>{styleIcon.description}</Text>
          </SectionCard>
        </PremiumGate>

        <PremiumGate locked={!isPremium} onUnlock={goPaywall}>
          <SectionCard
            icon="pricetag-outline"
            title="Product Recommendations"
            subtitle="Shades picked for your color season"
          >
            {products.map((p) => (
              <View key={p.id} style={styles.productRow}>
                <Ionicons name={p.icon} size={16} color={colors.goldDeep} />
                <View style={{ flex: 1, marginLeft: spacing.sm }}>
                  <Text style={styles.guideTitle}>{p.category} · {p.shadeName}</Text>
                  <Text style={styles.guideDetail}>{p.note}</Text>
                </View>
              </View>
            ))}
          </SectionCard>
        </PremiumGate>

        <GradientButton
          label="Choose My Shining Look"
          icon="color-wand-outline"
          onPress={goChooseLook}
          style={{ marginTop: spacing.sm }}
        />
        <GradientButton
          label="Scan Again"
          icon="camera-outline"
          variant="outline"
          onPress={() => navigation.popToTop()}
          style={{ marginTop: spacing.sm, marginBottom: spacing.xl }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.ivory },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  scoreChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.goldLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  scoreChipText: {
    fontFamily: typography.bodySemiBold,
    fontSize: 11,
    color: colors.plum,
    marginLeft: 4,
  },
  headerEyebrow: {
    fontFamily: typography.bodySemiBold,
    fontSize: 12,
    color: colors.goldLight,
    letterSpacing: 2,
    marginTop: spacing.lg,
  },
  praise: {
    fontFamily: typography.displayItalic,
    fontSize: 21,
    color: colors.ivory,
    marginTop: spacing.sm,
    lineHeight: 28,
  },
  scrollContent: { padding: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.tabBarClearance },
  seasonName: { fontFamily: typography.display, fontSize: 20, color: colors.plum },
  seasonSubtitle: { fontFamily: typography.bodyMedium, fontSize: 12.5, color: colors.roseDeep, marginTop: 2 },
  bodyText: { fontFamily: typography.body, fontSize: 13, color: colors.slate, marginTop: spacing.sm, lineHeight: 19 },
  paletteRow: { flexDirection: 'row', marginTop: spacing.md },
  swatch: { width: 32, height: 32, borderRadius: 16, marginRight: 8, borderWidth: 2, borderColor: colors.white },
  metalRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  metalText: { fontFamily: typography.bodyMedium, fontSize: 12.5, color: colors.plum, marginLeft: 6 },
  guideRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: spacing.sm },
  guideNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },
  guideNumberText: { fontFamily: typography.bodySemiBold, fontSize: 11, color: colors.goldDeep },
  guideTitle: { fontFamily: typography.bodySemiBold, fontSize: 13.5, color: colors.plum },
  guideDetail: { fontFamily: typography.body, fontSize: 12, color: colors.slate, marginTop: 1, lineHeight: 17 },
  traitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(217,169,78,0.15)',
  },
  traitLabel: { fontFamily: typography.bodySemiBold, fontSize: 13, color: colors.plum },
  traitNote: { fontFamily: typography.body, fontSize: 11.5, color: colors.slate, marginTop: 1 },
  traitValueChip: {
    backgroundColor: colors.blush,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  traitValueText: { fontFamily: typography.bodySemiBold, fontSize: 11.5, color: colors.berry },
  styleIconName: { fontFamily: typography.display, fontSize: 18, color: colors.plum },
  productRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(217,169,78,0.15)',
  },
});
