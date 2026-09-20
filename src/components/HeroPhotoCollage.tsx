import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { radii } from '../theme/colors';

const PHOTOS = [
  require('../../assets/home/hero-2.jpg'),
  require('../../assets/home/hero-1.jpg'),
  require('../../assets/home/hero-3.jpg'),
];

export const HeroPhotoCollage = ({ height = 220 }: { height?: number }) => {
  const cardWidth = height * 0.62;

  return (
    <View style={[styles.wrap, { height }]}>
      <Image
        source={PHOTOS[0]}
        style={[
          styles.card,
          styles.side,
          { width: cardWidth, height, transform: [{ rotate: '-9deg' }, { translateX: -cardWidth * 0.52 }] },
        ]}
      />
      <Image
        source={PHOTOS[2]}
        style={[
          styles.card,
          styles.side,
          { width: cardWidth, height, transform: [{ rotate: '9deg' }, { translateX: cardWidth * 0.52 }] },
        ]}
      />
      <Image
        source={PHOTOS[1]}
        style={[styles.card, styles.center, { width: cardWidth * 1.08, height: height * 1.06 }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  card: {
    position: 'absolute',
    borderRadius: radii.lg,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  side: { opacity: 0.92 },
  center: { zIndex: 2 },
});
