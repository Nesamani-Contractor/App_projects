import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const ShineLogoMark = ({ size = 48, color = '#5A2340' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Path
      d="M50 6 C55 30 58 42 94 50 C58 58 55 70 50 94 C45 70 42 58 6 50 C42 42 45 30 50 6 Z"
      fill={color}
    />
  </Svg>
);
