import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Mascot from "@/components/Mascot";
import { useTheme } from "@/hooks/useTheme";
import type { MascotType } from "@/contexts/AppContext";

const { width: SW, height: SH } = Dimensions.get("window");

const CONFETTI_COLORS = [
  "#6366F1", "#8B5CF6", "#EC4899", "#F59E0B",
  "#10B981", "#3B82F6", "#EF4444", "#F97316",
  "#06B6D4", "#A3E635", "#FBBF24", "#C084FC",
  "#FF7EB6", "#34D399", "#60A5FA", "#FCD34D",
];
const CONFETTI_COUNT = 52;
const PARTICLES = Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
  id: i,
  x: (i / CONFETTI_COUNT) * SW + Math.sin(i * 2.3) * 28,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  w: 6 + ((i * 7) % 12),
  h: 4 + ((i * 5) % 10),
  delay: (i % 14) * 60,
  duration: 1600 + ((i * 137) % 1400),
  rotDeg: 180 + ((i * 113) % 360),
  xDrift: (i % 2 === 0 ? 1 : -1) * (18 + ((i * 31) % 90)),
  isCircle: i % 5 === 0,
  isStar: i % 8 === 0,
}));

function ConfettiParticle({ x, color, w, h, delay, duration, rotDeg, xDrift, isCircle }: typeof PARTICLES[0]) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withDelay(delay, withTiming(1, { duration, easing: Easing.out(Easing.cubic) }));
  }, []);
  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(p.value, [0, 1], [0, xDrift]) },
      { translateY: interpolate(p.value, [0, 1], [-80, SH + 100]) },
      { rotate: `${interpolate(p.value, [0, 1], [0, rotDeg])}deg` },
      { scale: interpolate(p.value, [0, 0.08, 1], [0, 1, 0.7]) },
    ],
    opacity: interpolate(p.value, [0, 0.6, 1], [1, 1, 0]),
  }));
  return (
    <Animated.View
      style={[{
        position: "absolute", left: x, top: 0,
        width: isCircle ? w : w, height: isCircle ? w : h,
        borderRadius: isCircle ? w / 2 : 2,
        backgroundColor: color,
      }, style]}
    />
  );
}

function StarRay({ angle, delay, color }: { angle: number; delay: number; color: string }) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withDelay(delay, withSequence(
      withTiming(1, { duration: 380, easing: Easing.out(Easing.back(1.3)) }),
      withTiming(0, { duration: 280, easing: Easing.in(Easing.quad) })
    ));
  }, []);
  const rad = (angle * Math.PI) / 180;
  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: Math.cos(rad) * interpolate(p.value, [0, 1], [18, 100]) },
      { translateY: Math.sin(rad) * interpolate(p.value, [0, 1], [18, 100]) },
    ],
    opacity: interpolate(p.value, [0, 0.3, 1], [0, 1, 0]),
  }));
  return (
    <Animated.View style={[styles.starRay, style]}>
      <Feather name="star" size={14} color={color} />
    </Animated.View>
  );
}

function AnimatedStar({ index, lit, color }: { index: number; lit: boolean; color: string }) {
  const scale = useSharedValue(0);
  const op = useSharedValue(0);
  useEffect(() => {
    scale.value = withDelay(380 + index * 120, withSpring(lit ? 1 : 0.5, { damping: 7, stiffness: 200 }));
    op.value = withDelay(380 + index * 120, withTiming(1, { duration: 280 }));
  }, []);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: op.value,
  }));
  return (
    <Animated.View style={style}>
      <Feather name="star" size={36} color={lit ? color : "#374151"} />
    </Animated.View>
  );
}

interface Props {
  passed: boolean;
  isTheory: boolean;
  xpEarned: number;
  correct: number;
  total: number;
  alreadyDone: boolean;
  mascot: MascotType;
  onContinue: () => void;
}

export default function CelebrationOverlay({
  passed, isTheory, xpEarned, correct, total, alreadyDone, mascot, onContinue,
}: Props) {
  const { colors, fs } = useTheme();
  const [displayXp, setDisplayXp] = useState(0);
  const [btnReady, setBtnReady] = useState(false);

  const overlayOp = useSharedValue(0);
  const cardScale = useSharedValue(0.4);
  const cardOp = useSharedValue(0);
  const mascotScale = useSharedValue(0);
  const titleScale = useSharedValue(0);
  const xpPillScale = useSharedValue(0);
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(
        passed ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning
      );
    }

    overlayOp.value = withTiming(1, { duration: 240 });
    cardScale.value = withDelay(80, withSpring(1, { damping: 12, stiffness: 170 }));
    cardOp.value = withDelay(80, withTiming(1, { duration: 240 }));
    mascotScale.value = withDelay(200, withSpring(1, { damping: 8, stiffness: 185 }));
    titleScale.value = withDelay(340, withSpring(1, { damping: 11, stiffness: 220 }));

    if (passed) {
      // Gentle pulse on the card after entrance
      setTimeout(() => {
        pulseAnim.value = withRepeat(
          withSequence(
            withTiming(1.015, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
            withTiming(1.0, { duration: 1200, easing: Easing.inOut(Easing.sin) })
          ), -1
        );
      }, 900);
    }

    if (xpEarned > 0) {
      xpPillScale.value = withDelay(500, withSpring(1, { damping: 8, stiffness: 195 }));
      const DURATION = 1000;
      setTimeout(() => {
        let start: number | null = null;
        const tick = (ts: number) => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / DURATION, 1);
          setDisplayXp(Math.round(p * xpEarned));
          if (p < 1) requestAnimationFrame(tick);
          else setBtnReady(true);
        };
        requestAnimationFrame(tick);
      }, 580);
    } else {
      xpPillScale.value = withDelay(500, withSpring(1, { damping: 10, stiffness: 200 }));
      setTimeout(() => setBtnReady(true), 780);
    }
  }, []);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlayOp.value }));
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value * pulseAnim.value }],
    opacity: cardOp.value,
  }));
  const mascotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: mascotScale.value }],
  }));
  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
  }));
  const xpStyle = useAnimatedStyle(() => ({
    transform: [{ scale: xpPillScale.value }],
  }));

  const title = isTheory ? "Материал изучен! 📚"
    : passed ? "Пройдено! 🎉"
    : "Попробуй ещё раз 💪";
  const subtitle = isTheory ? "Теория усвоена. Молодец!"
    : passed
      ? total > 0 ? `${correct} из ${total} правильно ✓` : "Отличная работа!"
      : `${correct} из ${total} — нужно 80% для прохождения`;

  const accuracy = total > 0 ? correct / total : 1;
  const stars = isTheory ? 3 : accuracy >= 0.95 ? 3 : accuracy >= 0.8 ? 2 : 1;

  // Adaptive card colors
  const cardBg = colors.card;
  const cardBorder = colors.border;
  const titleColor = passed ? colors.primary : colors.amber;
  const subtitleColor = colors.subForeground;
  const starColor = colors.amber;

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, overlayStyle, { backgroundColor: "rgba(0,0,0,0.82)" }]}>
      {passed && (
        <View style={[StyleSheet.absoluteFill, { pointerEvents: "none" } as any]}>
          {PARTICLES.map((p) => <ConfettiParticle key={p.id} {...p} />)}
        </View>
      )}

      <Animated.View style={[styles.card, cardStyle, {
        backgroundColor: cardBg,
        borderColor: cardBorder,
        shadowColor: passed ? colors.primary : colors.amber,
        shadowOpacity: 0.2,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 8 },
        elevation: 16,
        borderRadius: colors.radius + 8,
      }]}>
        {/* Mascot */}
        <View style={styles.mascotWrap}>
          <Animated.View style={mascotStyle}>
            <Mascot type={mascot} size={120} mode={passed ? "dance" : "fail"} />
          </Animated.View>
          {passed && (
            <View style={[styles.starsRing, { pointerEvents: "none" } as any]}>
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <StarRay key={angle} angle={angle} delay={280 + i * 50} color={starColor} />
              ))}
            </View>
          )}
        </View>

        {/* Title */}
        <Animated.View style={titleStyle}>
          <Text style={[styles.title, { color: titleColor, fontSize: fs(24) }]}>
            {title}
          </Text>
        </Animated.View>

        <Text style={[styles.subtitle, { color: subtitleColor, fontSize: fs(14) }]}>
          {subtitle}
        </Text>

        {/* Stars */}
        {(passed || isTheory) && (
          <View style={styles.starsRow}>
            {[1, 2, 3].map((s) => (
              <AnimatedStar key={s} index={s} lit={s <= stars} color={starColor} />
            ))}
          </View>
        )}

        {/* XP pill */}
        {!alreadyDone && xpEarned > 0 && (
          <Animated.View style={xpStyle}>
            <LinearGradient
              colors={passed ? [colors.primary, colors.primary + "CC"] : [colors.amber, "#F97316"]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={[styles.xpPill, { borderRadius: colors.radius }]}
            >
              <Feather name="zap" size={20} color="white" />
              <Text style={[styles.xpText, { fontSize: fs(22) }]}>+{displayXp} XP</Text>
            </LinearGradient>
          </Animated.View>
        )}

        {alreadyDone && (
          <View style={[styles.alreadyBadge, { backgroundColor: colors.primary + "14", borderColor: colors.primary + "30", borderRadius: colors.radius * 0.7 }]}>
            <Feather name="check-circle" size={14} color={colors.primary} />
            <Text style={[styles.alreadyText, { color: colors.primary, fontSize: fs(13) }]}>Уже пройдено · XP не начислено</Text>
          </View>
        )}

        {/* Accuracy bar for quiz results */}
        {!isTheory && total > 0 && (
          <View style={[styles.accuracyBar, { backgroundColor: colors.secondary, borderRadius: colors.radius * 0.5 }]}>
            <View style={[styles.accuracyFill, {
              width: `${accuracy * 100}%`,
              backgroundColor: accuracy >= 0.8 ? colors.green : accuracy >= 0.5 ? colors.amber : colors.red,
              borderRadius: colors.radius * 0.5,
            }]} />
          </View>
        )}

        {!passed && !isTheory && (
          <View style={[styles.retryHint, { backgroundColor: colors.secondary, borderRadius: colors.radius * 0.5 }]}>
            <Feather name="info" size={14} color={colors.mutedForeground} />
            <Text style={{ color: colors.subForeground, fontSize: fs(12) }}>
              Нужно {Math.ceil(total * 0.8)} из {total} правильных ответов
            </Text>
          </View>
        )}

        {/* Continue button */}
        <TouchableOpacity
          style={[styles.continueBtn, !btnReady && { opacity: 0.5 }]}
          onPress={onContinue}
          disabled={!btnReady}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={passed ? [colors.primary, colors.primary + "CC"] : [colors.amber, "#EF4444"]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={[styles.continueBtnInner, { borderRadius: colors.radius }]}
          >
            <Text style={[styles.continueBtnText, { fontSize: fs(16) }]}>
              {passed ? "Продолжить" : "Попробовать снова"}
            </Text>
            <Feather name={passed ? "arrow-right" : "refresh-cw"} size={18} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  card: {
    width: SW * 0.88,
    maxWidth: 390,
    borderWidth: 1,
    padding: 28,
    alignItems: "center",
    gap: 14,
  },
  mascotWrap: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 140,
    height: 140,
  },
  starsRing: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: 140,
    height: 140,
  },
  starRay: { position: "absolute" },
  title: {
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  starsRow: { flexDirection: "row", gap: 12, marginVertical: 2 },
  xpPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 13,
  },
  xpText: {
    color: "white",
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
  },
  alreadyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
  },
  alreadyText: { fontFamily: "Inter_500Medium" },
  accuracyBar: {
    width: "100%",
    height: 6,
    overflow: "hidden",
  },
  accuracyFill: { height: "100%" },
  retryHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    width: "100%",
  },
  continueBtn: { width: "100%", marginTop: 2 },
  continueBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
  },
  continueBtnText: {
    color: "white",
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
});
