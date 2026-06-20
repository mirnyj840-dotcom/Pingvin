import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import { useApp } from "@/contexts/AppContext";

type Variant = "heading" | "subheading" | "body" | "caption" | "label";

interface AppTextProps extends TextProps {
  variant?: Variant;
}

const BASE_SIZES: Record<Variant, number> = {
  heading: 22,
  subheading: 18,
  body: 15,
  label: 13,
  caption: 12,
};

const FONT_SCALE: Record<string, number> = {
  small: 0.85,
  medium: 1.0,
  large: 1.15,
};

export default function AppText({ variant = "body", style, ...props }: AppTextProps) {
  const { settings } = useApp();
  const scale = FONT_SCALE[settings.fontSize] ?? 1.0;
  const fontSize = BASE_SIZES[variant] * scale;
  return <Text style={[{ fontSize }, style]} {...props} />;
}
