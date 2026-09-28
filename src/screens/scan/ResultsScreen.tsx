import React, { useEffect } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScanStackParamList } from '../../navigation/types';
import { colors, gradients, radii, spacing, typography } from '../../theme/colors';
import { recommendLookForSeason } from '../../data/looks';
import { buildScanRecordFromReal } from '../../data/mockHistory';
import { GeneratedPortrait } from '../../components/GeneratedPortrait';
import { SectionCard } from '../../components/SectionCard';
import { GoldBadge } from '../../components/GoldBadge';
import { GradientButton } from '../../components/GradientButton';
import { formatDateTime } from '../../utils/formatDate';
import { useAppState } from '../../context/AppStateContext';
import { useGuideStream } from '../../hooks/useGuideStream';

type Props = NativeStackScreenProps<ScanStackParamList, 'Results'>;

const REAL_SEASON_TO_LOCAL_ID: Record<string, string> = {
  Spring: 'warm-spring',
  Summer: 'cool-summer',
  Autumn: 'deep-autumn',
  Winter: 'clear-winter',
};

const humanize = (value: string) => value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const LEVEL_LABEL: Record<string, string> = { mild: 'A little', moderate: 'Some', noticeable: 'More visible' };

export default function ResultsScreen({ route, navigation }: Props) {
  const { scanId, scan, timestamp, photoUri } = route.params;
  const { addScanRecord } = useAppState();
  const { sections, starterPlan, streaming, error: guideError } = useGuideStream(scanId);

  useEffect(() => {
    addScanRecord(buildScanRecordFromReal(scanId, timestamp, scan, photoUri));
    // Save this scan into the Shine Vault exactly once, when results first land.
  }, []);

  const lookId = recommendLookForSeason(REAL_SEASON_TO_LOCAL_ID[scan.color.season] ?? 'warm-spring');
  const goChooseLook = () => {
    (navigation.getParent() as any)?.navigate('LooksTab', {
      screen: 'ChooseLook',
      params: { recommendedLookId: lookId },
    });
  };

  const lowConfidence = scan.color.confidence === 'low' || scan.face_shape.confidence === 'low';

  return (
    <View style={styles.fill}>
      <LinearGradient colors={gradients.vaultHeader} style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerTop}>
            <View style={styles.selfieRing}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.selfieImage} />
              ) : (
                <GeneratedPortrait lookId={lookId} size={44} />
              )}
            </View>
            <View style={styles.headerBadges}>
              <GoldBadge icon="time-outline" label={formatDateTime(timestamp)} tone="onPink" />
              <View style={styles.scoreChip}>
                <Ionicons name="sparkles" size={12} color={colors.plum} />
                <Text style={styles.scoreChipText}>{scan.color.season} {scan.color.sub_season}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.headerEyebrow}>SCAN COMPLETE</Text>
          <Text style={styles.praise}>Your real AI scan is ready, gorgeous ✨</Text>
          {lowConfidence && (
            <View style={styles.lowConfidenceNote}>
              <Ionicons name="information-circle-outline" size={14} color={colors.ivory} />
              <Text style={styles.lowConfidenceText}>
                Lighting made a couple of readings less certain — retake in daylight for a sharper result.
              </Text>
            </View>
          )}
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
          <Text style={styles.seasonName}>{scan.color.season} — {scan.color.sub_season}</Text>
          <Text style={styles.seasonSubtitle}>
            {scan.color.undertone} undertone · {scan.color.depth} depth · {scan.color.contrast} contrast
          </Text>
          <Text style={styles.rowLabel}>Best colors</Text>
          <View style={styles.paletteRow}>
            {scan.color.best_colors_hex.map((c) => (
              <View key={c} style={[styles.swatch, { backgroundColor: c }]} />
            ))}
          </View>
          {scan.color.avoid_colors_hex.length > 0 && (
            <>
              <Text style={styles.rowLabel}>Colors to avoid</Text>
              <View style={styles.paletteRow}>
                {scan.color.avoid_colors_hex.map((c) => (
                  <View key={c} style={[styles.swatch, styles.swatchSmall, { backgroundColor: c }]} />
                ))}
              </View>
            </>
          )}
          <View style={styles.metalRow}>
            <Ionicons name="diamond-outline" size={14} color={colors.goldDeep} />
            <Text style={styles.metalText}>Best metal tone: {humanize(scan.color.best_metals)}</Text>
          </View>
        </SectionCard>

        <SectionCard
          icon="scan-outline"
          title="Facial Analysis"
          subtitle="Your features, measured by AI"
        >
          <Text style={styles.seasonName}>{scan.face_shape.value} face shape</Text>
          {([
            ['Eye shape', scan.features.eye_shape],
            ['Brow shape', scan.features.brow_shape],
            ['Lip shape', scan.features.lip_shape],
            ['Nose', scan.features.nose],
            ['Cheekbones', scan.features.cheekbones],
            ['Jawline', scan.features.jawline],
          ] as const).map(([label, value]) => (
            <View key={label} style={styles.traitRow}>
              <Text style={styles.traitLabel}>{label}</Text>
              <View style={styles.traitValueChip}>
                <Text style={styles.traitValueText}>{humanize(value)}</Text>
              </View>
            </View>
          ))}
        </SectionCard>

        <SectionCard
          icon="water-outline"
          title="Skin"
          subtitle="Cosmetic observations, framed positively"
        >
          <Text style={styles.seasonSubtitle}>Apparent type: {humanize(scan.skin.apparent_type)}</Text>
          {scan.skin.strengths.length > 0 && (
            <View style={styles.strengthsRow}>
              {scan.skin.strengths.map((s) => (
                <View key={s} style={styles.strengthChip}>
                  <Ionicons name="checkmark" size={11} color={colors.success} />
                  <Text style={styles.strengthText}>{humanize(s)}</Text>
                </View>
              ))}
            </View>
          )}
          {scan.skin.observations.map((obs, i) => (
            <View key={i} style={styles.traitRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.traitLabel}>{humanize(obs.area)}</Text>
                <Text style={styles.traitNote}>{LEVEL_LABEL[obs.level]} {humanize(obs.concern).toLowerCase()}</Text>
              </View>
            </View>
          ))}
          <Text style={styles.disclaimer}>
            These are cosmetic estimates from a photo, not a medical diagnosis. For persistent concerns, a dermatologist can help.
          </Text>
        </SectionCard>

        <View style={styles.guideHeaderRow}>
          <Ionicons name="sparkles" size={16} color={colors.goldDeep} />
          <Text style={styles.guideHeaderText}>Mago's Glow-Up Guide</Text>
        </View>

        {sections.map((section) => (
          <SectionCard key={section.heading} icon="book-outline" title={section.heading}>
            <Text style={styles.guideBody}>{section.body.trim()}</Text>
          </SectionCard>
        ))}

        {starterPlan.length > 0 && (
          <SectionCard icon="calendar-outline" title="Your 7-Day Starter Plan">
            {starterPlan.map((day) => (
              <View key={day.day} style={styles.guideRow}>
                <View style={styles.guideNumber}>
                  <Text style={styles.guideNumberText}>{day.day}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.guideTitle}>{day.title}</Text>
                  <Text style={styles.guideDetail}>{day.action} · {day.minutes} min</Text>
                </View>
              </View>
            ))}
          </SectionCard>
        )}

        {streaming && (
          <View style={styles.matchingBox}>
            <Ionicons name="sync-outline" size={18} color={colors.goldDeep} />
            <Text style={styles.matchingText}>Mago is writing your personalized guide…</Text>
          </View>
        )}
        {guideError && <Text style={styles.disclaimer}>{guideError}</Text>}

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
  selfieRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selfieImage: { width: '100%', height: '100%' },
  headerBadges: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  scoreChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
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
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 2,
    marginTop: spacing.lg,
  },
  praise: {
    fontFamily: typography.displayItalic,
    fontSize: 19,
    color: colors.ivory,
    marginTop: spacing.sm,
    lineHeight: 26,
  },
  lowConfidenceNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: radii.md,
    padding: spacing.sm,
  },
  lowConfidenceText: {
    fontFamily: typography.body,
    fontSize: 11.5,
    color: colors.ivory,
    marginLeft: 6,
    flex: 1,
    lineHeight: 16,
  },
  scrollContent: { padding: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.tabBarClearance },
  seasonName: { fontFamily: typography.display, fontSize: 20, color: colors.plum },
  seasonSubtitle: { fontFamily: typography.bodyMedium, fontSize: 12.5, color: colors.roseDeep, marginTop: 2 },
  bodyText: { fontFamily: typography.body, fontSize: 13, color: colors.slate, marginTop: spacing.sm, lineHeight: 19 },
  rowLabel: { fontFamily: typography.bodySemiBold, fontSize: 11.5, color: colors.slate, marginTop: spacing.md, textTransform: 'uppercase', letterSpacing: 0.5 },
  paletteRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.sm },
  swatch: { width: 32, height: 32, borderRadius: 16, marginRight: 8, marginBottom: 8, borderWidth: 2, borderColor: colors.white },
  swatchSmall: { width: 24, height: 24, borderRadius: 12 },
  metalRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  metalText: { fontFamily: typography.bodyMedium, fontSize: 12.5, color: colors.plum, marginLeft: 6 },
  strengthsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.sm },
  strengthChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.blush,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.pill,
    marginRight: 6,
    marginBottom: 6,
  },
  strengthText: { fontFamily: typography.bodyMedium, fontSize: 11, color: colors.berry, marginLeft: 3 },
  guideHeaderRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, marginBottom: spacing.sm },
  guideHeaderText: { fontFamily: typography.heading, fontSize: 16, color: colors.plum, marginLeft: 6 },
  guideBody: { fontFamily: typography.body, fontSize: 13, color: colors.slate, lineHeight: 20 },
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
    borderTopColor: 'rgba(229,72,122,0.15)',
  },
  traitLabel: { fontFamily: typography.bodySemiBold, fontSize: 13, color: colors.plum, flex: 1 },
  traitNote: { fontFamily: typography.body, fontSize: 11.5, color: colors.slate, marginTop: 1 },
  traitValueChip: {
    backgroundColor: colors.blush,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  traitValueText: { fontFamily: typography.bodySemiBold, fontSize: 11.5, color: colors.berry },
  disclaimer: { fontFamily: typography.body, fontSize: 11, color: colors.slate, marginTop: spacing.md, fontStyle: 'italic', lineHeight: 16 },
  matchingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  matchingText: { fontFamily: typography.bodyMedium, fontSize: 13, color: colors.goldDeep, marginLeft: 8 },
});
