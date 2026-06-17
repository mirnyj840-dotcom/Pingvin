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
import type { MascotType } from "@/contexts/AppContext";

const { width: SW, height: SH } = Dimensions.get("window");

const CONFETTI_COLORS = [
  "#6366F1", "#8B5CF6", "#EC4899", "#F59E0B",
  "#10B981", "#3B82F6", "#EF4444", "#F97316",
  "#06B6D4", "#A3E635", "#FBBF24", "#C084FC",
];

const CONFETTI_COUNT = 40;

const PARTICLES = Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
  id: i,
  x: (i / CONFETTI_COUNT) * SW + (Math.sin(i * 2.3) * 30),
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  w: 6 + ((i * 7) % 10),
  h: 4 + ((i * 5) % 8),
  delay: (i % 10) * 80,
  duration: 1800 + ((i * 137) % 1200),
  rotDeg: 180 + ((i * 113) % 360),
  xDrift: ((i % 2 === 0 ? 1 : -1)) * (20 + ((i * 31) % 80)),
  isCircle: i % 5 === 0,
}));

function ConfettiParticle({
  x, color, w, h, delay, duration, rotDeg, xDrift, isCircle,
}: typeof PARTICLES[0]) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, { duration, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  const style = useAnimatedStyle(() => {
    const ty = interpolate(progress.value, [0, 1], [-80, SH + 80]);
    const tx = interpolate(progress.value, [0, 1], [0, xDrift]);
    const rot = interpolate(progress.value, [0, 1], [0, rotDeg]);
    const opacity = interpolate(progress.value, [0, 0.65, 1], [1, 1, 0]);
    const scale = interpolate(progress.value, [0, 0.1, 1], [0, 1, 0.8]);
    return {
      transform: [
        { translateX: tx },
        { translateY: ty },
        { rotate: `${rot}deg` },
        { scale },
      ],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: x,
          top: 0,
          width: isCircle ? w : w,
          height: isCircle ? w : h,
          borderRadius: isCircle ? w / 2 : 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

function StarRay({ angle, delay }: { angle: number; delay: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withSequence(
        withTiming(1, { duration: 400, easing: Easing.out(Easing.back(1.2)) }),
        withTiming(0, { duration: 300, easing: Easing.in(Easing.quad) })
      )
    );
  }, []);

  const style = useAnimatedStyle(() => {
    const dist = interpolate(progress.value, [0, 1], [20, 90]);
    const opacity = interpolate(progress.value, [0, 0.3, 1], [0, 1, 0]);
    const rad = (angle * Math.PI) / 180;
    return {
      transform: [
        { translateX: Math.cos(rad) * dist },
        { translateY: Math.sin(rad) * dist },
      ],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.starRay, style]}>
      <Feather name="star" size={12} color="#FBBF24" />
    </Animated.View>
  );
}

function AnimatedStar({ index, lit }: { index: number; lit: boolean }) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      400 + index * 120,
      withSpring(lit ? 1 : 0.6, { damping: 8, stiffness: 200 })
    );
    opacity.value = withDelay(
      400 + index * 120,
      withTiming(1, { duration: 300 })
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={style}>
      <Feather name="star" size={32} color={lit ? "#FBBF24" : "#374151"} />
    </Animated.View>
  );
}

interface CelebrationOverlayProps {
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
  passed,
  isTheory,
  xpEarned,
  correct,
  total,
  alreadyDone,
  mascot,
  onContinue,
}: CelebrationOverlayProps) {
  const [displayXp, setDisplayXp] = useState(0);
  const [btnReady, setBtnReady] = useState(false);

  const overlayOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.5);
  const cardOpacity = useSharedValue(0);
  const mascotScale = useSharedValue(0);
  const titleScale = useSharedValue(0);
  const xpPillScale = useSharedValue(0);
  const mascotBounce = useSharedValue(0);

  useEffect(() => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(
        passed
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Warning
      );
    }

    overlayOpacity.value = withTiming(1, { duration: 250 });
    cardScale.value = withDelay(100, withSpring(1, { damping: 14, stiffness: 180 }));
    cardOpacity.value = withDelay(100, withTiming(1, { duration: 250 }));
    mascotScale.value = withDelay(200, withSpring(1, { damping: 10, stiffness: 200 }));
    titleScale.value = withDelay(350, withSpring(1, { damping: 12, stiffness: 220 }));

    mascotBounce.value = withDelay(
      600,
      withRepeat(
        withSequence(
          withTiming(-14, { duration: 300, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 300, easing: Easing.in(Easing.quad) })
        ),
        3
      )
    );

    if (xpEarned > 0) {
      xpPillScale.value = withDelay(500, withSpring(1, { damping: 10, stiffness: 200 }));
      let start: number | null = null;
      const DURATION = 1200;
      const DELAY = 600;
      const tick = (ts: number) => {
        if (!start) start = ts;
        const elapsed = ts - start;
        const p = Math.min(elapsed / DURATION, 1);
        setDisplayXp(Math.round(p * xpEarned));
        if (p < 1) requestAnimationFrame(tick);
        else setBtnReady(true);
      };
      setTimeout(() => requestAnimationFrame(tick), DELAY);
    } else {
      xpPillScale.value = withDelay(500, withSpring(1, { damping: 10, stiffness: 200 }));
      setTimeout(() => setBtnReady(true), 800);
    }
  }, []);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlayOpacity.value }));
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));
  const mascotStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: mascotScale.value },
      { translateY: mascotBounce.value },
    ],
  }));
  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
  }));
  const xpPillStyle = useAnimatedStyle(() => ({
    transform: [{ scale: xpPillScale.value }],
  }));

  const title = isTheory
    ? "Материал изучен!"
    : passed
    ? "Пройдено! 🎉"
    : "Почти получилось!";

  const subtitle = isTheory
    ? "Теория усвоена. Так держать!"
    : passed
    ? total > 0
      ? `${correct} из ${total} правильно`
      : "Отличная работа!"
    : `${correct} из ${total} — попробуй ещё раз`;

  const accuracy = total > 0 ? correct / total : 1;
  const stars = isTheory ? 3 : accuracy >= 1 ? 3 : accuracy >= 0.7 ? 2 : 1;

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, overlayStyle]}>
      {passed && (
        <View style={[StyleSheet.absoluteFill, { pointerEvents: "none" } as any]}>
          {PARTICLES.map((p) => (
            <ConfettiParticle key={p.id} {...p} />
          ))}
        </View>
      )}

      <Animated.View style={[styles.card, cardStyle]}>
        <View style={styles.mascotWrap}>
          <Animated.View style={mascotStyle}>
            <Mascot type={mascot} size={110} animated />
          </Animated.View>
          {passed && (
            <View style={[styles.starsRing, { pointerEvents: "none" } as any]}>
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <StarRay key={angle} angle={angle} delay={300 + i * 40} />
              ))}
            </View>
          )}
        </View>

        <Animated.View style={titleStyle}>
          <Text
            style={[
              styles.title,
              { color: passed ? "#A78BFA" : "#FBBF24" },
            ]}
          >
            {title}
          </Text>
        </Animated.View>

        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.starsRow}>
          {[1, 2, 3].map((s) => (
            <AnimatedStar key={s} index={s} lit={s <= stars} />
          ))}
        </View>

        {!alreadyDone && xpEarned > 0 && (
          <Animated.View style={xpPillStyle}>
            <LinearGradient
              colors={["#6366F1", "#8B5CF6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.xpPill}
            >
              <Feather name="zap" size={18} color="white" />
              <Text style={styles.xpText}>+{displayXp} XP</Text>
            </LinearGradient>
          </Animated.View>
        )}

        {alreadyDone && (
          <View style={styles.alreadyBadge}>
            <Feather name="check-circle" size={14} color="#6366F1" />
            <Text style={styles.alreadyText}>Уже пройдено</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.continueBtn, !btnReady && { opacity: 0.6 }]}
          onPress={onContinue}
          disabled={!btnReady}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={passed ? ["#6366F1", "#8B5CF6"] : ["#F59E0B", "#EF4444"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueBtnInner}
          >
            <Text style={styles.continueBtnText}>
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
    backgroundColor: "rgba(5,5,15,0.94)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  card: {
    width: SW * 0.88,
    maxWidth: 380,
    backgroundColor: "#13132A",
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: "#1E1E40",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 16,
  },
  mascotWrap: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 120,
    height: 120,
  },
  starsRing: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: 120,
    height: 120,
  },
  starRay: {
    position: "absolute",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#94A3B8",
    textAlign: "center",
    fontFamily: "Inter_400Regular",
  },
  starsRow: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 4,
  },
  xpPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 50,
  },
  xpText: {
    color: "white",
    fontSize: 22,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
  },
  alreadyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#6366F115",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#6366F130",
  },
  alreadyText: {
    fontSize: 13,
    color: "#6366F1",
    fontFamily: "Inter_500Medium",
  },
  continueBtn: {
    width: "100%",
    marginTop: 4,
  },
  continueBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
  },
  continueBtnText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
});
