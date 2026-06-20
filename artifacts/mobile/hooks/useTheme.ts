import THEMES, { ThemeColors } from "@/constants/themes";
import { useApp } from "@/contexts/AppContext";

const SCALE_MAP: Record<string, number> = {
  small: 0.85,
  medium: 1.0,
  large: 1.15,
};

export interface ThemeContext {
  colors: ThemeColors;
  fontScale: number;
  /** Scale a base font size by the user's font scale preference */
  fs: (base: number) => number;
}

export function useTheme(): ThemeContext {
  const { settings } = useApp();
  const colors = THEMES[settings.theme]?.colors ?? THEMES.space.colors;
  const fontScale = SCALE_MAP[settings.fontSize] ?? 1.0;
  const fs = (base: number) => Math.round(base * fontScale);
  return { colors, fontScale, fs };
}
