import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";

export type MascotType = "penguin" | "raccoon" | "bear";

interface MascotProps {
  type?: MascotType;
  size?: number;
  animated?: boolean;
}

function Penguin({ s }: { s: number }) {
  return (
    <View style={{ width: s, height: s, position: "relative" }}>
      {/* Body */}
      <View style={{ position: "absolute", width: s * 0.54, height: s * 0.56, borderRadius: s * 0.27, backgroundColor: "#1e3a5f", left: s * 0.23, top: s * 0.36 }} />
      {/* Belly */}
      <View style={{ position: "absolute", width: s * 0.34, height: s * 0.40, borderRadius: s * 0.20, backgroundColor: "#dbeafe", left: s * 0.33, top: s * 0.46 }} />
      {/* Head */}
      <View style={{ position: "absolute", width: s * 0.52, height: s * 0.52, borderRadius: s * 0.26, backgroundColor: "#1e3a5f", left: s * 0.24, top: s * 0.04 }} />
      {/* Left eye white */}
      <View style={{ position: "absolute", width: s * 0.155, height: s * 0.155, borderRadius: s * 0.078, backgroundColor: "white", left: s * 0.305, top: s * 0.13 }} />
      {/* Right eye white */}
      <View style={{ position: "absolute", width: s * 0.155, height: s * 0.155, borderRadius: s * 0.078, backgroundColor: "white", left: s * 0.540, top: s * 0.13 }} />
      {/* Left pupil */}
      <View style={{ position: "absolute", width: s * 0.090, height: s * 0.090, borderRadius: s * 0.045, backgroundColor: "#0f172a", left: s * 0.338, top: s * 0.158 }} />
      {/* Right pupil */}
      <View style={{ position: "absolute", width: s * 0.090, height: s * 0.090, borderRadius: s * 0.045, backgroundColor: "#0f172a", left: s * 0.573, top: s * 0.158 }} />
      {/* Eye shine left */}
      <View style={{ position: "absolute", width: s * 0.040, height: s * 0.040, borderRadius: s * 0.020, backgroundColor: "white", left: s * 0.348, top: s * 0.148 }} />
      {/* Eye shine right */}
      <View style={{ position: "absolute", width: s * 0.040, height: s * 0.040, borderRadius: s * 0.020, backgroundColor: "white", left: s * 0.583, top: s * 0.148 }} />
      {/* Beak */}
      <View style={{ position: "absolute", width: s * 0.20, height: s * 0.11, borderRadius: s * 0.055, backgroundColor: "#f59e0b", left: s * 0.40, top: s * 0.308 }} />
      {/* Cheek left */}
      <View style={{ position: "absolute", width: s * 0.13, height: s * 0.09, borderRadius: s * 0.065, backgroundColor: "#fda4af", opacity: 0.65, left: s * 0.245, top: s * 0.235 }} />
      {/* Cheek right */}
      <View style={{ position: "absolute", width: s * 0.13, height: s * 0.09, borderRadius: s * 0.065, backgroundColor: "#fda4af", opacity: 0.65, left: s * 0.62, top: s * 0.235 }} />
      {/* Left wing */}
      <View style={{ position: "absolute", width: s * 0.175, height: s * 0.295, borderRadius: s * 0.088, backgroundColor: "#1e3a5f", left: s * 0.06, top: s * 0.45, transform: [{ rotate: "-18deg" }] }} />
      {/* Right wing */}
      <View style={{ position: "absolute", width: s * 0.175, height: s * 0.295, borderRadius: s * 0.088, backgroundColor: "#1e3a5f", left: s * 0.765, top: s * 0.45, transform: [{ rotate: "18deg" }] }} />
      {/* Left foot */}
      <View style={{ position: "absolute", width: s * 0.22, height: s * 0.10, borderRadius: s * 0.05, backgroundColor: "#f59e0b", left: s * 0.21, top: s * 0.875 }} />
      {/* Right foot */}
      <View style={{ position: "absolute", width: s * 0.22, height: s * 0.10, borderRadius: s * 0.05, backgroundColor: "#f59e0b", left: s * 0.57, top: s * 0.875 }} />
    </View>
  );
}

function Raccoon({ s }: { s: number }) {
  return (
    <View style={{ width: s, height: s, position: "relative" }}>
      {/* Body */}
      <View style={{ position: "absolute", width: s * 0.52, height: s * 0.52, borderRadius: s * 0.26, backgroundColor: "#9ca3af", left: s * 0.24, top: s * 0.36 }} />
      {/* Belly */}
      <View style={{ position: "absolute", width: s * 0.32, height: s * 0.34, borderRadius: s * 0.17, backgroundColor: "#f3f4f6", left: s * 0.34, top: s * 0.46 }} />
      {/* Head */}
      <View style={{ position: "absolute", width: s * 0.54, height: s * 0.52, borderRadius: s * 0.27, backgroundColor: "#9ca3af", left: s * 0.23, top: s * 0.06 }} />
      {/* Left ear */}
      <View style={{ position: "absolute", width: s * 0.18, height: s * 0.22, borderRadius: s * 0.09, backgroundColor: "#9ca3af", left: s * 0.21, top: s * 0.02 }} />
      {/* Right ear */}
      <View style={{ position: "absolute", width: s * 0.18, height: s * 0.22, borderRadius: s * 0.09, backgroundColor: "#9ca3af", left: s * 0.61, top: s * 0.02 }} />
      {/* Ear inner left */}
      <View style={{ position: "absolute", width: s * 0.10, height: s * 0.13, borderRadius: s * 0.065, backgroundColor: "#e0d7f5", left: s * 0.25, top: s * 0.055 }} />
      {/* Ear inner right */}
      <View style={{ position: "absolute", width: s * 0.10, height: s * 0.13, borderRadius: s * 0.065, backgroundColor: "#e0d7f5", left: s * 0.65, top: s * 0.055 }} />
      {/* Eye mask dark band */}
      <View style={{ position: "absolute", width: s * 0.50, height: s * 0.175, borderRadius: s * 0.088, backgroundColor: "#374151", left: s * 0.25, top: s * 0.195 }} />
      {/* Left eye white */}
      <View style={{ position: "absolute", width: s * 0.145, height: s * 0.145, borderRadius: s * 0.073, backgroundColor: "white", left: s * 0.305, top: s * 0.170 }} />
      {/* Right eye white */}
      <View style={{ position: "absolute", width: s * 0.145, height: s * 0.145, borderRadius: s * 0.073, backgroundColor: "white", left: s * 0.550, top: s * 0.170 }} />
      {/* Left pupil */}
      <View style={{ position: "absolute", width: s * 0.082, height: s * 0.082, borderRadius: s * 0.041, backgroundColor: "#111827", left: s * 0.338, top: s * 0.204 }} />
      {/* Right pupil */}
      <View style={{ position: "absolute", width: s * 0.082, height: s * 0.082, borderRadius: s * 0.041, backgroundColor: "#111827", left: s * 0.583, top: s * 0.204 }} />
      {/* Eye shine left */}
      <View style={{ position: "absolute", width: s * 0.036, height: s * 0.036, borderRadius: s * 0.018, backgroundColor: "white", left: s * 0.348, top: s * 0.194 }} />
      {/* Eye shine right */}
      <View style={{ position: "absolute", width: s * 0.036, height: s * 0.036, borderRadius: s * 0.018, backgroundColor: "white", left: s * 0.593, top: s * 0.194 }} />
      {/* Snout */}
      <View style={{ position: "absolute", width: s * 0.30, height: s * 0.20, borderRadius: s * 0.15, backgroundColor: "#d1d5db", left: s * 0.35, top: s * 0.33 }} />
      {/* Nose */}
      <View style={{ position: "absolute", width: s * 0.125, height: s * 0.088, borderRadius: s * 0.044, backgroundColor: "#374151", left: s * 0.438, top: s * 0.338 }} />
      {/* Cheek left */}
      <View style={{ position: "absolute", width: s * 0.11, height: s * 0.08, borderRadius: s * 0.055, backgroundColor: "#fda4af", opacity: 0.55, left: s * 0.255, top: s * 0.296 }} />
      {/* Cheek right */}
      <View style={{ position: "absolute", width: s * 0.11, height: s * 0.08, borderRadius: s * 0.055, backgroundColor: "#fda4af", opacity: 0.55, left: s * 0.635, top: s * 0.296 }} />
      {/* Left arm */}
      <View style={{ position: "absolute", width: s * 0.16, height: s * 0.27, borderRadius: s * 0.08, backgroundColor: "#9ca3af", left: s * 0.07, top: s * 0.46, transform: [{ rotate: "-15deg" }] }} />
      {/* Right arm */}
      <View style={{ position: "absolute", width: s * 0.16, height: s * 0.27, borderRadius: s * 0.08, backgroundColor: "#9ca3af", left: s * 0.77, top: s * 0.46, transform: [{ rotate: "15deg" }] }} />
      {/* Left foot */}
      <View style={{ position: "absolute", width: s * 0.20, height: s * 0.10, borderRadius: s * 0.05, backgroundColor: "#6b7280", left: s * 0.24, top: s * 0.87 }} />
      {/* Right foot */}
      <View style={{ position: "absolute", width: s * 0.20, height: s * 0.10, borderRadius: s * 0.05, backgroundColor: "#6b7280", left: s * 0.56, top: s * 0.87 }} />
      {/* Tail */}
      <View style={{ position: "absolute", width: s * 0.13, height: s * 0.36, borderRadius: s * 0.065, backgroundColor: "#9ca3af", right: s * 0.01, top: s * 0.47 }} />
      <View style={{ position: "absolute", width: s * 0.09, height: s * 0.065, borderRadius: s * 0.03, backgroundColor: "#374151", right: s * 0.03, top: s * 0.52 }} />
      <View style={{ position: "absolute", width: s * 0.09, height: s * 0.065, borderRadius: s * 0.03, backgroundColor: "#374151", right: s * 0.03, top: s * 0.625 }} />
      <View style={{ position: "absolute", width: s * 0.09, height: s * 0.065, borderRadius: s * 0.03, backgroundColor: "#374151", right: s * 0.03, top: s * 0.73 }} />
    </View>
  );
}

function Bear({ s }: { s: number }) {
  return (
    <View style={{ width: s, height: s, position: "relative" }}>
      {/* Body */}
      <View style={{ position: "absolute", width: s * 0.54, height: s * 0.54, borderRadius: s * 0.27, backgroundColor: "#c2722a", left: s * 0.23, top: s * 0.35 }} />
      {/* Belly */}
      <View style={{ position: "absolute", width: s * 0.34, height: s * 0.37, borderRadius: s * 0.185, backgroundColor: "#e8a95c", left: s * 0.33, top: s * 0.46 }} />
      {/* Head */}
      <View style={{ position: "absolute", width: s * 0.58, height: s * 0.56, borderRadius: s * 0.29, backgroundColor: "#c2722a", left: s * 0.21, top: s * 0.04 }} />
      {/* Left ear */}
      <View style={{ position: "absolute", width: s * 0.21, height: s * 0.22, borderRadius: s * 0.11, backgroundColor: "#c2722a", left: s * 0.18, top: s * 0.01 }} />
      {/* Right ear */}
      <View style={{ position: "absolute", width: s * 0.21, height: s * 0.22, borderRadius: s * 0.11, backgroundColor: "#c2722a", left: s * 0.61, top: s * 0.01 }} />
      {/* Inner ear left */}
      <View style={{ position: "absolute", width: s * 0.13, height: s * 0.14, borderRadius: s * 0.07, backgroundColor: "#f3c9a0", left: s * 0.22, top: s * 0.05 }} />
      {/* Inner ear right */}
      <View style={{ position: "absolute", width: s * 0.13, height: s * 0.14, borderRadius: s * 0.07, backgroundColor: "#f3c9a0", left: s * 0.65, top: s * 0.05 }} />
      {/* Muzzle */}
      <View style={{ position: "absolute", width: s * 0.34, height: s * 0.24, borderRadius: s * 0.17, backgroundColor: "#e8a95c", left: s * 0.33, top: s * 0.32 }} />
      {/* Left eye white */}
      <View style={{ position: "absolute", width: s * 0.155, height: s * 0.155, borderRadius: s * 0.078, backgroundColor: "white", left: s * 0.295, top: s * 0.155 }} />
      {/* Right eye white */}
      <View style={{ position: "absolute", width: s * 0.155, height: s * 0.155, borderRadius: s * 0.078, backgroundColor: "white", left: s * 0.550, top: s * 0.155 }} />
      {/* Left pupil */}
      <View style={{ position: "absolute", width: s * 0.090, height: s * 0.090, borderRadius: s * 0.045, backgroundColor: "#1f1b18", left: s * 0.328, top: s * 0.182 }} />
      {/* Right pupil */}
      <View style={{ position: "absolute", width: s * 0.090, height: s * 0.090, borderRadius: s * 0.045, backgroundColor: "#1f1b18", left: s * 0.582, top: s * 0.182 }} />
      {/* Eye shine left */}
      <View style={{ position: "absolute", width: s * 0.042, height: s * 0.042, borderRadius: s * 0.021, backgroundColor: "white", left: s * 0.340, top: s * 0.172 }} />
      {/* Eye shine right */}
      <View style={{ position: "absolute", width: s * 0.042, height: s * 0.042, borderRadius: s * 0.021, backgroundColor: "white", left: s * 0.594, top: s * 0.172 }} />
      {/* Nose */}
      <View style={{ position: "absolute", width: s * 0.135, height: s * 0.092, borderRadius: s * 0.046, backgroundColor: "#5c3d1e", left: s * 0.433, top: s * 0.34 }} />
      {/* Cheek left */}
      <View style={{ position: "absolute", width: s * 0.13, height: s * 0.09, borderRadius: s * 0.065, backgroundColor: "#fda4af", opacity: 0.55, left: s * 0.235, top: s * 0.265 }} />
      {/* Cheek right */}
      <View style={{ position: "absolute", width: s * 0.13, height: s * 0.09, borderRadius: s * 0.065, backgroundColor: "#fda4af", opacity: 0.55, left: s * 0.635, top: s * 0.265 }} />
      {/* Left arm */}
      <View style={{ position: "absolute", width: s * 0.19, height: s * 0.30, borderRadius: s * 0.095, backgroundColor: "#c2722a", left: s * 0.05, top: s * 0.46, transform: [{ rotate: "-16deg" }] }} />
      {/* Right arm */}
      <View style={{ position: "absolute", width: s * 0.19, height: s * 0.30, borderRadius: s * 0.095, backgroundColor: "#c2722a", left: s * 0.76, top: s * 0.46, transform: [{ rotate: "16deg" }] }} />
      {/* Left foot */}
      <View style={{ position: "absolute", width: s * 0.23, height: s * 0.11, borderRadius: s * 0.055, backgroundColor: "#a0541e", left: s * 0.21, top: s * 0.87 }} />
      {/* Right foot */}
      <View style={{ position: "absolute", width: s * 0.23, height: s * 0.11, borderRadius: s * 0.055, backgroundColor: "#a0541e", left: s * 0.56, top: s * 0.87 }} />
    </View>
  );
}

export default function Mascot({
  type = "penguin",
  size = 80,
  animated = false,
}: MascotProps) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (!animated) return;
    translateY.value = withRepeat(
      withSequence(
        withTiming(-9, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.sin) })
      ),
      -1
    );
  }, [animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const content =
    type === "raccoon" ? (
      <Raccoon s={size} />
    ) : type === "bear" ? (
      <Bear s={size} />
    ) : (
      <Penguin s={size} />
    );

  if (!animated) return content;
  return <Animated.View style={animatedStyle}>{content}</Animated.View>;
}
