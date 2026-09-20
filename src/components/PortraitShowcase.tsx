import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { GeneratedPortrait, getPortraitVariantCount } from './GeneratedPortrait';
import { LOOKS, LookId } from '../data/looks';
import { colors } from '../theme/colors';

const PICKABLE_LOOKS = LOOKS.map((l) => l.id).filter((id) => id !== 'choose-for-me') as LookId[];

const shuffle = <T,>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const PortraitAvatar = ({
  lookId,
  variant,
  size,
  style,
}: {
  lookId: LookId;
  variant: number;
  size: number;
  style?: object;
}) => (
  <View
    style={[
      styles.avatar,
      { width: size, height: size, borderRadius: size / 2 },
      style,
    ]}
  >
    <GeneratedPortrait lookId={lookId} variant={variant} size={size} />
  </View>
);

export const PortraitShowcase = ({ count = 4, size = 68 }: { count?: number; size?: number }) => {
  const picks = useMemo(() => {
    const pool = shuffle(PICKABLE_LOOKS).slice(0, count);
    return pool.map((lookId) => ({
      lookId,
      variant: Math.floor(Math.random() * getPortraitVariantCount(lookId)),
    }));
  }, [count]);

  return (
    <View style={styles.row}>
      {picks.map((p, i) => (
        <PortraitAvatar
          key={`${p.lookId}-${i}`}
          lookId={p.lookId}
          variant={p.variant}
          size={size}
          style={i > 0 ? { marginLeft: -size * 0.28 } : undefined}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  avatar: {
    overflow: 'hidden',
    backgroundColor: colors.blush,
    borderWidth: 3,
    borderColor: colors.ivory,
  },
});
