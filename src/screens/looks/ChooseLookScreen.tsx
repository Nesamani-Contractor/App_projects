import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LooksStackParamList } from '../../navigation/types';
import { LOOKS, LookId } from '../../data/looks';
import { ScreenHeader } from '../../components/ScreenHeader';
import { LookCard } from '../../components/LookCard';
import { colors, gradients, radii, spacing, typography } from '../../theme/colors';
import { useAppState } from '../../context/AppStateContext';

type Props = NativeStackScreenProps<LooksStackParamList, 'ChooseLook'>;

const PREMIUM_LOCKED_LOOKS: LookId[] = ['full-glam', 'latina-bestie'];

export default function ChooseLookScreen({ navigation, route }: Props) {
  const recommendedLookId = route.params?.recommendedLookId;
  const mainLooks = LOOKS.filter((l) => l.id !== 'choose-for-me');
  const chooseForMe = LOOKS.find((l) => l.id === 'choose-for-me')!;
  const { isPremium } = useAppState();

  const openLook = (id: LookId) => {
    if (!isPremium && PREMIUM_LOCKED_LOOKS.includes(id)) {
      (navigation.getParent() as any)?.getParent()?.navigate('Paywall', { source: 'looks' });
      return;
    }
    navigation.navigate('LookDetail', { lookId: id });
  };

  return (
    <SafeAreaView style={styles.fill} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          eyebrow="Step 2 of 2"
          title="Shining Today"
          subtitle="Choose the desired look you want to shine in"
        />

        <Pressable onPress={() => navigation.navigate('MakeupMatch')} style={styles.matchBanner}>
          <View style={styles.matchIcon}>
            <Ionicons name="image-outline" size={20} color={colors.violetDeep} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.matchTitle}>Makeup Match</Text>
            <Text style={styles.matchSubtitle}>Copy a makeup look you've seen from any photo</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.violetDeep} />
        </Pressable>

        <View style={styles.grid}>
          {mainLooks.map((look) => (
            <LookCard
              key={look.id}
              look={look}
              recommended={look.id === recommendedLookId}
              locked={!isPremium && PREMIUM_LOCKED_LOOKS.includes(look.id)}
              onPress={() => openLook(look.id)}
            />
          ))}
        </View>

        <Pressable onPress={() => navigation.navigate('LookDetail', { lookId: chooseForMe.id })}>
          <LinearGradient
            colors={gradients.chooseForMe as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.chooseForMe}
          >
            <View style={styles.chooseForMeIcon}>
              <Ionicons name="shuffle-outline" size={20} color={colors.ivory} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.chooseForMeTitle}>Choose For Me</Text>
              <Text style={styles.chooseForMeSubtitle}>{chooseForMe.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.ivory} />
          </LinearGradient>
        </Pressable>

        <Text style={styles.footnote}>
          Still deciding? You can always switch your look after reviewing — pick based on the picture or the makeup you want to go with.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.ivory },
  scroll: { padding: spacing.lg, paddingBottom: spacing.tabBarClearance },
  matchBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.blush,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(229,72,122,0.25)',
  },
  matchIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(229,72,122,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  matchTitle: { fontFamily: typography.heading, fontSize: 14.5, color: colors.violetDeep },
  matchSubtitle: { fontFamily: typography.body, fontSize: 11.5, color: colors.slate, marginTop: 1 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  chooseForMe: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.lg,
    padding: spacing.md,
    marginTop: spacing.xs,
  },
  chooseForMeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  chooseForMeTitle: { fontFamily: typography.heading, fontSize: 15, color: colors.ivory },
  chooseForMeSubtitle: {
    fontFamily: typography.body,
    fontSize: 11.5,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  footnote: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.slate,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 18,
    paddingHorizontal: spacing.md,
  },
});
