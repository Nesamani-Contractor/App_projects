import React from 'react';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from 'react-native-svg';

type Props = {
  text: string;
  width: number;
  height: number;
  fontSize: number;
  colors: readonly string[];
  fontFamily: string;
};

export const GradientText = ({ text, width, height, fontSize, colors, fontFamily }: Props) => (
  <Svg width={width} height={height}>
    <Defs>
      <SvgLinearGradient id="shineTitleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        {colors.map((c, i) => (
          <Stop key={i} offset={`${(i / (colors.length - 1)) * 100}%`} stopColor={c} />
        ))}
      </SvgLinearGradient>
    </Defs>
    <SvgText
      x="50%"
      y="72%"
      textAnchor="middle"
      fontSize={fontSize}
      fontFamily={fontFamily}
      fill="url(#shineTitleGrad)"
    >
      {text}
    </SvgText>
  </Svg>
);
