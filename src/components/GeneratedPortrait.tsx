import React from 'react';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { LookId } from '../data/looks';

type PortraitConfig = {
  skin: string;
  skinShadow: string;
  hairFrom: string;
  hairTo: string;
  lip: string;
  eyeliner: string;
  blush: string;
  accent: string;
  eyeshadow?: string;
  hairStyle: 'long' | 'sleek' | 'wavy' | 'curly' | 'bun' | 'undone';
  accessory: 'flower' | 'glow' | 'stud' | 'hoops' | 'tiara' | 'confetti' | 'sparkleRing';
};

const CONFIGS: Record<LookId, PortraitConfig[]> = {
  'soft-girl': [
    {
      skin: '#FBD9C4',
      skinShadow: '#F0C0A6',
      hairFrom: '#F6D8C8',
      hairTo: '#D9A57E',
      lip: '#F0A3B8',
      eyeliner: '#7A5A52',
      blush: '#F7A8C4',
      accent: '#F7A8C4',
      hairStyle: 'wavy',
      accessory: 'flower',
    },
    {
      skin: '#E8B48F',
      skinShadow: '#D69B72',
      hairFrom: '#6B4226',
      hairTo: '#3D2314',
      lip: '#E88FA6',
      eyeliner: '#4A2F1C',
      blush: '#F0A3B8',
      accent: '#F7A8C4',
      hairStyle: 'wavy',
      accessory: 'flower',
    },
  ],
  'natural-glam': [
    {
      skin: '#F0BE95',
      skinShadow: '#DFA278',
      hairFrom: '#8C5A32',
      hairTo: '#4A2F1C',
      lip: '#C9744F',
      eyeliner: '#4A2F1C',
      blush: '#E8956B',
      accent: '#D9A94E',
      hairStyle: 'sleek',
      accessory: 'glow',
    },
    {
      skin: '#D9A574',
      skinShadow: '#C08A5C',
      hairFrom: '#2B1810',
      hairTo: '#150C08',
      lip: '#C97050',
      eyeliner: '#150C08',
      blush: '#D97F5A',
      accent: '#D9A94E',
      hairStyle: 'sleek',
      accessory: 'glow',
    },
  ],
  'soft-grunge': [
    {
      skin: '#EAC7B4',
      skinShadow: '#D6AE99',
      hairFrom: '#5A4A63',
      hairTo: '#2E2038',
      lip: '#6E2340',
      eyeliner: '#1E1B2E',
      blush: '#B4718C',
      accent: '#6E4C7A',
      hairStyle: 'undone',
      accessory: 'stud',
    },
    {
      skin: '#C68A63',
      skinShadow: '#AD7350',
      hairFrom: '#3A3A3A',
      hairTo: '#1A1A1A',
      lip: '#7A2E4C',
      eyeliner: '#1A1A1A',
      blush: '#B4718C',
      accent: '#6E4C7A',
      hairStyle: 'undone',
      accessory: 'stud',
    },
  ],
  'latina-bestie': [
    {
      skin: '#C9895B',
      skinShadow: '#B06E42',
      hairFrom: '#3A2115',
      hairTo: '#1A0F0A',
      lip: '#B8324B',
      eyeliner: '#2A1710',
      blush: '#E8703F',
      accent: '#D9A94E',
      hairStyle: 'curly',
      accessory: 'hoops',
    },
    {
      skin: '#A8653A',
      skinShadow: '#8F5230',
      hairFrom: '#1A0F0A',
      hairTo: '#0A0605',
      lip: '#C43A5C',
      eyeliner: '#0A0605',
      blush: '#E0602F',
      accent: '#D9A94E',
      hairStyle: 'curly',
      accessory: 'hoops',
    },
  ],
  'full-glam': [
    {
      skin: '#F2CBA6',
      skinShadow: '#E0AE85',
      hairFrom: '#241522',
      hairTo: '#120A14',
      lip: '#8C1F3B',
      eyeliner: '#120A14',
      blush: '#C24A72',
      accent: '#D9A94E',
      hairStyle: 'long',
      accessory: 'tiara',
    },
    {
      skin: '#8C5A3A',
      skinShadow: '#734730',
      hairFrom: '#120A14',
      hairTo: '#0A0508',
      lip: '#9C1F45',
      eyeliner: '#0A0508',
      blush: '#B8365E',
      accent: '#D9A94E',
      hairStyle: 'long',
      accessory: 'tiara',
    },
  ],
  'sweet-spicy': [
    {
      skin: '#F5CDA8',
      skinShadow: '#E4B18A',
      hairFrom: '#C9724A',
      hairTo: '#7A3B2E',
      lip: '#E8557A',
      eyeliner: '#5A2340',
      blush: '#FF8FA3',
      accent: '#FFCB77',
      hairStyle: 'bun',
      accessory: 'confetti',
    },
    {
      skin: '#F0D4B8',
      skinShadow: '#DFBB98',
      hairFrom: '#1A1512',
      hairTo: '#0D0A08',
      lip: '#E8478A',
      eyeliner: '#3A2A3E',
      blush: '#FF8FC2',
      accent: '#7FC4E8',
      eyeshadow: '#8FD3EC',
      hairStyle: 'bun',
      accessory: 'confetti',
    },
  ],
  'choose-for-me': [
    {
      skin: '#F2CBA6',
      skinShadow: '#E0AE85',
      hairFrom: '#7A3B5A',
      hairTo: '#3A2340',
      lip: '#D9748F',
      eyeliner: '#5A2340',
      blush: '#F7A8C4',
      accent: '#D9A94E',
      hairStyle: 'wavy',
      accessory: 'sparkleRing',
    },
  ],
};

export const getPortraitVariantCount = (lookId: LookId) => CONFIGS[lookId].length;

const HAIR_BACK_PATHS: Record<PortraitConfig['hairStyle'], string> = {
  long: 'M60 120 C40 220 55 320 85 360 L100 340 C88 280 88 200 100 130 Z M240 120 C260 220 245 320 215 360 L200 340 C212 280 212 200 200 130 Z',
  sleek: 'M62 118 C46 210 52 300 78 345 L96 330 C86 270 86 195 98 128 Z M238 118 C254 210 248 300 222 345 L204 330 C214 270 214 195 202 128 Z',
  wavy: 'M55 120 C30 200 50 300 70 345 C82 330 70 300 78 260 C86 300 76 335 92 350 L104 330 C90 270 90 195 100 130 Z M245 120 C270 200 250 300 230 345 C218 330 230 300 222 260 C214 300 224 335 208 350 L196 330 C210 270 210 195 200 130 Z',
  curly: 'M50 130 C20 170 24 240 46 270 C36 290 46 320 70 336 C64 310 72 292 66 268 C86 258 94 220 96 190 C110 160 106 132 100 128 Z M250 130 C280 170 276 240 254 270 C264 290 254 320 230 336 C236 310 228 292 234 268 C214 258 206 220 204 190 C190 160 194 132 200 128 Z',
  bun: 'M64 118 C48 205 56 290 82 330 L98 316 C88 260 88 190 98 128 Z M236 118 C252 205 244 290 218 330 L202 316 C212 260 212 190 202 128 Z M150 40 C126 40 110 60 112 82 C114 100 130 110 150 110 C170 110 186 100 188 82 C190 60 174 40 150 40 Z',
  undone: 'M46 128 C14 190 22 260 44 300 C30 330 42 356 66 366 L84 342 C68 316 74 284 66 250 C90 236 100 190 100 150 Z M254 128 C286 190 278 260 256 300 C270 330 258 356 234 366 L216 342 C232 316 226 284 234 250 C210 236 200 190 200 150 Z',
};

const HAIR_FRONT_PATHS: Record<PortraitConfig['hairStyle'], string> = {
  long: 'M150 44 C104 44 74 78 70 122 C70 140 78 158 92 168 C92 140 100 118 118 106 C130 122 168 122 182 106 C200 118 208 140 208 168 C222 158 230 140 230 122 C226 78 196 44 150 44 Z',
  sleek: 'M150 42 C100 42 68 80 66 126 C66 142 74 156 88 164 C92 132 104 108 122 98 C132 116 168 116 178 98 C196 108 208 132 212 164 C226 156 234 142 234 126 C232 80 200 42 150 42 Z',
  wavy: 'M150 40 C98 40 66 80 64 128 C64 144 72 158 86 166 C88 132 102 106 122 96 C130 118 170 118 178 96 C198 106 212 132 214 166 C228 158 236 144 236 128 C234 80 202 40 150 40 Z',
  curly: 'M150 36 C92 30 56 74 58 126 C60 146 72 160 88 168 C86 132 100 104 122 92 C128 116 172 116 178 92 C200 104 214 132 212 168 C228 160 240 146 242 126 C244 74 208 42 150 36 Z',
  bun: 'M150 50 C104 50 76 82 72 124 C72 140 80 156 94 166 C94 136 104 114 120 104 C130 120 170 120 180 104 C196 114 206 136 206 166 C220 156 228 140 228 124 C224 82 196 50 150 50 Z',
  undone: 'M150 38 C90 32 52 78 54 130 C56 150 70 164 88 172 C84 134 100 104 122 92 C130 116 170 116 178 92 C200 104 216 134 212 172 C230 164 244 150 246 130 C248 78 210 44 150 38 Z',
};

const AccessoryLayer = ({ config }: { config: PortraitConfig }) => {
  switch (config.accessory) {
    case 'flower':
      return (
        <>
          <Circle cx={92} cy={108} r={10} fill="#FFFFFF" opacity={0.95} />
          <Circle cx={104} cy={100} r={9} fill="#FFE4EC" opacity={0.95} />
          <Circle cx={106} cy={116} r={9} fill="#FFE4EC" opacity={0.95} />
          <Circle cx={98} cy={110} r={6} fill="#D9A94E" />
        </>
      );
    case 'glow':
      return (
        <Circle cx={150} cy={150} r={140} fill="url(#glowGrad)" opacity={0.5} />
      );
    case 'stud':
      return (
        <>
          <Circle cx={214} cy={188} r={4} fill="#D9D9D9" />
          <Path d="M60 96 L46 60" stroke="#8A2E48" strokeWidth={4} strokeLinecap="round" opacity={0.7} />
        </>
      );
    case 'hoops':
      return (
        <>
          <Circle cx={78} cy={196} r={14} stroke="#D9A94E" strokeWidth={4} fill="none" />
          <Circle cx={222} cy={196} r={14} stroke="#D9A94E" strokeWidth={4} fill="none" />
        </>
      );
    case 'tiara':
      return (
        <>
          <Path d="M112 58 L120 40 L132 54 L150 32 L168 54 L180 40 L188 58 Z" fill="#D9A94E" opacity={0.95} />
          <Circle cx={150} cy={38} r={4} fill="#FFFFFF" />
        </>
      );
    case 'confetti':
      return (
        <>
          <Circle cx={70} cy={80} r={4} fill="#FF8FA3" />
          <Circle cx={230} cy={90} r={5} fill="#FFCB77" />
          <Circle cx={210} cy={60} r={3} fill="#FFFFFF" />
          <Circle cx={90} cy={56} r={3} fill="#FFCB77" />
        </>
      );
    case 'sparkleRing':
      return (
        <>
          <Circle cx={150} cy={190} r={148} stroke="#D9A94E" strokeWidth={2} strokeDasharray="6 10" fill="none" opacity={0.7} />
          <Circle cx={40} cy={70} r={3} fill="#D9A94E" />
          <Circle cx={260} cy={100} r={4} fill="#F7A8C4" />
          <Circle cx={250} cy={300} r={3} fill="#D9A94E" />
        </>
      );
    default:
      return null;
  }
};

export const GeneratedPortrait = ({
  lookId,
  size = 220,
  variant = 0,
}: {
  lookId: LookId;
  size?: number;
  variant?: number;
}) => {
  const variants = CONFIGS[lookId];
  const config = variants[variant % variants.length];
  const hairBack = HAIR_BACK_PATHS[config.hairStyle];
  const hairFront = HAIR_FRONT_PATHS[config.hairStyle];

  return (
    <Svg width={size} height={size * 1.27} viewBox="0 0 300 380">
      <Defs>
        <LinearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={config.hairFrom} />
          <Stop offset="1" stopColor={config.hairTo} />
        </LinearGradient>
        <RadialGradient id="glowGrad" cx="0.5" cy="0.35" r="0.6">
          <Stop offset="0" stopColor={config.accent} stopOpacity={0.55} />
          <Stop offset="1" stopColor={config.accent} stopOpacity={0} />
        </RadialGradient>
      </Defs>

      <AccessoryLayer config={config} />

      {/* hair back */}
      <Path d={hairBack} fill="url(#hairGrad)" />

      {/* neck + shoulders */}
      <Path
        d="M118 210 L118 250 C90 268 62 300 52 340 L248 340 C238 300 210 268 182 250 L182 210 Z"
        fill={config.skin}
      />
      <Path d="M118 226 C134 240 166 240 182 226 L182 244 C166 256 134 256 118 244 Z" fill={config.skinShadow} opacity={0.5} />

      {/* face */}
      <Ellipse cx={150} cy={150} rx={72} ry={88} fill={config.skin} />

      {/* blush */}
      <Ellipse cx={110} cy={172} rx={16} ry={10} fill={config.blush} opacity={0.55} />
      <Ellipse cx={190} cy={172} rx={16} ry={10} fill={config.blush} opacity={0.55} />

      {/* eyeshadow accent */}
      {config.eyeshadow && (
        <>
          <Ellipse cx={118} cy={140} rx={17} ry={10} fill={config.eyeshadow} opacity={0.6} />
          <Ellipse cx={182} cy={140} rx={17} ry={10} fill={config.eyeshadow} opacity={0.6} />
        </>
      )}

      {/* brows */}
      <Path d="M100 128 Q116 118 134 126" stroke={config.eyeliner} strokeWidth={4} fill="none" strokeLinecap="round" />
      <Path d="M166 126 Q184 118 200 128" stroke={config.eyeliner} strokeWidth={4} fill="none" strokeLinecap="round" />

      {/* eyes */}
      <Ellipse cx={118} cy={148} rx={14} ry={8} fill="#FFFFFF" />
      <Ellipse cx={182} cy={148} rx={14} ry={8} fill="#FFFFFF" />
      <Circle cx={120} cy={148} r={5.5} fill="#3A2430" />
      <Circle cx={184} cy={148} r={5.5} fill="#3A2430" />
      <Path d="M104 146 Q118 136 132 146" stroke={config.eyeliner} strokeWidth={3} fill="none" strokeLinecap="round" />
      <Path d="M168 146 Q182 136 196 146" stroke={config.eyeliner} strokeWidth={3} fill="none" strokeLinecap="round" />
      <Path d="M130 142 L138 136" stroke={config.eyeliner} strokeWidth={2.5} strokeLinecap="round" />
      <Path d="M170 142 L162 136" stroke={config.eyeliner} strokeWidth={2.5} strokeLinecap="round" />

      {/* nose */}
      <Path d="M150 152 C148 164 146 174 150 180" stroke={config.skinShadow} strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.7} />

      {/* lips */}
      <Path
        d="M128 196 C140 190 160 190 172 196 C162 210 138 210 128 196 Z"
        fill={config.lip}
      />
      <Path d="M132 196 C142 200 158 200 168 196" stroke="#00000022" strokeWidth={1.5} fill="none" />

      {/* hair front */}
      <Path d={hairFront} fill="url(#hairGrad)" />
    </Svg>
  );
};
