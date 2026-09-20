import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { ScanStackParamList } from '../../navigation/types';
import { CircularViewfinder } from '../../components/CircularViewfinder';
import { DoDontCard } from '../../components/DoDontCard';
import { colors, gradients, typography } from '../../theme/colors';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<ScanStackParamList, 'ScanCamera'>;

export default function ScanCameraScreen({ navigation }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'front' | 'back'>('front');
  const [guidelinesVisible, setGuidelinesVisible] = useState(false);
  const [scanning, setScanning] = useState(false);
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
    setGuidelinesVisible(true);
  }, [scanning]);

  const handleConfirmGuidelines = useCallback(() => {
    setGuidelinesVisible(false);
    startScan();
  }, [startScan]);

  const cameraReady = permission?.granted;

  return (
    <View style={styles.fill}>
      {cameraReady ? (
        <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} />
      ) : (
        <LinearGradient
          colors={['#2E1B29', '#4A2740', '#2E1B29']}
          style={StyleSheet.absoluteFill}
        />
      )}

      {!cameraReady && (
        <View style={styles.permissionOverlay}>
          <Ionicons name="camera-outline" size={40} color={colors.goldLight} />
          <Text style={styles.permissionTitle}>Camera access needed</Text>
          <Text style={styles.permissionBody}>
            Shine Me needs your camera to analyze your beautiful face and find your colors.
          </Text>
          <Pressable style={styles.permissionBtn} onPress={requestPermission}>
            <Text style={styles.permissionBtnText}>Enable Camera</Text>
          </Pressable>
        </View>
      )}

      <CircularViewfinder scanning={scanning} />

      <SafeAreaView style={styles.overlayContent} pointerEvents="box-none">
        <View style={styles.topBar}>
          <Text style={styles.brand}>Shine Me</Text>
          <Pressable
            style={styles.flipBtn}
            onPress={() => setFacing((f) => (f === 'front' ? 'back' : 'front'))}
          >
            <Ionicons name="camera-reverse-outline" size={20} color={colors.ivory} />
          </Pressable>
        </View>

        <View style={styles.centerHint} pointerEvents="none">
          <Text style={styles.hintText}>
            {scanning ? 'Analyzing your beautiful face…' : 'Center your face in the frame'}
          </Text>
        </View>

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
            <View style={styles.captureSpacer} />
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
        onRequestClose={() => setGuidelinesVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <DoDontCard
            onClose={() => setGuidelinesVisible(false)}
            onConfirm={handleConfirmGuidelines}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: '#1E1420' },
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
  },
  hintText: {
    fontFamily: typography.bodyMedium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
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
