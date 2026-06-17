import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated as RNAnimated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useApp } from "@/contexts/AppContext";
import { useAppColors } from "@/hooks/useAppColors";
import Mascot from "@/components/Mascot";
import GradientButton from "@/components/GradientButton";
import { findNode } from "@/data/curriculum";
import type { LessonResult } from "@/contexts/AppContext";

type Screen = "intro" | "question" | "result";

export default function LessonScreen() {
  const { nodeId } = useLocalSearchParams<{ nodeId: string }>();
  const colors = useAppColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { settings, completeNode, nodeStatus } = useApp();

  const node = findNode(nodeId);
  const [screen, setScreen] = useState<Screen>("intro");
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [result, setResult] = useState<LessonResult | null>(null);
  const shakeAnim = useRef(new RNAnimated.Value(0)).current;

  const pt = insets.top + (Platform.OS === "web" ? 67 : 0);
  const pb = insets.bottom + (Platform.OS === "web" ? 34 : 0);

  if (!node) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.foreground }]}>
          Урок не найден
        </Text>
      </View>
    );
  }

  const questions = node.questions || [];
  const isTheory = node.type === "theory";
  const currentQ = questions[questionIdx];
  const totalQ = questions.length;
  const progress = totalQ > 0 ? (questionIdx + 1) / totalQ : 0;

  const shake = () => {
    RNAnimated.sequence([
      RNAnimated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      RNAnimated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      RNAnimated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      RNAnimated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleCheck = async () => {
    if (!selected) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setConfirmed(true);
    if (selected === currentQ.correct) {
      setCorrectCount((c) => c + 1);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      shake();
    }
  };

  const handleNext = async () => {
    if (questionIdx < totalQ - 1) {
      setQuestionIdx((i) => i + 1);
      setSelected(null);
      setConfirmed(false);
    } else {
      const res = await completeNode(nodeId, correctCount + (selected === currentQ.correct ? 1 : 0), totalQ);
      setResult(res);
      setScreen("result");
    }
  };

  const handleFinishTheory = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const res = await completeNode(nodeId, 0, 0);
    setResult(res);
    setScreen("result");
  };

  const handleStartQuiz = () => {
    setScreen("question");
  };

  if (screen === "result" && result) {
    return (
      <ResultScreen
        node={node}
        result={result}
        colors={colors}
        settings={settings}
        pt={pt}
        pb={pb}
        onClose={() => router.back()}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Navbar */}
      <View style={[styles.navbar, { paddingTop: pt + 4 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Feather name="x" size={22} color={colors.subForeground} />
        </TouchableOpacity>
        {!isTheory && screen === "question" && (
          <View style={[styles.progressBar, { backgroundColor: colors.track }]}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: colors.primary, width: `${progress * 100}%` },
              ]}
            />
          </View>
        )}
        <Text style={[styles.nodeLabel, { color: colors.subForeground }]}>
          {node.label}
        </Text>
      </View>

      {screen === "intro" && isTheory && (
        <TheoryContent
          node={node}
          colors={colors}
          pb={pb}
          onFinish={handleFinishTheory}
        />
      )}

      {screen === "intro" && !isTheory && (
        <QuizIntro
          node={node}
          colors={colors}
          settings={settings}
          pb={pb}
          onStart={handleStartQuiz}
        />
      )}

      {screen === "question" && currentQ && (
        <RNAnimated.View
          style={[styles.flex, { transform: [{ translateX: shakeAnim }] }]}
        >
          <ScrollView
            contentContainerStyle={[styles.questionContent, { paddingBottom: pb + 20 }]}
            showsVerticalScrollIndicator={false}
          >
            <Text style={[styles.questionCounter, { color: colors.subForeground }]}>
              Вопрос {questionIdx + 1} из {totalQ}
            </Text>
            <Text style={[styles.questionText, { color: colors.foreground }]}>
              {currentQ.text}
            </Text>

            <View style={styles.optionsContainer}>
              {currentQ.options.map((opt) => {
                const isSelected = selected === opt;
                const isCorrect = opt === currentQ.correct;
                let borderColor = colors.border;
                let bg = colors.card;
                let textColor = colors.foreground;

                if (confirmed) {
                  if (isCorrect) {
                    borderColor = colors.green;
                    bg = colors.green + "15";
                    textColor = colors.green;
                  } else if (isSelected) {
                    borderColor = colors.red;
                    bg = colors.red + "15";
                    textColor = colors.red;
                  }
                } else if (isSelected) {
                  borderColor = colors.primary;
                  bg = colors.primary + "15";
                  textColor = colors.primary;
                }

                return (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => {
                      if (confirmed) return;
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelected(opt);
                    }}
                    style={[
                      styles.option,
                      { backgroundColor: bg, borderColor, borderWidth: isSelected || (confirmed && isCorrect) ? 2 : 1.5 },
                    ]}
                  >
                    <Text style={[styles.optionText, { color: textColor }]}>{opt}</Text>
                    {confirmed && isCorrect && (
                      <Feather name="check-circle" size={18} color={colors.green} />
                    )}
                    {confirmed && isSelected && !isCorrect && (
                      <Feather name="x-circle" size={18} color={colors.red} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {confirmed && currentQ.explanation && (
              <View
                style={[
                  styles.explanation,
                  {
                    backgroundColor:
                      selected === currentQ.correct
                        ? colors.green + "15"
                        : colors.red + "15",
                    borderColor:
                      selected === currentQ.correct ? colors.green : colors.red,
                  },
                ]}
              >
                <Feather
                  name="info"
                  size={14}
                  color={
                    selected === currentQ.correct ? colors.green : colors.red
                  }
                />
                <Text
                  style={[
                    styles.explanationText,
                    {
                      color:
                        selected === currentQ.correct ? colors.green : colors.red,
                    },
                  ]}
                >
                  {currentQ.explanation}
                </Text>
              </View>
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
                label={questionIdx < totalQ - 1 ? "Далее" : "Завершить"}
                iconName={questionIdx < totalQ - 1 ? "arrow-right" : "award"}
                onPress={handleNext}
                variant={selected === currentQ.correct ? "success" : "danger"}
              />
            )}
          </View>
        </RNAnimated.View>
      )}
    </View>
  );
}

function TheoryContent({
  node,
  colors,
  pb,
  onFinish,
}: {
  node: ReturnType<typeof findNode>;
  colors: ReturnType<typeof useAppColors>;
  pb: number;
  onFinish: () => void;
}) {
  if (!node) return null;
  return (
    <>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.theoryContent, { paddingBottom: 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[colors.primary, colors.primary + "88"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.theoryBanner, { borderRadius: colors.radius }]}
        >
          <Feather name="book-open" size={28} color="white" />
          <Text style={styles.theoryBannerTitle}>{node.theoryTitle}</Text>
        </LinearGradient>

        <Text style={[styles.theoryText, { color: colors.subForeground }]}>
          {node.theoryContent}
        </Text>

        {node.theoryKeyPoints && node.theoryKeyPoints.length > 0 && (
          <View
            style={[
              styles.keyPoints,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.keyPointsTitle, { color: colors.foreground }]}>
              Ключевые формулы
            </Text>
            {node.theoryKeyPoints.map((kp, i) => (
              <View key={i} style={styles.keyPointRow}>
                <View
                  style={[styles.keyPointDot, { backgroundColor: colors.primary }]}
                />
                <Text style={[styles.keyPointText, { color: colors.subForeground }]}>
                  {kp}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={[styles.actionBar, { paddingBottom: pb + 16 }]}>
        <GradientButton label="Понятно!" iconName="check" onPress={onFinish} />
      </View>
    </>
  );
}

function QuizIntro({
  node,
  colors,
  settings,
  pb,
  onStart,
}: {
  node: ReturnType<typeof findNode>;
  colors: ReturnType<typeof useAppColors>;
  settings: { mascot: MascotType };
  pb: number;
  onStart: () => void;
}) {
  if (!node) return null;
  const typeLabel =
    node.type === "boss"
      ? "Босс-битва!"
      : node.type === "practice"
      ? "Практика"
      : "Мини-квиз";
  const typeDesc =
    node.type === "boss"
      ? "Финальное испытание главы. Только лучшие проходят дальше!"
      : "Ответь правильно на вопросы и заработай XP";

  return (
    <View style={[styles.flex, styles.introContent]}>
      <Mascot type={settings.mascot} size={120} animated />
      <Text style={[styles.introType, { color: colors.primary }]}>
        {typeLabel}
      </Text>
      <Text style={[styles.introDesc, { color: colors.subForeground }]}>
        {typeDesc}
      </Text>
      <View
        style={[
          styles.introStats,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={styles.introStat}>
          <Feather name="help-circle" size={18} color={colors.primary} />
          <Text style={[styles.introStatValue, { color: colors.foreground }]}>
            {(node.questions || []).length}
          </Text>
          <Text style={[styles.introStatLabel, { color: colors.subForeground }]}>
            вопросов
          </Text>
        </View>
        <View style={[styles.introStatDivider, { backgroundColor: colors.border }]} />
        <View style={styles.introStat}>
          <Feather name="zap" size={18} color={colors.amber} />
          <Text style={[styles.introStatValue, { color: colors.foreground }]}>
            {node.xpReward}
          </Text>
          <Text style={[styles.introStatLabel, { color: colors.subForeground }]}>
            XP
          </Text>
        </View>
        <View style={[styles.introStatDivider, { backgroundColor: colors.border }]} />
        <View style={styles.introStat}>
          <Feather name="target" size={18} color={colors.green} />
          <Text style={[styles.introStatValue, { color: colors.foreground }]}>
            60%
          </Text>
          <Text style={[styles.introStatLabel, { color: colors.subForeground }]}>
            чтобы пройти
          </Text>
        </View>
      </View>
      <View style={[styles.actionBar, { paddingBottom: pb + 16 }]}>
        <GradientButton
          label="Начать"
          iconName="play"
          onPress={onStart}
          variant={node.type === "boss" ? "danger" : "primary"}
        />
      </View>
    </View>
  );
}

function ResultScreen({
  node,
  result,
  colors,
  settings,
  pt,
  pb,
  onClose,
}: {
  node: ReturnType<typeof findNode>;
  result: LessonResult;
  colors: ReturnType<typeof useAppColors>;
  settings: { mascot: MascotType };
  pt: number;
  pb: number;
  onClose: () => void;
}) {
  if (!node) return null;
  const isPassed = result.passed;
  const isTheory = node.type === "theory";

  const title = isTheory
    ? "Отличная работа!"
    : isPassed
    ? "Пройдено!"
    : "Почти!";
  const subtitle = isTheory
    ? "Теория усвоена. Продолжай!"
    : isPassed
    ? `${result.correct} из ${result.total} правильно`
    : `${result.correct} из ${result.total} — попробуй ещё`;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.resultContent, { paddingTop: pt + 20, paddingBottom: pb + 20 }]}>
        <Mascot type={settings.mascot} size={120} animated />

        <View
          style={[
            styles.resultBadge,
            {
              backgroundColor: isPassed
                ? colors.green + "15"
                : colors.amber + "15",
              borderColor: isPassed ? colors.green + "35" : colors.amber + "35",
            },
          ]}
        >
          <Feather
            name={isPassed ? "check-circle" : "alert-circle"}
            size={28}
            color={isPassed ? colors.green : colors.amber}
          />
          <Text
            style={[
              styles.resultTitle,
              { color: isPassed ? colors.green : colors.amber },
            ]}
          >
            {title}
          </Text>
          <Text
            style={[styles.resultSubtitle, { color: colors.subForeground }]}
          >
            {subtitle}
          </Text>
        </View>

        {!result.alreadyDone && result.xpEarned > 0 && (
          <View
            style={[
              styles.xpEarned,
              { backgroundColor: colors.primary + "15", borderColor: colors.primary + "30" },
            ]}
          >
            <Feather name="zap" size={20} color={colors.primary} />
            <Text style={[styles.xpEarnedText, { color: colors.primary }]}>
              +{result.xpEarned} XP
            </Text>
          </View>
        )}

        <View style={{ width: "100%", marginTop: "auto" }}>
          <GradientButton
            label="Назад к пути"
            iconName="map"
            onPress={onClose}
            variant={isPassed ? "success" : "primary"}
          />
        </View>
      </View>
    </View>
  );
}

type MascotType = "penguin" | "raccoon" | "bear";

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 4 },
  nodeLabel: { fontSize: 13, fontWeight: "600" },
  errorText: { fontSize: 16, textAlign: "center", marginTop: 100 },
  theoryContent: {
    paddingHorizontal: 20,
    gap: 16,
    paddingTop: 8,
  },
  theoryBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 18,
  },
  theoryBannerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    flex: 1,
    fontFamily: "Inter_700Bold",
  },
  theoryText: {
    fontSize: 16,
    lineHeight: 26,
    fontFamily: "Inter_400Regular",
  },
  keyPoints: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  keyPointsTitle: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    marginBottom: 2,
  },
  keyPointRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  keyPointDot: { width: 6, height: 6, borderRadius: 3, marginTop: 7 },
  keyPointText: { flex: 1, fontSize: 14, lineHeight: 20 },
  questionContent: {
    paddingHorizontal: 20,
    gap: 16,
    paddingTop: 8,
  },
  questionCounter: { fontSize: 13 },
  questionText: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 28,
    fontFamily: "Inter_700Bold",
  },
  optionsContainer: { gap: 10 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 14,
    gap: 10,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Inter_500Medium",
  },
  explanation: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  explanationText: { flex: 1, fontSize: 14, lineHeight: 20 },
  actionBar: { paddingHorizontal: 20, paddingTop: 12 },
  introContent: {
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 16,
    paddingTop: 20,
  },
  introType: {
    fontSize: 28,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  introDesc: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  introStats: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    width: "100%",
    justifyContent: "space-around",
    marginTop: 8,
  },
  introStat: { alignItems: "center", gap: 4 },
  introStatValue: {
    fontSize: 20,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
  },
  introStatLabel: { fontSize: 12 },
  introStatDivider: { width: 1, alignSelf: "stretch" },
  resultContent: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 20,
  },
  resultBadge: {
    width: "100%",
    alignItems: "center",
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
  },
  resultTitle: {
    fontSize: 26,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
  },
  resultSubtitle: { fontSize: 16 },
  xpEarned: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 40,
    borderWidth: 1,
  },
  xpEarnedText: {
    fontSize: 22,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
  },
});
