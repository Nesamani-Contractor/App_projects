import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LooksStackParamList } from '../../navigation/types';
import { getLookById, LOOKS, LookId } from '../../data/looks';
import { GeneratedPortrait } from '../../components/GeneratedPortrait';
import { ScreenHeader } from '../../components/ScreenHeader';
import { GradientButton } from '../../components/GradientButton';
import { colors, gradients, radii, spacing, typography } from '../../theme/colors';

type Props = NativeStackScreenProps<LooksStackParamList, 'LookDetail'>;

const shuffleableLooks = LOOKS.filter((l) => l.id !== 'choose-for-me');

export default function LookDetailScreen({ route, navigation }: Props) {
  const { lookId } = route.params;
  const isChooseForMe = lookId === 'choose-for-me';

  const [picking, setPicking] = useState(isChooseForMe);
  const [pickedId, setPickedId] = useState<LookId | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!isChooseForMe) return;
    setPicking(true);
    setPickedId(null);
    const t = setTimeout(() => {
      const choice = shuffleableLooks[Math.floor(Math.random() * shuffleableLooks.length)];
      setPickedId(choice.id);
      setPicking(false);
    }, 1600);
    return () => clearTimeout(t);
  }, [isChooseForMe, lookId]);

  const activeLook = useMemo(() => {
    if (isChooseForMe) return pickedId ? getLookById(pickedId) : undefined;
    return getLookById(lookId);
  }, [isChooseForMe, pickedId, lookId]);

  const handleGetLook = () => {
    setConfirmed(true);
    setTimeout(() => {
      (navigation.getParent() as any)?.navigate('DashboardTab');
    }, 1100);
  };

  if (isChooseForMe && picking) {
    return (
      <LinearGradient colors={gradients.vaultHeader} style={styles.fill}>
        <SafeAreaView style={styles.pickingCenter}>
          <View style={styles.pickingRing}>
            <Ionicons name="shuffle-outline" size={30} color={colors.ivory} />
          </View>
          <Text style={styles.pickingTitle}>Choosing your shine…</Text>
          <Text style={styles.pickingSubtitle}>
            Matching your features and coloring to the perfect look
          </Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (!activeLook) return null;

  return (
    <SafeAreaView style={styles.fill} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ScreenHeader onBack={() => navigation.goBack()} title="Your Look" eyebrow="Preview" />

        <LinearGradient colors={activeLook.gradient as any} style={styles.hero}>
          {isChooseForMe && (
            <View style={styles.aiPickBadge}>
              <Ionicons name="sparkles" size={11} color={colors.plum} />
              <Text style={styles.aiPickBadgeText}>Chosen for you</Text>
            </View>
          )}
          <GeneratedPortrait lookId={activeLook.id} size={190} />
          <Text style={styles.heroTitle}>{activeLook.title}</Text>
          <Text style={styles.heroTagline}>{activeLook.tagline}</Text>
        </LinearGradient>

        <View style={styles.vibeRow}>
          {activeLook.vibeWords.map((w) => (
            <View style={styles.vibeChip} key={w}>
              <Text style={styles.vibeChipText}>{w}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.description}>{activeLook.description}</Text>

        {confirmed ? (
          <View style={styles.confirmedBox}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Text style={styles.confirmedText}>Saved to your Shine Me vault!</Text>
          </View>
        ) : (
          <>
            <GradientButton label="Get This Look" icon="heart-outline" onPress={handleGetLook} />
            {isChooseForMe ? (
              <GradientButton
                label="Pick A Different One"
                variant="outline"
                icon="refresh-outline"
                onPress={() => {
                  setPicking(true);
                  setPickedId(null);
                  setTimeout(() => {
                    const choice =
                      shuffleableLooks[Math.floor(Math.random() * shuffleableLooks.length)];
                    setPickedId(choice.id);
                    setPicking(false);
                  }, 1200);
                }}
                style={{ marginTop: spacing.sm }}
              />
            ) : (
              <GradientButton
                label="Browse Other Looks"
                variant="outline"
                icon="grid-outline"
                onPress={() => navigation.navigate('ChooseLook', {})}
                style={{ marginTop: spacing.sm }}
              />
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.ivory },
  scroll: { padding: spacing.lg, paddingBottom: spacing.tabBarClearance },
  hero: {
    borderRadius: radii.xl,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginTop: spacing.lg,
  },
  aiPickBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.goldLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  aiPickBadgeText: {
    fontFamily: typography.bodySemiBold,
    fontSize: 10.5,
    color: colors.plum,
    marginLeft: 4,
  },
  heroTitle: { fontFamily: typography.display, fontSize: 24, color: colors.ivory, marginTop: spacing.sm },
  heroTagline: { fontFamily: typography.body, fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 2 },
  vibeRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.md, flexWrap: 'wrap' },
  vibeChip: {
    backgroundColor: colors.blush,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
    marginHorizontal: 4,
    marginTop: 4,
  },
  vibeChipText: { fontFamily: typography.bodySemiBold, fontSize: 11.5, color: colors.berry },
  description: {
    fontFamily: typography.body,
    fontSize: 13.5,
    color: colors.slate,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  confirmedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(127,184,138,0.15)',
    paddingVertical: 14,
    borderRadius: radii.pill,
  },
  confirmedText: {
    fontFamily: typography.bodySemiBold,
    fontSize: 13.5,
    color: colors.success,
    marginLeft: 8,
  },
  pickingCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  pickingRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  pickingTitle: { fontFamily: typography.heading, fontSize: 18, color: colors.ivory },
  pickingSubtitle: {
    fontFamily: typography.body,
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    marginTop: 6,
  },
});
