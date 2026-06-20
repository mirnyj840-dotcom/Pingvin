import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
  interpolate,
  useDerivedValue,
} from "react-native-reanimated";
import Svg, { Circle, Ellipse, Path, Rect } from "react-native-svg";

export type MascotType = "penguin" | "raccoon" | "bear";
export type MascotMode = "none" | "idle" | "dance" | "fail";

interface MascotProps {
  type?: MascotType;
  size?: number;
  /** shorthand for mode="idle" */
  animated?: boolean;
  mode?: MascotMode;
}

const PENGUIN_IMG = require("@/assets/images/mascot_penguin.png");

// ─────────────────── RACCOON ───────────────────
function RaccoonSVG({ size }: { size: number }) {
  return (
    <Svg viewBox="0 0 100 120" width={size} height={size}>
      <Ellipse cx="50" cy="118" rx="24" ry="4" fill="#000" fillOpacity={0.12} />
      <Ellipse cx="80" cy="93" rx="8" ry="22" fill="#9ca3af" transform="rotate(14, 80, 93)" />
      <Ellipse cx="82" cy="82" rx="5" ry="7" fill="#374151" transform="rotate(14, 82, 82)" />
      <Ellipse cx="81" cy="94" rx="5" ry="6.5" fill="#374151" transform="rotate(14, 81, 94)" />
      <Ellipse cx="80" cy="106" rx="4.5" ry="5.5" fill="#374151" transform="rotate(14, 80, 106)" />
      <Ellipse cx="50" cy="88" rx="27" ry="30" fill="#9ca3af" />
      <Ellipse cx="50" cy="93" rx="16" ry="21" fill="#f3f4f6" />
      <Ellipse cx="19" cy="88" rx="8" ry="17" fill="#9ca3af" transform="rotate(-15, 19, 88)" />
      <Ellipse cx="81" cy="88" rx="8" ry="17" fill="#9ca3af" transform="rotate(15, 81, 88)" />
      <Ellipse cx="38" cy="115" rx="12" ry="5" fill="#6b7280" />
      <Ellipse cx="62" cy="115" rx="12" ry="5" fill="#6b7280" />
      <Ellipse cx="50" cy="39" rx="28" ry="27" fill="#9ca3af" />
      <Ellipse cx="28" cy="15" rx="11" ry="13.5" fill="#9ca3af" />
      <Ellipse cx="72" cy="15" rx="11" ry="13.5" fill="#9ca3af" />
      <Ellipse cx="28" cy="16" rx="6.5" ry="8.5" fill="#ede9fe" />
      <Ellipse cx="72" cy="16" rx="6.5" ry="8.5" fill="#ede9fe" />
      <Rect x="21" y="26" width="58" height="21" rx="10.5" fill="#374151" />
      <Circle cx="37" cy="36" r="10" fill="white" />
      <Circle cx="63" cy="36" r="10" fill="white" />
      <Circle cx="40" cy="38" r="6" fill="#0d1117" />
      <Circle cx="60" cy="38" r="6" fill="#0d1117" />
      <Circle cx="38" cy="34.5" r="2.7" fill="white" />
      <Circle cx="58" cy="34.5" r="2.7" fill="white" />
      <Ellipse cx="50" cy="52" rx="14" ry="10" fill="#d1d5db" />
      <Ellipse cx="50" cy="47" rx="5.5" ry="4" fill="#374151" />
      <Ellipse cx="48.5" cy="46" rx="1.8" ry="1.3" fill="#6b7280" />
      <Ellipse cx="27" cy="53" rx="8" ry="5.5" fill="#fda4af" fillOpacity={0.7} />
      <Ellipse cx="73" cy="53" rx="8" ry="5.5" fill="#fda4af" fillOpacity={0.7} />
      <Path d="M 43 59 Q 50 66 57 59" stroke="#9ca3af" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </Svg>
  );
}

// ─────────────────── BEAR ───────────────────
function BearSVG({ size }: { size: number }) {
  return (
    <Svg viewBox="0 0 100 120" width={size} height={size}>
      <Ellipse cx="50" cy="118" rx="25" ry="4" fill="#000" fillOpacity={0.12} />
      <Ellipse cx="50" cy="88" rx="29" ry="31" fill="#c2722a" />
      <Ellipse cx="50" cy="93" rx="18" ry="23" fill="#fde68a" />
      <Ellipse cx="17" cy="88" rx="9.5" ry="19" fill="#b86020" transform="rotate(-18, 17, 88)" />
      <Ellipse cx="83" cy="88" rx="9.5" ry="19" fill="#b86020" transform="rotate(18, 83, 88)" />
      <Ellipse cx="37" cy="116" rx="14" ry="5.5" fill="#a0541e" />
      <Ellipse cx="63" cy="116" rx="14" ry="5.5" fill="#a0541e" />
      <Rect x="61" y="96" width="16" height="17" rx="3.5" fill="#fbbf24" />
      <Rect x="61" y="93" width="16" height="6" rx="2.5" fill="#f59e0b" />
      <Ellipse cx="69" cy="104" rx="4" ry="3" fill="#d97706" />
      <Circle cx="50" cy="39" r="29" fill="#c2722a" />
      <Circle cx="25" cy="15" r="14" fill="#c2722a" />
      <Circle cx="75" cy="15" r="14" fill="#c2722a" />
      <Circle cx="25" cy="16" r="8.5" fill="#fca5a5" />
      <Circle cx="75" cy="16" r="8.5" fill="#fca5a5" />
      <Ellipse cx="50" cy="53" rx="16" ry="12" fill="#e8a05a" />
      <Circle cx="35" cy="33" r="10.5" fill="white" />
      <Circle cx="65" cy="33" r="10.5" fill="white" />
      <Circle cx="38" cy="35" r="6.3" fill="#1c0a00" />
      <Circle cx="62" cy="35" r="6.3" fill="#1c0a00" />
      <Circle cx="36" cy="32" r="3" fill="white" />
      <Circle cx="60" cy="32" r="3" fill="white" />
      <Ellipse cx="50" cy="48" rx="6.5" ry="5" fill="#7c2d12" />
      <Ellipse cx="48.5" cy="47" rx="2.2" ry="1.5" fill="#a16207" />
      <Ellipse cx="27" cy="49" rx="8.5" ry="6" fill="#fda4af" fillOpacity={0.75} />
      <Ellipse cx="73" cy="49" rx="8.5" ry="6" fill="#fda4af" fillOpacity={0.75} />
      <Path d="M 43 60 Q 50 68 57 60" stroke="#c2722a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </Svg>
  );
}

// ─────────────────── ANIMATED PENGUIN ───────────────────
function AnimatedPenguin({
  size,
  mode,
}: {
  size: number;
  mode: MascotMode;
}) {
  // Primary animation values
  const floatY = useSharedValue(0);
  const swayX = useSharedValue(0);
  const tilt = useSharedValue(0);
  const breathe = useSharedValue(1);
  const shakeX = useSharedValue(0);

  // Shadow shrinks as penguin rises
  const shadowScale = useDerivedValue(() =>
    interpolate(floatY.value, [-22, 0], [0.55, 1.0])
  );
  const shadowOpacity = useDerivedValue(() =>
    interpolate(floatY.value, [-22, 0], [0.04, 0.14])
  );

  useEffect(() => {
    // Reset everything
    floatY.value = withTiming(0, { duration: 80 });
    swayX.value = withTiming(0, { duration: 80 });
    tilt.value = withTiming(0, { duration: 80 });
    breathe.value = withTiming(1, { duration: 80 });
    shakeX.value = withTiming(0, { duration: 80 });

    if (mode === "idle") {
      // Gentle float — Duolingo style sine wave
      floatY.value = withRepeat(
        withSequence(
          withTiming(-10, {
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(0, {
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
          })
        ),
        -1,
        false
      );
      // Breathing scale — slightly offset phase from float
      breathe.value = withRepeat(
        withSequence(
          withTiming(1.04, {
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(1.0, {
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
          })
        ),
        -1,
        false
      );
      // Very subtle pendulum tilt
      tilt.value = withRepeat(
        withSequence(
          withTiming(-3, {
            duration: 2200,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(3, {
            duration: 2200,
            easing: Easing.inOut(Easing.sin),
          })
        ),
        -1,
        false
      );
    } else if (mode === "dance") {
      // Energetic bounce
      floatY.value = withRepeat(
        withSequence(
          withTiming(-22, {
            duration: 220,
            easing: Easing.out(Easing.cubic),
          }),
          withTiming(2, {
            duration: 180,
            easing: Easing.in(Easing.quad),
          }),
          withTiming(0, {
            duration: 80,
            easing: Easing.out(Easing.quad),
          })
        ),
        -1,
        false
      );
      // Side-to-side sway, half the bounce period → waddling feel
      swayX.value = withRepeat(
        withSequence(
          withTiming(12, {
            duration: 240,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(-12, {
            duration: 240,
            easing: Easing.inOut(Easing.sin),
          })
        ),
        -1,
        false
      );
      // Lean into the sway direction
      tilt.value = withRepeat(
        withSequence(
          withTiming(14, {
            duration: 240,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(-14, {
            duration: 240,
            easing: Easing.inOut(Easing.sin),
          })
        ),
        -1,
        false
      );
      // Pulse scale on the bounce peak
      breathe.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 200, easing: Easing.out(Easing.quad) }),
          withTiming(0.96, { duration: 280, easing: Easing.in(Easing.quad) }),
          withTiming(1.0, { duration: 80 })
        ),
        -1,
        false
      );
    } else if (mode === "fail") {
      // Rapid shake → spring settle
      shakeX.value = withSequence(
        withTiming(14, { duration: 50 }),
        withTiming(-14, { duration: 55 }),
        withTiming(11, { duration: 55 }),
        withTiming(-11, { duration: 55 }),
        withTiming(7, { duration: 55 }),
        withTiming(-7, { duration: 55 }),
        withTiming(4, { duration: 55 }),
        withSpring(0, { damping: 6, stiffness: 180 })
      );
      // Small droop
      tilt.value = withSequence(
        withTiming(-8, { duration: 180 }),
        withSpring(0, { damping: 8, stiffness: 120 })
      );
    }
  }, [mode]);

  // ── Animated styles ──
  const bodyStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: floatY.value },
      { translateX: swayX.value + shakeX.value },
      { rotate: `${tilt.value}deg` },
      { scale: breathe.value },
    ],
  }));

  const shadowStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: shadowScale.value }],
    opacity: shadowOpacity.value,
  }));

  return (
    <View style={{ width: size, alignItems: "center", backgroundColor: "transparent" }}>
      {/* Drop shadow ellipse — squishes dynamically */}
      <Animated.View
        style={[
          {
            width: size * 0.65,
            height: size * 0.08,
            borderRadius: size * 0.04,
            backgroundColor: "#000",
            marginBottom: -size * 0.03,
            alignSelf: "center",
          },
          shadowStyle,
        ]}
      />

      {/* Penguin image — transparent container is critical */}
      <Animated.View
        style={[
          { width: size, height: size, backgroundColor: "transparent" },
          bodyStyle,
        ]}
      >
        <Image
          source={PENGUIN_IMG}
          resizeMode="contain"
          style={{ width: size, height: size, backgroundColor: "transparent" }}
        />
      </Animated.View>
    </View>
  );
}

// ─────────────────── MAIN EXPORT ───────────────────
export default function Mascot({
  type = "penguin",
  size = 80,
  animated = false,
  mode,
}: MascotProps) {
  const effectiveMode: MascotMode = mode ?? (animated ? "idle" : "none");

  if (type === "penguin") {
    return <AnimatedPenguin size={size} mode={effectiveMode} />;
  }

  // Raccoon & bear keep SVG + classic animation wrapper
  const bounceY = useSharedValue(0);
  const swayX = useSharedValue(0);
  const tiltDeg = useSharedValue(0);
  const shakeX = useSharedValue(0);

  useEffect(() => {
    bounceY.value = 0;
    swayX.value = 0;
    tiltDeg.value = 0;
    shakeX.value = 0;

    if (effectiveMode === "idle") {
      bounceY.value = withRepeat(
        withSequence(
          withTiming(-10, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.sin) })
        ),
        -1
      );
    } else if (effectiveMode === "dance") {
      bounceY.value = withRepeat(
        withSequence(
          withTiming(-18, { duration: 160, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 200, easing: Easing.in(Easing.quad) })
        ),
        -1
      );
      swayX.value = withRepeat(
        withSequence(
          withTiming(9, { duration: 320, easing: Easing.inOut(Easing.sin) }),
          withTiming(-9, { duration: 320, easing: Easing.inOut(Easing.sin) })
        ),
        -1
      );
      tiltDeg.value = withRepeat(
        withSequence(
          withTiming(-11, { duration: 320, easing: Easing.inOut(Easing.sin) }),
          withTiming(11, { duration: 320, easing: Easing.inOut(Easing.sin) })
        ),
        -1
      );
    } else if (effectiveMode === "fail") {
      shakeX.value = withSequence(
        withTiming(12, { duration: 55 }),
        withTiming(-12, { duration: 55 }),
        withTiming(10, { duration: 55 }),
        withTiming(-10, { duration: 55 }),
        withTiming(6, { duration: 55 }),
        withTiming(-6, { duration: 55 }),
        withTiming(0, { duration: 55 })
      );
    }
  }, [effectiveMode]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bounceY.value },
      { translateX: swayX.value + shakeX.value },
      { rotate: `${tiltDeg.value}deg` },
    ],
  }));

  const svg =
    type === "raccoon" ? <RaccoonSVG size={size} /> : <BearSVG size={size} />;

  if (effectiveMode === "none") return svg;

  return <Animated.View style={animStyle}>{svg}</Animated.View>;
}
