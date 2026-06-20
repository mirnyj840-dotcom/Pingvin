export type ThemeId = "space" | "classic" | "pink" | "dawn";

export interface ThemeColors {
  background: string;
  card: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  foreground: string;
  subForeground: string;
  mutedForeground: string;
  border: string;
  amber: string;
  green: string;
  red: string;
  track: string;
  radius: number;
}

export interface Theme {
  id: ThemeId;
  nameRu: string;
  preview: string;
  colors: ThemeColors;
}

const THEMES: Record<ThemeId, Theme> = {
  space: {
    id: "space",
    nameRu: "Космос",
    preview: "#6366F1",
    colors: {
      background: "#0F0F1A",
      card: "#16162A",
      primary: "#6366F1",
      primaryForeground: "#FFFFFF",
      secondary: "#1E1E30",
      foreground: "#F1F5F9",
      subForeground: "rgba(241,245,249,0.55)",
      mutedForeground: "rgba(241,245,249,0.30)",
      border: "#1E1E32",
      amber: "#F59E0B",
      green: "#10B981",
      red: "#EF4444",
      track: "#1E1E30",
      radius: 16,
    },
  },
  classic: {
    id: "classic",
    nameRu: "Классика",
    preview: "#5B4CF0",
    colors: {
      background: "#FAF8F5",
      card: "#FFFFFF",
      primary: "#5B4CF0",
      primaryForeground: "#FFFFFF",
      secondary: "#F3F1FF",
      foreground: "#1F2937",
      subForeground: "rgba(31,41,55,0.60)",
      mutedForeground: "rgba(31,41,55,0.38)",
      border: "#E8E4F0",
      amber: "#FF8A3D",
      green: "#22C55E",
      red: "#EF4444",
      track: "#EDE9FA",
      radius: 20,
    },
  },
  pink: {
    id: "pink",
    nameRu: "Пинк виб",
    preview: "#FF7EB6",
    colors: {
      background: "#FFF1F7",
      card: "#FFFDFC",
      primary: "#FF7EB6",
      primaryForeground: "#FFFFFF",
      secondary: "#FFD6E7",
      foreground: "#2B2B2B",
      subForeground: "rgba(43,43,43,0.58)",
      mutedForeground: "rgba(43,43,43,0.38)",
      border: "#FFD6E7",
      amber: "#FF9F43",
      green: "#22C55E",
      red: "#FF5C8A",
      track: "#FFD6E7",
      radius: 20,
    },
  },
  dawn: {
    id: "dawn",
    nameRu: "Рассвет",
    preview: "#EA580C",
    colors: {
      background: "#FFFBF5",
      card: "#FFFFFF",
      primary: "#EA580C",
      primaryForeground: "#FFFFFF",
      secondary: "#FEF3E2",
      foreground: "#1C1917",
      subForeground: "rgba(28,25,23,0.60)",
      mutedForeground: "rgba(28,25,23,0.40)",
      border: "#FDE8D0",
      amber: "#D97706",
      green: "#16A34A",
      red: "#DC2626",
      track: "#FEF3E2",
      radius: 16,
    },
  },
};

export default THEMES;
