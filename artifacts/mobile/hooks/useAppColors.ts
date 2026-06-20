import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/constants/themes";

export function useAppColors(): ThemeColors {
  const { colors } = useTheme();
  return colors;
}
