import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LookId } from '../data/looks';
import { ScanRecord } from '../data/mockHistory';

type AppState = {
  ready: boolean;
  hasOnboarded: boolean;
  isPremium: boolean;
  styleAnswer?: LookId;
  scanHistory: ScanRecord[];
  completeOnboarding: (styleAnswer?: LookId) => void;
  unlockPremium: () => void;
  addScanRecord: (record: ScanRecord) => void;
};

const AppStateContext = createContext<AppState | undefined>(undefined);

const KEYS = {
  onboarded: 'shineme.hasOnboarded',
  premium: 'shineme.isPremium',
  styleAnswer: 'shineme.styleAnswer',
  scanHistory: 'shineme.scanHistory',
};

export const AppStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [styleAnswer, setStyleAnswer] = useState<LookId | undefined>(undefined);
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);

  useEffect(() => {
    (async () => {
      const minSplashDelay = new Promise((resolve) => setTimeout(resolve, 1500));
      try {
        const [[onboarded, premium, style, history]] = await Promise.all([
          Promise.all([
            AsyncStorage.getItem(KEYS.onboarded),
            AsyncStorage.getItem(KEYS.premium),
            AsyncStorage.getItem(KEYS.styleAnswer),
            AsyncStorage.getItem(KEYS.scanHistory),
          ]),
          minSplashDelay,
        ]);
        setHasOnboarded(onboarded === 'true');
        setIsPremium(premium === 'true');
        if (style) setStyleAnswer(style as LookId);
        if (history) {
          try {
            setScanHistory(JSON.parse(history));
          } catch {}
        }
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const completeOnboarding = (answer?: LookId) => {
    setHasOnboarded(true);
    AsyncStorage.setItem(KEYS.onboarded, 'true').catch(() => {});
    if (answer) {
      setStyleAnswer(answer);
      AsyncStorage.setItem(KEYS.styleAnswer, answer).catch(() => {});
    }
  };

  const unlockPremium = () => {
    setIsPremium(true);
    AsyncStorage.setItem(KEYS.premium, 'true').catch(() => {});
  };

  const addScanRecord = (record: ScanRecord) => {
    setScanHistory((prev) => {
      const next = [record, ...prev];
      AsyncStorage.setItem(KEYS.scanHistory, JSON.stringify(next)).catch(() => {});
      return next;
    });
  };

  const value = useMemo(
    () => ({
      ready,
      hasOnboarded,
      isPremium,
      styleAnswer,
      scanHistory,
      completeOnboarding,
      unlockPremium,
      addScanRecord,
    }),
    [ready, hasOnboarded, isPremium, styleAnswer, scanHistory]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export const useAppState = () => {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
};
