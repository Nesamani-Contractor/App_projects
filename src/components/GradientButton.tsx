import React from 'react';
import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, gradients, radii, typography } from '../theme/colors';

type Props = {
  label: string;
  onPress?: (e: GestureResponderEvent) => void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'gold' | 'outline' | 'dark';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  fullWidth?: boolean;
};

export const GradientButton = ({
  label,
  onPress,
  icon,
  variant = 'gold',
  style,
  textStyle,
  disabled,
  fullWidth = true,
}: Props) => {
  if (variant === 'outline') {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.outline,
          fullWidth && styles.fullWidth,
          pressed && { opacity: 0.7 },
          disabled && styles.disabled,
          style,
        ]}
      >
        {icon && <Ionicons name={icon} size={18} color={colors.berry} style={styles.icon} />}
        <Text style={[styles.outlineText, textStyle]}>{label}</Text>
      </Pressable>
    );
  }

  const colorSet = variant === 'dark' ? [colors.plum, colors.berry] as const : gradients.goldButton;

  return (
    <Pressable onPress={onPress} disabled={disabled} style={[fullWidth && styles.fullWidth, style]}>
      {({ pressed }) => (
        <LinearGradient
          colors={colorSet}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, pressed && { opacity: 0.85 }, disabled && styles.disabled]}
        >
          {icon && <Ionicons name={icon} size={18} color={colors.ivory} style={styles.icon} />}
          <Text style={[styles.gradientText, textStyle]}>{label}</Text>
        </LinearGradient>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  fullWidth: { width: '100%' },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: radii.pill,
    shadowColor: colors.goldDeep,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  gradientText: {
    color: colors.ivory,
    fontFamily: typography.bodySemiBold,
    fontSize: 15,
    letterSpacing: 0.3,
  },
  outline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: colors.rose,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  outlineText: {
    color: colors.berry,
    fontFamily: typography.bodySemiBold,
    fontSize: 15,
  },
  icon: { marginRight: 8 },
  disabled: { opacity: 0.5 },
});
