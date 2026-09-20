import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleProp, TextStyle } from 'react-native';

export const RotatingText = ({
  phrases,
  interval = 2600,
  style,
}: {
  phrases: string[];
  interval?: number;
  style?: StyleProp<TextStyle>;
}) => {
  const [index, setIndex] = useState(0);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (phrases.length <= 1) return;
    const timer = setInterval(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 320,
        useNativeDriver: true,
      }).start(() => {
        setIndex((i) => (i + 1) % phrases.length);
        Animated.timing(opacity, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }).start();
      });
    }, interval);
    return () => clearInterval(timer);
  }, [phrases.length, interval, opacity]);

  return (
    <Animated.Text style={[style, { opacity }]} numberOfLines={2}>
      {phrases[index]}
    </Animated.Text>
  );
};
