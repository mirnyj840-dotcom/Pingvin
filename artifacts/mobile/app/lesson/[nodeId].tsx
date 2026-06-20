import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { fisherYatesShuffle } from "@/utils/shuffle";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  withDelay,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useApp } from "@/contexts/AppContext";
import { useTheme } from "@/hooks/useTheme";
import Mascot from "@/components/Mascot";
import GradientButton from "@/components/GradientButton";
import CelebrationOverlay from "@/components/CelebrationOverlay";
import StreakFireOverlay from "@/components/StreakFireOverlay";
import VideoPlayer from "@/components/VideoPlayer";
import { findNode } from "@/data/curriculum";
import type { LessonResult } from "@/contexts/AppContext";

type Screen = "intro" | "question" | "result";
const OPTION_LETTERS = ["A", "B", "C", "D", "E"];
const MAX_HEARTS = 3;

export default function LessonScreen() {
  const { nodeId } = useLocalSearchParams<{ nodeId: string }>();
  const { colors, fs } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { settings, userStats, completeNode } = useApp();

  const node = findNode(nodeId);

  const [screen, setScreen] = useState<Screen>("intro");
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [result, setResult] = useState<LessonResult | null>(null);
  const [showStreak, setShowStreak] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);

  const shakeAnim = useSharedValue(0);
  const progressAnim = useSharedValue(0);
  const heartScale = useSharedValue(1);

  const pt = insets.top + (Platform.OS === "web" ? 67 : 0);
  const pb = insets.bottom + (Platform.OS === "web" ? 34 : 0);

  const questions = node?.questions || [];
  const isTheory = node?.type === "theory";
  const currentQ = questions[questionIdx];
  const totalQ = questions.length;

  const shuffledOptionsByIdx = useMemo(
    () => questions.map((q) => fisherYatesShuffle(q.options)),
    [nodeId]
  );

  useEffect(() => {
    if (totalQ > 0) {
      progressAnim.value = withTiming(questionIdx / totalQ, {
        duration: 400,
        easing: Easing.out(Easing.quad),
      });
    }
  }, [questionIdx, totalQ]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressAnim.value * 100}%`,
  }));

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeAnim.value }],
  }));

  const heartAnim = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const shake = () => {
    shakeAnim.value = withSequence(
      withTiming(12, { duration: 55 }),
      withTiming(-12, { duration: 55 }),
      withTiming(10, { duration: 55 }),
      withTiming(-10, { duration: 55 }),
      withTiming(0, { duration: 55 })
    );
    heartScale.value = withSequence(
      withTiming(1.4, { duration: 120 }),
      withSpring(1, { damping: 8, stiffness: 200 })
    );
  };

  const resetQuiz = () => {
    setScreen("question");
    setQuestionIdx(0);
    setSelected(null);
    setConfirmed(false);
    setCorrectCount(0);
    setHearts(MAX_HEARTS);
    setResult(null);
    progressAnim.value = 0;
  };

  const handleCheck = async () => {
    if (!selected) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setConfirmed(true);
    const isCorrect = selected === currentQ.correct;
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
      if (Platform.OS !== "web")
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      setHearts((h) => Math.max(0, h - 1));
      if (Platform.OS !== "web")
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      shake();
    }
  };

  const handleNext = async () => {
    const isCorrect = selected === currentQ?.correct;
    const outOfHearts = hearts - (isCorrect ? 0 : 0) <= 0 && !isCorrect;

    if (outOfHearts) {
      // Force fail
      const res = await completeNode(nodeId, correctCount, totalQ);
      setResult({ ...res, passed: false });
      setScreen("result");
      return;
    }

    if (questionIdx < totalQ - 1) {
      setQuestionIdx((i) => i + 1);
      setSelected(null);
      setConfirmed(false);
      setHintVisible(false);
      setHintUsed(false);
    } else {
      const finalCorrect = correctCount + (isCorrect ? 1 : 0);
      const res = await completeNode(nodeId, finalCorrect, totalQ);
      setResult(res);
      setScreen("result");
    }
  };

  const handleFinishTheory = async () => {
    if (Platform.OS !== "web")
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const res = await completeNode(nodeId, 0, 0);
    setResult(res);
    setScreen("result");
  };

  const handleStartQuiz = () => {
    setScreen("question");
    progressAnim.value = 0;
  };

  const handleCelebrationContinue = () => {
    if (!result) return;
    if (!result.passed) {
      resetQuiz();
    } else if (result.isStreakDay && !result.alreadyDone) {
      setShowStreak(true);
    } else {
      router.back();
    }
  };

  if (!node) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.foreground, fontSize: fs(16), textAlign: "center", marginTop: 100 }}>
          Урок не найден
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Navbar */}
      <View style={[styles.navbar, { paddingTop: pt + 4, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.closeBtn, { backgroundColor: colors.secondary }]}>
          <Feather name="x" size={20} color={colors.subForeground} />
        </TouchableOpacity>

        {!isTheory && screen === "question" ? (
          <View style={{ flex: 1, gap: 6 }}>
            {/* Question dots */}
            <View style={styles.questionDots}>
              {questions.map((_, i) => (
                <View key={i} style={[styles.questionDot, {
                  backgroundColor: i < questionIdx ? colors.primary
                    : i === questionIdx ? colors.primary + "60"
                    : colors.track,
                  flex: 1,
                }]} />
              ))}
            </View>
          </View>
        ) : (
          <Text style={{ flex: 1, color: colors.subForeground, fontSize: fs(14), fontWeight: "600", textAlign: "center" }}>
            {node.label}
          </Text>
        )}

        {/* Hearts */}
        {!isTheory && screen === "question" && (
          <Animated.View style={[styles.heartsRow, heartAnim]}>
            {Array.from({ length: MAX_HEARTS }).map((_, i) => (
              <Text key={i} style={{ fontSize: 18, opacity: i < hearts ? 1 : 0.2 }}>❤️</Text>
            ))}
          </Animated.View>
        )}

        {isTheory && (
          <View style={{ width: 38 }} />
        )}
      </View>

      {screen === "intro" && isTheory && (
        <TheoryContent node={node} colors={colors} fs={fs} pb={pb} onFinish={handleFinishTheory} />
      )}

      {screen === "intro" && !isTheory && (
        <QuizIntro node={node} colors={colors} fs={fs} settings={settings} pb={pb} onStart={handleStartQuiz} />
      )}

      {screen === "question" && currentQ && (
        <Animated.View style={[styles.flex, shakeStyle]}>
          <ScrollView
            contentContainerStyle={[styles.questionContent, { paddingBottom: pb + 20 }]}
            showsVerticalScrollIndicator={false}
          >
            {/* Question number label */}
            <Text style={{ color: colors.mutedForeground, fontSize: fs(13), fontWeight: "500" }}>
              Вопрос {questionIdx + 1} из {totalQ}
            </Text>

            {/* Question card */}
            <View style={[styles.questionCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
              <Text style={{ color: colors.foreground, fontSize: fs(18), fontWeight: "700", fontFamily: "Inter_700Bold", lineHeight: fs(18) * 1.45 }}>
                {currentQ.text}
              </Text>
            </View>

            {/* Hint button */}
            {!confirmed && (
              <TouchableOpacity
                onPress={() => {
                  if (!hintUsed) {
                    setHintUsed(true);
                    if (Platform.OS !== "web")
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  setHintVisible((v) => !v);
                }}
                style={[styles.hintBtn, {
                  backgroundColor: hintUsed ? colors.amber + "14" : colors.secondary,
                  borderColor: hintUsed ? colors.amber + "50" : colors.border,
                }]}
              >
                <Text style={{ fontSize: 15 }}>💡</Text>
                <Text style={{ color: hintUsed ? colors.amber : colors.subForeground, fontSize: fs(13), fontWeight: "600" }}>
                  {hintVisible ? "Скрыть подсказку" : "Подсказка"}
                </Text>
                {!hintUsed && (
                  <View style={[styles.hintBadge, { backgroundColor: colors.amber + "20" }]}>
                    <Text style={{ color: colors.amber, fontSize: fs(10), fontWeight: "700" }}>БЕСПЛАТНО</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}

            {/* Hint banner */}
            {hintVisible && !confirmed && currentQ.explanation && (
              <HintBanner explanation={currentQ.explanation} colors={colors} fs={fs} />
            )}

            {/* Answer options with letter labels */}
            <View style={styles.optionsContainer}>
              {(shuffledOptionsByIdx[questionIdx] ?? currentQ.options).map((opt, oi) => {
                const isSelected = selected === opt;
                const isCorrect = opt === currentQ.correct;
                let borderColor = colors.border;
                let bg = colors.card;
                let textColor = colors.foreground;
                let letterBg = colors.secondary;
                let letterColor = colors.mutedForeground;

                if (confirmed) {
                  if (isCorrect) {
                    borderColor = colors.green;
                    bg = colors.green + "12";
                    textColor = colors.green;
                    letterBg = colors.green;
                    letterColor = "white";
                  } else if (isSelected) {
                    borderColor = colors.red;
                    bg = colors.red + "12";
                    textColor = colors.red;
                    letterBg = colors.red;
                    letterColor = "white";
                  }
                } else if (isSelected) {
                  borderColor = colors.primary;
                  bg = colors.primary + "12";
                  textColor = colors.primary;
                  letterBg = colors.primary;
                  letterColor = "white";
                }

                return (
                  <OptionButton
                    key={opt}
                    opt={opt}
                    letter={OPTION_LETTERS[oi]}
                    index={oi}
                    bg={bg}
                    borderColor={borderColor}
                    textColor={textColor}
                    letterBg={letterBg}
                    letterColor={letterColor}
                    confirmed={confirmed}
                    isCorrect={isCorrect}
                    isSelected={isSelected}
                    radius={colors.radius}
                    fs={fs}
                    onPress={() => {
                      if (confirmed) return;
                      if (Platform.OS !== "web")
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelected(opt);
                    }}
                  />
                );
              })}
            </View>

            {confirmed && currentQ.explanation && (
              <ExplanationCard
                explanation={currentQ.explanation}
                isCorrect={selected === currentQ.correct}
                colors={colors}
                fs={fs}
              />
            )}
          </ScrollView>

          <View style={[styles.actionBar, { paddingBottom: pb + 16 }]}>
            {!confirmed ? (
              <GradientButton
                label="Проверить"
                iconName="check"
                onPress={handleCheck}
                disabled={!selected}
              />
            ) : (
              <GradientButton
                label={questionIdx < totalQ - 1 ? "Следующий" : "Завершить"}
                iconName={questionIdx < totalQ - 1 ? "arrow-right" : "award"}
                onPress={handleNext}
                variant={selected === currentQ.correct ? "success" : "danger"}
              />
            )}
          </View>
        </Animated.View>
      )}

      {screen === "result" && result && !showStreak && (
        <CelebrationOverlay
          passed={result.passed}
          isTheory={isTheory}
          xpEarned={result.xpEarned}
          correct={result.correct}
          total={result.total}
          alreadyDone={result.alreadyDone}
          mascot={settings.mascot}
          onContinue={handleCelebrationContinue}
        />
      )}

      {showStreak && (
        <StreakFireOverlay streak={userStats.streak} onContinue={() => router.back()} />
      )}
    </View>
  );
}

// ─── OptionButton ───────────────────────────
function OptionButton({
  opt, letter, index, bg, borderColor, textColor, letterBg, letterColor,
  confirmed, isCorrect, isSelected, radius, fs, onPress,
}: {
  opt: string; letter: string; index: number;
  bg: string; borderColor: string; textColor: string;
  letterBg: string; letterColor: string;
  confirmed: boolean; isCorrect: boolean; isSelected: boolean;
  radius: number; fs: (n: number) => number;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(index * 70, withTiming(1, { duration: 220 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        onPress={() => {
          if (!confirmed) {
            scale.value = withSequence(
              withTiming(0.97, { duration: 70 }),
              withSpring(1, { damping: 10, stiffness: 220 })
            );
          }
          onPress();
        }}
        style={[styles.option, {
          backgroundColor: bg,
          borderColor,
          borderRadius: radius * 0.7,
          borderWidth: isSelected || (confirmed && isCorrect) ? 2.5 : 1.5,
        }]}
        activeOpacity={0.82}
      >
        {/* Letter badge */}
        <View style={[styles.letterBadge, { backgroundColor: letterBg, borderRadius: radius * 0.4 }]}>
          <Text style={{ color: letterColor, fontSize: fs(13), fontWeight: "800", fontFamily: "Inter_700Bold" }}>
            {letter}
          </Text>
        </View>
        <Text style={[styles.optionText, { color: textColor, fontSize: fs(15) }]}>{opt}</Text>
        {confirmed && isCorrect && (
          <Feather name="check-circle" size={20} color={borderColor} />
        )}
        {confirmed && isSelected && !isCorrect && (
          <Feather name="x-circle" size={20} color={borderColor} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── TheoryContent ───────────────────────────
function TheoryContent({
  node, colors, fs, pb, onFinish,
}: {
  node: ReturnType<typeof findNode>;
  colors: any; fs: (n: number) => number;
  pb: number; onFinish: () => void;
}) {
  if (!node) return null;
  const paragraphs = (node.theoryContent ?? "").split("\n\n").filter(Boolean);
  return (
    <>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={[styles.theoryContent, { paddingBottom: 20 }]} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <LinearGradient
          colors={[colors.primary, colors.primary + "99"]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={[styles.theoryBanner, { borderRadius: colors.radius }]}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: fs(11), fontWeight: "600", letterSpacing: 1, marginBottom: 4 }}>
              ТЕОРИЯ
            </Text>
            <Text style={{ color: "white", fontSize: fs(20), fontWeight: "800", fontFamily: "Inter_700Bold", lineHeight: fs(20) * 1.3 }}>
              {node.theoryTitle}
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: fs(12), marginTop: 6 }}>
              {node.xpReward} XP · {node.theoryKeyPoints?.length ?? 0} ключевых формул
            </Text>
          </View>
          <Feather name="book-open" size={40} color="rgba(255,255,255,0.2)" />
        </LinearGradient>

        <VideoPlayer videoUrl={node.videoUrl} title={node.theoryTitle} />

        {/* Theory paragraphs */}
        {paragraphs.map((para, i) => (
          <View key={i} style={[styles.theoryPara, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius * 0.7 }]}>
            <Text style={{ color: colors.subForeground, fontSize: fs(15), lineHeight: fs(15) * 1.75, fontFamily: "Inter_400Regular" }}>
              {para}
            </Text>
          </View>
        ))}

        {/* Key points */}
        {node.theoryKeyPoints && node.theoryKeyPoints.length > 0 && (
          <View style={[styles.keyPoints, { backgroundColor: colors.primary + "0C", borderColor: colors.primary + "30", borderRadius: colors.radius }]}>
            <View style={styles.keyPointsHeader}>
              <View style={[styles.keyPointsIconWrap, { backgroundColor: colors.primary + "20" }]}>
                <Feather name="zap" size={14} color={colors.primary} />
              </View>
              <Text style={{ color: colors.foreground, fontSize: fs(15), fontWeight: "700", fontFamily: "Inter_700Bold" }}>
                Ключевые формулы
              </Text>
            </View>
            {node.theoryKeyPoints.map((kp, i) => (
              <View key={i} style={styles.keyPointRow}>
                <View style={[styles.keyPointNum, { backgroundColor: colors.primary }]}>
                  <Text style={{ color: "white", fontSize: fs(11), fontWeight: "700" }}>{i + 1}</Text>
                </View>
                <Text style={{ flex: 1, color: colors.foreground, fontSize: fs(14), lineHeight: fs(14) * 1.55, fontFamily: "Inter_500Medium" }}>
                  {kp}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Tip */}
        <View style={[styles.tipCard, { backgroundColor: colors.amber + "12", borderColor: colors.amber + "30", borderRadius: colors.radius * 0.7 }]}>
          <Text style={{ fontSize: 20 }}>💡</Text>
          <Text style={{ flex: 1, color: colors.foreground, fontSize: fs(13), lineHeight: fs(13) * 1.55 }}>
            После изучения теории тебя ждёт квиз для закрепления материала!
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.actionBar, { paddingBottom: pb + 16 }]}>
        <GradientButton label="Понятно! Вперёд →" iconName="check" onPress={onFinish} />
      </View>
    </>
  );
}

// ─── QuizIntro ───────────────────────────
function QuizIntro({
  node, colors, fs, settings, pb, onStart,
}: {
  node: ReturnType<typeof findNode>;
  colors: any; fs: (n: number) => number;
  settings: { mascot: "penguin" | "raccoon" | "bear" };
  pb: number; onStart: () => void;
}) {
  if (!node) return null;

  const mascotScale = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const bossGlow = useSharedValue(1);
  const warningShake = useSharedValue(0);

  useEffect(() => {
    mascotScale.value = withSpring(1, { damping: 10, stiffness: 160 });
    contentOpacity.value = withDelay(200, withTiming(1, { duration: 350 }));

    if (node.type === "boss") {
      // Pulsing glow
      bossGlow.value = withDelay(
        600,
        withRepeat(
          withSequence(
            withTiming(1.08, { duration: 900, easing: Easing.inOut(Easing.sin) }),
            withTiming(1, { duration: 900, easing: Easing.inOut(Easing.sin) })
          ),
          -1
        )
      );
      // Warning text shake
      warningShake.value = withDelay(
        800,
        withRepeat(
          withSequence(
            withTiming(-3, { duration: 80 }),
            withTiming(3, { duration: 80 }),
            withTiming(0, { duration: 80 })
          ),
          3
        )
      );
    }
  }, []);

  const mascotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: mascotScale.value * (node.type === "boss" ? bossGlow.value : 1) }],
  }));
  const contentStyle = useAnimatedStyle(() => ({ opacity: contentOpacity.value }));
  const warningStyle = useAnimatedStyle(() => ({ transform: [{ translateX: warningShake.value }] }));

  const isBoss = node.type === "boss";
  const typeLabel =
    isBoss ? "Босс-битва! ⚔️"
    : node.type === "practice" ? "Практика 🧮"
    : "Мини-квиз 📝";
  const typeDesc =
    isBoss
      ? "Финальное испытание! Используй всё, что узнал. 80%+ для победы."
      : "Нужно правильно ответить на 80% вопросов, чтобы пройти";

  return (
    <View style={[styles.flex, styles.introContent]}>
      {/* Boss danger banner */}
      {isBoss && (
        <Animated.View style={[warningStyle, {
          backgroundColor: colors.red + "18",
          borderColor: colors.red + "40",
          borderWidth: 1.5,
          borderRadius: 14,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          paddingHorizontal: 16,
          paddingVertical: 10,
          alignSelf: "stretch",
        }]}>
          <Text style={{ fontSize: 18 }}>⚠️</Text>
          <Text style={{ color: colors.red, fontSize: fs(13), fontWeight: "700", flex: 1 }}>
            Это испытание сложнее обычного. Удачи!
          </Text>
        </Animated.View>
      )}

      <Animated.View style={mascotStyle}>
        <Mascot type={settings.mascot} size={isBoss ? 140 : 130} mode="idle" />
      </Animated.View>

      <Animated.View style={[{ width: "100%", gap: 16, alignItems: "center" }, contentStyle]}>
        <Text style={{
          color: isBoss ? colors.red : colors.primary,
          fontSize: fs(24), fontWeight: "800", fontFamily: "Inter_700Bold",
          textAlign: "center",
        }}>
          {typeLabel}
        </Text>
        <Text style={{ color: colors.subForeground, fontSize: fs(15), textAlign: "center", lineHeight: fs(15) * 1.55 }}>
          {typeDesc}
        </Text>

        {/* Stats row */}
        <View style={[styles.introStats, {
          backgroundColor: isBoss ? colors.red + "10" : colors.card,
          borderColor: isBoss ? colors.red + "30" : colors.border,
          borderRadius: colors.radius,
        }]}>
          {[
            { icon: "help-circle" as const, value: String((node.questions || []).length), label: "вопросов", color: isBoss ? colors.red : colors.primary },
            { icon: "zap" as const, value: String(node.xpReward), label: "XP", color: colors.amber },
            { icon: "heart" as const, value: String(MAX_HEARTS), label: "жизней", color: colors.red },
            { icon: "target" as const, value: "80%", label: "для прохода", color: colors.green },
          ].map((s, i, arr) => (
            <React.Fragment key={s.label}>
              <View style={styles.introStat}>
                <Feather name={s.icon} size={18} color={s.color} />
                <Text style={{ color: colors.foreground, fontSize: fs(18), fontWeight: "800" }}>{s.value}</Text>
                <Text style={{ color: colors.subForeground, fontSize: fs(11) }}>{s.label}</Text>
              </View>
              {i < arr.length - 1 && <View style={[styles.introStatDivider, { backgroundColor: colors.border }]} />}
            </React.Fragment>
          ))}
        </View>

        <View style={[styles.actionBar, { paddingBottom: pb + 16, width: "100%" }]}>
          <GradientButton
            label={isBoss ? "Принять вызов! ⚔️" : "Начать!"}
            iconName={isBoss ? "zap" : "play"}
            onPress={onStart}
            variant={isBoss ? "danger" : "primary"}
          />
        </View>
      </Animated.View>
    </View>
  );
}

// ─── HintBanner ───────────────────────────
function HintBanner({
  explanation, colors, fs,
}: {
  explanation: string; colors: any; fs: (n: number) => number;
}) {
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 220 });
    opacity.value = withTiming(1, { duration: 180 });
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  // Show only first sentence or up to 80 chars
  const hintText = (() => {
    const firstSentence = explanation.split(/[.!?]/)[0].trim();
    return firstSentence.length > 80 ? firstSentence.slice(0, 78) + "…" : firstSentence;
  })();

  return (
    <Animated.View style={style}>
      <View style={[styles.hintBanner, { backgroundColor: colors.amber + "14", borderColor: colors.amber + "40" }]}>
        <View style={[styles.hintBannerIcon, { backgroundColor: colors.amber + "30" }]}>
          <Text style={{ fontSize: 16 }}>💡</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.amber, fontSize: fs(11), fontWeight: "700", marginBottom: 3 }}>
            ПОДСКАЗКА
          </Text>
          <Text style={{ color: colors.foreground, fontSize: fs(13), lineHeight: fs(13) * 1.5 }}>
            {hintText}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

// ─── ExplanationCard ───────────────────────────
function ExplanationCard({
  explanation, isCorrect, colors, fs,
}: {
  explanation: string; isCorrect: boolean;
  colors: any; fs: (n: number) => number;
}) {
  const scale = useSharedValue(0.88);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    opacity.value = withTiming(1, { duration: 200 });
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={style}>
      <View style={[styles.explanation, {
        backgroundColor: isCorrect ? colors.green + "12" : colors.red + "12",
        borderColor: isCorrect ? colors.green + "40" : colors.red + "40",
        borderRadius: colors.radius * 0.7,
      }]}>
        <View style={[styles.explanationIcon, {
          backgroundColor: isCorrect ? colors.green + "25" : colors.red + "25",
        }]}>
          <Feather name={isCorrect ? "check" : "info"} size={14} color={isCorrect ? colors.green : colors.red} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: isCorrect ? colors.green : colors.red, fontSize: fs(12), fontWeight: "700", marginBottom: 2 }}>
            {isCorrect ? "Правильно! 🎉" : "Не совсем..."}
          </Text>
          <Text style={{ color: colors.foreground, fontSize: fs(13), lineHeight: fs(13) * 1.55 }}>
            {explanation}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },

  navbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: "center", justifyContent: "center",
  },
  questionDots: { flexDirection: "row", gap: 4, height: 6 },
  questionDot: { height: 6, borderRadius: 3 },
  heartsRow: { flexDirection: "row", gap: 2 },

  // Theory
  theoryContent: { paddingHorizontal: 20, gap: 14, paddingTop: 8 },
  theoryBanner: {
    flexDirection: "row", alignItems: "center",
    gap: 12, padding: 20,
  },
  theoryPara: { padding: 16, borderWidth: 1 },
  keyPoints: { padding: 16, borderWidth: 1, gap: 12 },
  keyPointsHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 2 },
  keyPointsIconWrap: { width: 28, height: 28, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  keyPointRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  keyPointNum: {
    width: 22, height: 22, borderRadius: 11,
    alignItems: "center", justifyContent: "center",
    marginTop: 2, flexShrink: 0,
  },
  tipCard: { flexDirection: "row", alignItems: "flex-start", gap: 10, padding: 14, borderWidth: 1 },

  // Quiz intro
  introContent: { alignItems: "center", paddingHorizontal: 24, paddingTop: 24, gap: 20 },
  introStats: {
    flexDirection: "row", width: "100%",
    padding: 16, borderWidth: 1, gap: 0,
  },
  introStat: { flex: 1, alignItems: "center", gap: 4 },
  introStatDivider: { width: 1, marginVertical: 4 },

  // Questions
  questionContent: { paddingHorizontal: 20, gap: 16, paddingTop: 8 },
  questionCard: { padding: 20, borderWidth: 1 },
  optionsContainer: { gap: 10 },
  option: {
    flexDirection: "row", alignItems: "center",
    gap: 12, padding: 14,
  },
  letterBadge: {
    width: 32, height: 32,
    alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  optionText: { flex: 1, fontWeight: "600", fontFamily: "Inter_600SemiBold" },

  // Explanation
  explanation: { flexDirection: "row", gap: 12, padding: 14, borderWidth: 1 },
  explanationIcon: {
    width: 30, height: 30, borderRadius: 15,
    alignItems: "center", justifyContent: "center",
    flexShrink: 0, marginTop: 2,
  },

  // Action bar
  actionBar: { paddingHorizontal: 20, paddingTop: 12 },

  // Hint
  hintBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 12, borderWidth: 1.5,
    alignSelf: "flex-start",
  },
  hintBadge: {
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6,
  },
  hintBanner: {
    flexDirection: "row", alignItems: "flex-start", gap: 12,
    padding: 14, borderWidth: 1.5, borderRadius: 14,
  },
  hintBannerIcon: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
});
