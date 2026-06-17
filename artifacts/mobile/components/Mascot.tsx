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
      <View
        style={{
          position: "absolute",
          width: s * 0.56,
          height: s * 0.62,
          borderRadius: s * 0.28,
          backgroundColor: "#1E293B",
          left: s * 0.22,
          top: s * 0.29,
        }}
      />
      {/* Belly */}
      <View
        style={{
          position: "absolute",
          width: s * 0.32,
          height: s * 0.4,
          borderRadius: s * 0.2,
          backgroundColor: "#F1F5F9",
          left: s * 0.34,
          top: s * 0.44,
        }}
      />
      {/* Head */}
      <View
        style={{
          position: "absolute",
          width: s * 0.42,
          height: s * 0.42,
          borderRadius: s * 0.21,
          backgroundColor: "#1E293B",
          left: s * 0.29,
          top: s * 0.07,
        }}
      />
      {/* Left eye white */}
      <View
        style={{
          position: "absolute",
          width: s * 0.13,
          height: s * 0.13,
          borderRadius: s * 0.065,
          backgroundColor: "white",
          left: s * 0.34,
          top: s * 0.17,
        }}
      />
      {/* Right eye white */}
      <View
        style={{
          position: "absolute",
          width: s * 0.13,
          height: s * 0.13,
          borderRadius: s * 0.065,
          backgroundColor: "white",
          left: s * 0.53,
          top: s * 0.17,
        }}
      />
      {/* Left pupil */}
      <View
        style={{
          position: "absolute",
          width: s * 0.07,
          height: s * 0.07,
          borderRadius: s * 0.035,
          backgroundColor: "#0F172A",
          left: s * 0.375,
          top: s * 0.195,
        }}
      />
      {/* Right pupil */}
      <View
        style={{
          position: "absolute",
          width: s * 0.07,
          height: s * 0.07,
          borderRadius: s * 0.035,
          backgroundColor: "#0F172A",
          left: s * 0.565,
          top: s * 0.195,
        }}
      />
      {/* Eye shine left */}
      <View
        style={{
          position: "absolute",
          width: s * 0.03,
          height: s * 0.03,
          borderRadius: s * 0.015,
          backgroundColor: "white",
          left: s * 0.39,
          top: s * 0.185,
        }}
      />
      {/* Eye shine right */}
      <View
        style={{
          position: "absolute",
          width: s * 0.03,
          height: s * 0.03,
          borderRadius: s * 0.015,
          backgroundColor: "white",
          left: s * 0.58,
          top: s * 0.185,
        }}
      />
      {/* Beak */}
      <View
        style={{
          position: "absolute",
          width: s * 0.14,
          height: s * 0.08,
          borderRadius: s * 0.04,
          backgroundColor: "#F59E0B",
          left: s * 0.43,
          top: s * 0.3,
        }}
      />
      {/* Left wing */}
      <View
        style={{
          position: "absolute",
          width: s * 0.17,
          height: s * 0.28,
          borderRadius: s * 0.085,
          backgroundColor: "#1E293B",
          left: s * 0.1,
          top: s * 0.42,
          transform: [{ rotate: "-16deg" }],
        }}
      />
      {/* Right wing */}
      <View
        style={{
          position: "absolute",
          width: s * 0.17,
          height: s * 0.28,
          borderRadius: s * 0.085,
          backgroundColor: "#1E293B",
          left: s * 0.73,
          top: s * 0.42,
          transform: [{ rotate: "16deg" }],
        }}
      />
      {/* Left foot */}
      <View
        style={{
          position: "absolute",
          width: s * 0.19,
          height: s * 0.09,
          borderRadius: s * 0.045,
          backgroundColor: "#F59E0B",
          left: s * 0.24,
          top: s * 0.88,
        }}
      />
      {/* Right foot */}
      <View
        style={{
          position: "absolute",
          width: s * 0.19,
          height: s * 0.09,
          borderRadius: s * 0.045,
          backgroundColor: "#F59E0B",
          left: s * 0.57,
          top: s * 0.88,
        }}
      />
    </View>
  );
}

function Raccoon({ s }: { s: number }) {
  return (
    <View style={{ width: s, height: s, position: "relative" }}>
      {/* Body */}
      <View
        style={{
          position: "absolute",
          width: s * 0.54,
          height: s * 0.56,
          borderRadius: s * 0.27,
          backgroundColor: "#78716C",
          left: s * 0.23,
          top: s * 0.33,
        }}
      />
      {/* Belly */}
      <View
        style={{
          position: "absolute",
          width: s * 0.3,
          height: s * 0.34,
          borderRadius: s * 0.17,
          backgroundColor: "#D6D3D1",
          left: s * 0.35,
          top: s * 0.47,
        }}
      />
      {/* Head */}
      <View
        style={{
          position: "absolute",
          width: s * 0.46,
          height: s * 0.44,
          borderRadius: s * 0.23,
          backgroundColor: "#78716C",
          left: s * 0.27,
          top: s * 0.08,
        }}
      />
      {/* Left ear */}
      <View
        style={{
          position: "absolute",
          width: s * 0.16,
          height: s * 0.16,
          borderRadius: s * 0.08,
          backgroundColor: "#78716C",
          left: s * 0.25,
          top: s * 0.04,
        }}
      />
      {/* Right ear */}
      <View
        style={{
          position: "absolute",
          width: s * 0.16,
          height: s * 0.16,
          borderRadius: s * 0.08,
          backgroundColor: "#78716C",
          left: s * 0.59,
          top: s * 0.04,
        }}
      />
      {/* Ear inner left */}
      <View
        style={{
          position: "absolute",
          width: s * 0.09,
          height: s * 0.09,
          borderRadius: s * 0.045,
          backgroundColor: "#E7E5E4",
          left: s * 0.285,
          top: s * 0.075,
        }}
      />
      {/* Ear inner right */}
      <View
        style={{
          position: "absolute",
          width: s * 0.09,
          height: s * 0.09,
          borderRadius: s * 0.045,
          backgroundColor: "#E7E5E4",
          left: s * 0.625,
          top: s * 0.075,
        }}
      />
      {/* Eye mask dark */}
      <View
        style={{
          position: "absolute",
          width: s * 0.44,
          height: s * 0.14,
          borderRadius: s * 0.07,
          backgroundColor: "#292524",
          left: s * 0.28,
          top: s * 0.21,
        }}
      />
      {/* Left eye white */}
      <View
        style={{
          position: "absolute",
          width: s * 0.12,
          height: s * 0.12,
          borderRadius: s * 0.06,
          backgroundColor: "white",
          left: s * 0.32,
          top: s * 0.185,
        }}
      />
      {/* Right eye white */}
      <View
        style={{
          position: "absolute",
          width: s * 0.12,
          height: s * 0.12,
          borderRadius: s * 0.06,
          backgroundColor: "white",
          left: s * 0.56,
          top: s * 0.185,
        }}
      />
      {/* Left pupil */}
      <View
        style={{
          position: "absolute",
          width: s * 0.07,
          height: s * 0.07,
          borderRadius: s * 0.035,
          backgroundColor: "#0C0A09",
          left: s * 0.345,
          top: s * 0.205,
        }}
      />
      {/* Right pupil */}
      <View
        style={{
          position: "absolute",
          width: s * 0.07,
          height: s * 0.07,
          borderRadius: s * 0.035,
          backgroundColor: "#0C0A09",
          left: s * 0.585,
          top: s * 0.205,
        }}
      />
      {/* Nose */}
      <View
        style={{
          position: "absolute",
          width: s * 0.11,
          height: s * 0.08,
          borderRadius: s * 0.04,
          backgroundColor: "#44403C",
          left: s * 0.445,
          top: s * 0.33,
        }}
      />
      {/* Left arm */}
      <View
        style={{
          position: "absolute",
          width: s * 0.15,
          height: s * 0.24,
          borderRadius: s * 0.075,
          backgroundColor: "#78716C",
          left: s * 0.1,
          top: s * 0.44,
          transform: [{ rotate: "-14deg" }],
        }}
      />
      {/* Right arm */}
      <View
        style={{
          position: "absolute",
          width: s * 0.15,
          height: s * 0.24,
          borderRadius: s * 0.075,
          backgroundColor: "#78716C",
          left: s * 0.75,
          top: s * 0.44,
          transform: [{ rotate: "14deg" }],
        }}
      />
      {/* Left foot */}
      <View
        style={{
          position: "absolute",
          width: s * 0.17,
          height: s * 0.09,
          borderRadius: s * 0.045,
          backgroundColor: "#57534E",
          left: s * 0.25,
          top: s * 0.88,
        }}
      />
      {/* Right foot */}
      <View
        style={{
          position: "absolute",
          width: s * 0.17,
          height: s * 0.09,
          borderRadius: s * 0.045,
          backgroundColor: "#57534E",
          left: s * 0.58,
          top: s * 0.88,
        }}
      />
      {/* Tail stripe 1 */}
      <View
        style={{
          position: "absolute",
          width: s * 0.1,
          height: s * 0.04,
          borderRadius: s * 0.02,
          backgroundColor: "#292524",
          right: s * 0.02,
          top: s * 0.55,
        }}
      />
      {/* Tail stripe 2 */}
      <View
        style={{
          position: "absolute",
          width: s * 0.1,
          height: s * 0.04,
          borderRadius: s * 0.02,
          backgroundColor: "#78716C",
          right: s * 0.02,
          top: s * 0.62,
        }}
      />
      {/* Tail stripe 3 */}
      <View
        style={{
          position: "absolute",
          width: s * 0.1,
          height: s * 0.04,
          borderRadius: s * 0.02,
          backgroundColor: "#292524",
          right: s * 0.02,
          top: s * 0.69,
        }}
      />
    </View>
  );
}

function Bear({ s }: { s: number }) {
  return (
    <View style={{ width: s, height: s, position: "relative" }}>
      {/* Body */}
      <View
        style={{
          position: "absolute",
          width: s * 0.56,
          height: s * 0.58,
          borderRadius: s * 0.28,
          backgroundColor: "#92400E",
          left: s * 0.22,
          top: s * 0.32,
        }}
      />
      {/* Belly */}
      <View
        style={{
          position: "absolute",
          width: s * 0.32,
          height: s * 0.36,
          borderRadius: s * 0.18,
          backgroundColor: "#B45309",
          left: s * 0.34,
          top: s * 0.46,
        }}
      />
      {/* Head */}
      <View
        style={{
          position: "absolute",
          width: s * 0.48,
          height: s * 0.46,
          borderRadius: s * 0.24,
          backgroundColor: "#92400E",
          left: s * 0.26,
          top: s * 0.07,
        }}
      />
      {/* Left ear */}
      <View
        style={{
          position: "absolute",
          width: s * 0.19,
          height: s * 0.19,
          borderRadius: s * 0.095,
          backgroundColor: "#92400E",
          left: s * 0.22,
          top: s * 0.03,
        }}
      />
      {/* Right ear */}
      <View
        style={{
          position: "absolute",
          width: s * 0.19,
          height: s * 0.19,
          borderRadius: s * 0.095,
          backgroundColor: "#92400E",
          left: s * 0.59,
          top: s * 0.03,
        }}
      />
      {/* Inner left ear */}
      <View
        style={{
          position: "absolute",
          width: s * 0.11,
          height: s * 0.11,
          borderRadius: s * 0.055,
          backgroundColor: "#B45309",
          left: s * 0.26,
          top: s * 0.07,
        }}
      />
      {/* Inner right ear */}
      <View
        style={{
          position: "absolute",
          width: s * 0.11,
          height: s * 0.11,
          borderRadius: s * 0.055,
          backgroundColor: "#B45309",
          left: s * 0.63,
          top: s * 0.07,
        }}
      />
      {/* Muzzle */}
      <View
        style={{
          position: "absolute",
          width: s * 0.28,
          height: s * 0.2,
          borderRadius: s * 0.14,
          backgroundColor: "#D97706",
          left: s * 0.36,
          top: s * 0.32,
        }}
      />
      {/* Left eye */}
      <View
        style={{
          position: "absolute",
          width: s * 0.12,
          height: s * 0.12,
          borderRadius: s * 0.06,
          backgroundColor: "#0C0A09",
          left: s * 0.33,
          top: s * 0.18,
        }}
      />
      {/* Right eye */}
      <View
        style={{
          position: "absolute",
          width: s * 0.12,
          height: s * 0.12,
          borderRadius: s * 0.06,
          backgroundColor: "#0C0A09",
          left: s * 0.55,
          top: s * 0.18,
        }}
      />
      {/* Eye shine left */}
      <View
        style={{
          position: "absolute",
          width: s * 0.04,
          height: s * 0.04,
          borderRadius: s * 0.02,
          backgroundColor: "white",
          left: s * 0.355,
          top: s * 0.19,
        }}
      />
      {/* Eye shine right */}
      <View
        style={{
          position: "absolute",
          width: s * 0.04,
          height: s * 0.04,
          borderRadius: s * 0.02,
          backgroundColor: "white",
          left: s * 0.575,
          top: s * 0.19,
        }}
      />
      {/* Nose */}
      <View
        style={{
          position: "absolute",
          width: s * 0.1,
          height: s * 0.08,
          borderRadius: s * 0.04,
          backgroundColor: "#0C0A09",
          left: s * 0.45,
          top: s * 0.335,
        }}
      />
      {/* Left arm */}
      <View
        style={{
          position: "absolute",
          width: s * 0.18,
          height: s * 0.27,
          borderRadius: s * 0.09,
          backgroundColor: "#92400E",
          left: s * 0.08,
          top: s * 0.43,
          transform: [{ rotate: "-15deg" }],
        }}
      />
      {/* Right arm */}
      <View
        style={{
          position: "absolute",
          width: s * 0.18,
          height: s * 0.27,
          borderRadius: s * 0.09,
          backgroundColor: "#92400E",
          left: s * 0.74,
          top: s * 0.43,
          transform: [{ rotate: "15deg" }],
        }}
      />
      {/* Left foot */}
      <View
        style={{
          position: "absolute",
          width: s * 0.21,
          height: s * 0.1,
          borderRadius: s * 0.05,
          backgroundColor: "#92400E",
          left: s * 0.21,
          top: s * 0.88,
        }}
      />
      {/* Right foot */}
      <View
        style={{
          position: "absolute",
          width: s * 0.21,
          height: s * 0.1,
          borderRadius: s * 0.05,
          backgroundColor: "#92400E",
          left: s * 0.58,
          top: s * 0.88,
        }}
      />
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
        withTiming(-8, {
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(0, {
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
        })
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
