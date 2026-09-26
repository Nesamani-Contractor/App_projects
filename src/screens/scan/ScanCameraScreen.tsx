import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { ScanStackParamList } from '../../navigation/types';
import { CircularViewfinder } from '../../components/CircularViewfinder';
import { DoDontCard } from '../../components/DoDontCard';
import { RotatingText } from '../../components/RotatingText';
import { AnimatedFacesBackdrop } from '../../components/AnimatedFacesBackdrop';
import { SCAN_CHIP_PHRASES, SCAN_HINT_PHRASES, SCAN_FEATURE_PHRASES } from '../../data/scanTaglines';
import { colors, gradients, typography } from '../../theme/colors';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<ScanStackParamList, 'ScanCamera'>;

export default function ScanCameraScreen({ navigation }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'front' | 'back'>('front');
  const [guidelinesVisible, setGuidelinesVisible] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [libraryUri, setLibraryUri] = useState<string | undefined>(undefined);
  const cameraRef = useRef<CameraView>(null);

  const startScan = useCallback(async () => {
    if (scanning) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setScanning(true);

    let photoUri: string | undefined;
    try {
      const photo = await cameraRef.current?.takePictureAsync({ quality: 0.5 });
      photoUri = photo?.uri;
    } catch {
      photoUri = undefined;
    }

    setTimeout(() => {
      setScanning(false);
      navigation.navigate('Analyzing', { photoUri });
    }, 1400);
  }, [navigation, scanning]);

  const handleCapturePress = useCallback(() => {
    if (scanning) return;
    setLibraryUri(undefined);
    setGuidelinesVisible(true);
  }, [scanning]);

  const handlePickFromLibrary = useCallback(async () => {
    if (scanning) return;
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (result.canceled) return;
    const uri = result.assets?.[0]?.uri;
    if (!uri) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setLibraryUri(uri);
    setGuidelinesVisible(true);
  }, [scanning]);

  const handleCloseGuidelines = useCallback(() => {
    setGuidelinesVisible(false);
    setLibraryUri(undefined);
  }, []);

  const handleConfirmGuidelines = useCallback(() => {
    setGuidelinesVisible(false);
    if (libraryUri) {
      const uri = libraryUri;
      setLibraryUri(undefined);
      navigation.navigate('Analyzing', { photoUri: uri });
      return;
    }
    startScan();
  }, [libraryUri, navigation, startScan]);

  const cameraReady = permission?.granted;

  return (
    <View style={styles.fill}>
      {cameraReady ? (
        <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} />
      ) : (
        <LinearGradient
          colors={gradients.heroSignature}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}

      {!cameraReady && <AnimatedFacesBackdrop />}

      {!cameraReady && (
        <ScrollView
          style={styles.permissionOverlay}
          contentContainerStyle={styles.permissionContent}
          showsVerticalScrollIndicator={false}
        >
          <Ionicons name="camera-outline" size={36} color={colors.goldLight} />
          <Text style={styles.permissionTitle}>Camera access needed</Text>
          <Text style={styles.permissionBody}>
            Shine Me's AI Face Reader needs your camera to analyze your face and deliver your
            color analysis, facial analysis, and makeup recommendations.
          </Text>
          <Pressable style={styles.permissionBtn} onPress={requestPermission}>
            <Text style={styles.permissionBtnText}>Enable Camera</Text>
          </Pressable>
          <RotatingText phrases={SCAN_FEATURE_PHRASES} style={styles.featureTicker} interval={2800} />
          <View style={styles.inlineGuidelines}>
            <DoDontCard />
          </View>
        </ScrollView>
      )}

      {cameraReady && <CircularViewfinder scanning={scanning} />}

      <SafeAreaView style={styles.overlayContent} pointerEvents="box-none">
        <View style={styles.topBar}>
          <View>
            <Text style={styles.brand}>Shine Me</Text>
            <View style={styles.chipRow}>
              <Ionicons name="sparkles" size={11} color={colors.gold} />
              <RotatingText phrases={SCAN_CHIP_PHRASES} style={styles.chipText} interval={2400} />
            </View>
          </View>
          <Pressable
            style={styles.flipBtn}
            onPress={() => setFacing((f) => (f === 'front' ? 'back' : 'front'))}
          >
            <Ionicons name="camera-reverse-outline" size={20} color={colors.ivory} />
          </Pressable>
        </View>

        {cameraReady && (
          <View style={styles.centerHint} pointerEvents="none">
            {scanning ? (
              <Text style={styles.hintText}>Analyzing your beautiful face…</Text>
            ) : (
              <RotatingText phrases={SCAN_HINT_PHRASES} style={styles.hintText} interval={2600} />
            )}
          </View>
        )}

        <View style={styles.bottomArea}>
          <View style={styles.captureRow}>
            <View style={styles.captureSpacer} />
            <Pressable
              onPress={handleCapturePress}
              disabled={!cameraReady || scanning}
              style={({ pressed }) => [
                styles.captureOuter,
                pressed && { transform: [{ scale: 0.94 }] },
              ]}
            >
              <LinearGradient
                colors={gradients.goldButton}
                style={styles.captureInner}
              >
                <Ionicons name="sparkles" size={26} color={colors.ivory} />
              </LinearGradient>
            </Pressable>
            <View style={[styles.captureSpacer, styles.captureSideBtnWrap]}>
              <Pressable
                onPress={handlePickFromLibrary}
                disabled={scanning}
                style={({ pressed }) => [styles.libraryBtn, pressed && { opacity: 0.8 }]}
              >
                <Ionicons name="images-outline" size={20} color={colors.ivory} />
              </Pressable>
            </View>
          </View>
          <Text style={styles.captureLabel}>
            {scanning ? 'Hold still…' : 'Tap to scan your glow'}
          </Text>
        </View>
      </SafeAreaView>

      <Modal
        visible={guidelinesVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseGuidelines}
      >
        <View style={styles.modalBackdrop}>
          <DoDontCard
            onClose={handleCloseGuidelines}
            onConfirm={handleConfirmGuidelines}
            confirmLabel={libraryUri ? 'Got It, Use Photo' : 'Got It, Start Scan'}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: '#5C1B54' },
  overlayContent: { flex: 1, justifyContent: 'space-between' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  brand: {
    fontFamily: typography.display,
    fontSize: 20,
    color: colors.ivory,
  },
  flipBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerHint: {
    position: 'absolute',
    top: '42%',
    width,
    alignItems: 'center',
    marginTop: width * 0.36 + 12,
    paddingHorizontal: 32,
  },
  hintText: {
    fontFamily: typography.bodyMedium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  chipText: {
    fontFamily: typography.bodySemiBold,
    fontSize: 11,
    color: colors.gold,
    marginLeft: 4,
    letterSpacing: 0.3,
  },
  featureTicker: {
    fontFamily: typography.bodyMedium,
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 22,
    paddingHorizontal: 24,
    lineHeight: 18,
  },
  bottomArea: { paddingHorizontal: 20, paddingBottom: 100 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  captureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  captureSpacer: { flex: 1 },
  captureSideBtnWrap: { alignItems: 'center' },
  libraryBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureOuter: {
    width: 84,
    height: 84,
    borderRadius: 42,
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  captureInner: {
    flex: 1,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureLabel: {
    textAlign: 'center',
    marginTop: 10,
    fontFamily: typography.body,
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  permissionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  permissionContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 90,
    paddingBottom: 200,
  },
  inlineGuidelines: {
    width: '100%',
    marginTop: 28,
  },
  permissionTitle: {
    fontFamily: typography.heading,
    fontSize: 19,
    color: colors.ivory,
    marginTop: 14,
  },
  permissionBody: {
    fontFamily: typography.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 19,
  },
  permissionBtn: {
    marginTop: 20,
    backgroundColor: colors.gold,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
  },
  permissionBtnText: {
    fontFamily: typography.bodySemiBold,
    fontSize: 14,
    color: colors.plum,
  },
});
