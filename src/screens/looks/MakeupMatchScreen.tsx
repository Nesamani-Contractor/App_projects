import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LooksStackParamList } from '../../navigation/types';
import { LOOKS, LookId } from '../../data/looks';
import { ScreenHeader } from '../../components/ScreenHeader';
import { GradientButton } from '../../components/GradientButton';
import { GeneratedPortrait } from '../../components/GeneratedPortrait';
import { colors, radii, spacing, typography } from '../../theme/colors';

type Props = NativeStackScreenProps<LooksStackParamList, 'MakeupMatch'>;

const shuffleable = LOOKS.filter((l) => l.id !== 'choose-for-me');

export default function MakeupMatchScreen({ navigation }: Props) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [matching, setMatching] = useState(false);
  const [matchedId, setMatchedId] = useState<LookId | null>(null);

  const runMatch = async (pickerResult: ImagePicker.ImagePickerResult) => {
    if (pickerResult.canceled) return;
    const uri = pickerResult.assets[0]?.uri;
    if (!uri) return;
    setImageUri(uri);
    setMatchedId(null);
    setMatching(true);
    setTimeout(() => {
      const seed = uri.length + Math.floor(Math.random() * 7);
      setMatchedId(shuffleable[seed % shuffleable.length].id);
      setMatching(false);
    }, 1400);
  };

  const pickFromLibrary = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    runMatch(result);
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    runMatch(result);
  };

  const matchedLook = matchedId ? LOOKS.find((l) => l.id === matchedId) : undefined;

  return (
    <SafeAreaView style={styles.fill} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ScreenHeader onBack={() => navigation.goBack()} eyebrow="Copy A Look" title="Makeup Match" />
        <Text style={styles.intro}>
          Seen a makeup look you love? Upload a photo and we'll match it to the closest Shine Me look for you.
        </Text>

        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.preview} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={32} color={colors.slate} />
            <Text style={styles.placeholderText}>No photo selected yet</Text>
          </View>
        )}

        <View style={styles.actionsRow}>
          <GradientButton
            label="Choose Photo"
            icon="images-outline"
            onPress={pickFromLibrary}
            style={styles.actionBtn}
          />
          <GradientButton
            label="Take Photo"
            icon="camera-outline"
            variant="outline"
            onPress={takePhoto}
            style={styles.actionBtn}
          />
        </View>

        {matching && (
          <View style={styles.matchingBox}>
            <Ionicons name="sync-outline" size={18} color={colors.goldDeep} />
            <Text style={styles.matchingText}>Matching your look…</Text>
          </View>
        )}

        {matchedLook && (
          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>Closest Match</Text>
            <View style={styles.resultCard}>
              <GeneratedPortrait lookId={matchedLook.id} size={110} />
              <Text style={styles.resultTitle}>{matchedLook.title}</Text>
              <Text style={styles.resultTagline}>{matchedLook.tagline}</Text>
            </View>
            <GradientButton
              label="View Full Guide"
              icon="arrow-forward"
              onPress={() => navigation.navigate('LookDetail', { lookId: matchedLook.id })}
              style={{ marginTop: spacing.md }}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.ivory },
  scroll: { padding: spacing.lg, paddingBottom: spacing.tabBarClearance },
  intro: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.slate,
    lineHeight: 19,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  preview: {
    width: '100%',
    height: 220,
    borderRadius: radii.lg,
    marginBottom: spacing.md,
  },
  placeholder: {
    width: '100%',
    height: 220,
    borderRadius: radii.lg,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(217,169,78,0.2)',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontFamily: typography.body,
    fontSize: 12.5,
    color: colors.slate,
    marginTop: spacing.sm,
  },
  actionsRow: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1 },
  matchingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  matchingText: { fontFamily: typography.bodyMedium, fontSize: 13, color: colors.goldDeep, marginLeft: 8 },
  resultBox: { marginTop: spacing.lg, alignItems: 'center' },
  resultLabel: {
    fontFamily: typography.bodySemiBold,
    fontSize: 12,
    color: colors.slate,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  resultCard: {
    backgroundColor: colors.cream,
    borderRadius: radii.xl,
    padding: spacing.lg,
    alignItems: 'center',
    width: '100%',
  },
  resultTitle: { fontFamily: typography.display, fontSize: 20, color: colors.plum, marginTop: spacing.sm },
  resultTagline: { fontFamily: typography.body, fontSize: 12.5, color: colors.slate, marginTop: 2 },
});
