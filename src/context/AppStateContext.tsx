import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LookId } from '../data/looks';
import { ScanRecord } from '../data/mockHistory';
import { JourneyAnswers } from '../data/onboardingJourney';

type AppState = {
  ready: boolean;
  hasOnboarded: boolean;
  isPremium: boolean;
  styleAnswer?: LookId;
  scanHistory: ScanRecord[];
  journeyAnswers?: JourneyAnswers;
  completeOnboarding: (styleAnswer?: LookId) => void;
  unlockPremium: () => void;
  addScanRecord: (record: ScanRecord) => void;
  saveJourneyAnswers: (answers: JourneyAnswers) => void;
};

const AppStateContext = createContext<AppState | undefined>(undefined);

const KEYS = {
  onboarded: 'shineme.hasOnboarded',
  premium: 'shineme.isPremium',
  styleAnswer: 'shineme.styleAnswer',
  scanHistory: 'shineme.scanHistory',
  journeyAnswers: 'shineme.journeyAnswers',
};

export const AppStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [styleAnswer, setStyleAnswer] = useState<LookId | undefined>(undefined);
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
  const [journeyAnswers, setJourneyAnswers] = useState<JourneyAnswers | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const minSplashDelay = new Promise((resolve) => setTimeout(resolve, 1500));
      try {
        const [[onboarded, premium, style, history, journey]] = await Promise.all([
          Promise.all([
            AsyncStorage.getItem(KEYS.onboarded),
            AsyncStorage.getItem(KEYS.premium),
            AsyncStorage.getItem(KEYS.styleAnswer),
            AsyncStorage.getItem(KEYS.scanHistory),
            AsyncStorage.getItem(KEYS.journeyAnswers),
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
        if (journey) {
          try {
            setJourneyAnswers(JSON.parse(journey));
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

  const saveJourneyAnswers = (answers: JourneyAnswers) => {
    setJourneyAnswers(answers);
    AsyncStorage.setItem(KEYS.journeyAnswers, JSON.stringify(answers)).catch(() => {});
  };

  const value = useMemo(
    () => ({
      ready,
      hasOnboarded,
      isPremium,
      styleAnswer,
      scanHistory,
      journeyAnswers,
      completeOnboarding,
      unlockPremium,
      addScanRecord,
      saveJourneyAnswers,
    }),
    [ready, hasOnboarded, isPremium, styleAnswer, scanHistory, journeyAnswers]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export const useAppState = () => {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
};
