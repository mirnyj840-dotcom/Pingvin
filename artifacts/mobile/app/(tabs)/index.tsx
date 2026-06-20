import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useApp } from "@/contexts/AppContext";
import { useTheme } from "@/hooks/useTheme";
import Mascot from "@/components/Mascot";
import StatPill from "@/components/StatPill";
import { chapters, findNode } from "@/data/curriculum";

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const DAILY_MESSAGES = [
  "Один урок в день — и ОГЭ будет сдан!",
  "Давай покорим новую тему вместе!",
  "Ты молодец, продолжай в том же духе!",
  "Знания — твоё главное оружие на экзамене!",
  "Сегодня ты на шаг ближе к пятёрке!",
  "Повторение — мать учения. Вперёд!",
  "Каждый правильный ответ — это победа!",
  "Не останавливайся, ты делаешь отлично!",
  "Математика — это логика, и у тебя она есть!",
  "Сложности временны, а знания навсегда!",
  "Твой мозг сейчас растёт — буквально!",
  "Маленький шаг сегодня — большой результат в июне!",
];

const TYPE_LABEL: Record<string, string> = {
  theory: "Теория",
  miniQuiz: "Мини-квиз",
  practice: "Практика",
  boss: "Босс",
};
const TYPE_ICON: Record<string, keyof typeof Feather.glyphMap> = {
  theory: "book-open",
  miniQuiz: "edit-3",
  practice: "cpu",
  boss: "zap",
};
const LEAGUE_NAMES = ["Бронза", "Серебро", "Золото", "Платина", "Алмаз"];
const LEAGUE_COLORS = ["#CD7F32", "#C0C0C0", "#FFD700", "#E5E4E2", "#B9F2FF"];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Доброе утро";
  if (h < 18) return "Добрый день";
  return "Добрый вечер";
}

function getDailyMessage(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return DAILY_MESSAGES[dayOfYear % DAILY_MESSAGES.length];
}

export default function HomeScreen() {
  const { colors, fs } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { userStats, settings, weekStreak, nextLessonId } = useApp();

  const streak = weekStreak();
  const nextId = nextLessonId();
  const nextNode = nextId ? findNode(nextId) : null;
  const level = Math.floor(userStats.xp / 100) + 1;
  const xpInLevel = userStats.xp % 100;
  const xpToNext = 100 - xpInLevel;
  const xpProgress = xpInLevel / 100;
  const goal = settings.dailyXpGoal ?? 50;
  const dailyProgress = Math.min(userStats.dailyXp / goal, 1);
  const greeting = getGreeting();
  const message = getDailyMessage();
  const completedChapters = chapters.filter((ch) =>
    ch.nodes.every((n) => userStats.completedNodeIds.includes(n.id))
  ).length;
  const todayDow = (new Date().getDay() + 6) % 7;

  // Animated XP bar
  const xpAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(xpAnim, {
      toValue: xpProgress,
      duration: 700,
      delay: 200,
      useNativeDriver: false,
    }).start();
  }, [xpProgress]);
  const xpWidth = xpAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });

  const handleStartLesson = async () => {
    if (!nextId) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/lesson/${nextId}`);
  };

  const pt = insets.top + (Platform.OS === "web" ? 67 : 0);
  const pb = insets.bottom + (Platform.OS === "web" ? 34 : 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: pt + 8 }]}>
        <StatPill iconName="zap" value={`${userStats.streak} дн`} color={colors.amber} />
        <Text style={[styles.headerTitle, { color: colors.foreground, fontSize: fs(16) }]}>
          Главная
        </Text>
        <StatPill iconName="star" value={`${userStats.xp} XP`} color={colors.primary} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.content, { paddingBottom: pb + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Mascot greeting card */}
        <View style={[styles.mascotCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <Mascot type={settings.mascot} size={88} animated />
          <View style={styles.mascotText}>
            <Text style={[styles.mascotGreeting, { color: colors.subForeground, fontSize: fs(12) }]}>
              {greeting}, {userStats.name}! 👋
            </Text>
            <Text style={[styles.mascotMessage, { color: colors.foreground, fontSize: fs(14) }]}>
              {message}
            </Text>
            <View style={styles.levelRow}>
              <Text style={[styles.levelLabel, { color: colors.primary, fontSize: fs(12) }]}>
                Ур.{level}
              </Text>
              <View style={[styles.xpBar, { backgroundColor: colors.track }]}>
                <Animated.View style={[styles.xpFill, { backgroundColor: colors.primary, width: xpWidth }]} />
              </View>
              <Text style={{ color: colors.mutedForeground, fontSize: fs(11) }}>{xpToNext} XP</Text>
            </View>
            <Text style={{ color: colors.mutedForeground, fontSize: fs(11), marginTop: 2 }}>
              Ещё {xpToNext} XP до Ур.{level + 1}
            </Text>
          </View>
        </View>

        {/* Next lesson card */}
        {nextNode ? (
          <TouchableOpacity onPress={handleStartLesson} activeOpacity={0.85}
            style={[styles.nextCardWrap, { borderRadius: colors.radius }]}>
            <LinearGradient
              colors={
                nextNode.type === "boss" ? ["#be123c", "#9f1239"]
                  : nextNode.type === "practice" ? ["#0e7490", "#155e75"]
                  : nextNode.type === "theory" ? ["#4338ca", "#3730a3"]
                  : [colors.primary, colors.primary + "CC"]
              }
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.nextCard}
            >
              <View style={styles.nextCardLeft}>
                <View style={styles.nextTypeRow}>
                  <View style={styles.nextTypeBadge}>
                    <Feather name={TYPE_ICON[nextNode.type] ?? "circle"} size={12} color="rgba(255,255,255,0.9)" />
                    <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: fs(11), fontWeight: "600" }}>
                      {TYPE_LABEL[nextNode.type]}
                    </Text>
                  </View>
                  <View style={styles.xpBadge}>
                    <Feather name="zap" size={11} color="#fde68a" />
                    <Text style={{ color: "#fde68a", fontSize: fs(11), fontWeight: "700" }}>
                      +{nextNode.xpReward} XP
                    </Text>
                  </View>
                </View>
                <Text style={{ color: "white", fontSize: fs(16), fontWeight: "700", lineHeight: fs(16) * 1.35 }} numberOfLines={2}>
                  {nextNode.theoryTitle ?? nextNode.label}
                </Text>
                {nextNode.questions && (
                  <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: fs(12) }}>
                    {nextNode.questions.length} вопросов
                  </Text>
                )}
              </View>
              <View style={styles.nextPlayButton}>
                <Feather name="play" size={20} color="white" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View style={[styles.courseCompleteCard, { backgroundColor: colors.green + "18", borderColor: colors.green + "35", borderRadius: colors.radius }]}>
            <Feather name="award" size={28} color={colors.green} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.courseCompleteTitle, { color: colors.foreground, fontSize: fs(16) }]}>Курс пройден!</Text>
              <Text style={{ color: colors.subForeground, fontSize: fs(13), marginTop: 2 }}>Ты прошёл все уроки. Так держать 🎉</Text>
            </View>
          </View>
        )}

        {/* Daily Goal */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <View style={styles.sectionHeader}>
            <Feather name="target" size={16} color={colors.amber} />
            <Text style={[styles.sectionTitle, { color: colors.foreground, fontSize: fs(14) }]}>Дневная цель</Text>
            <Text style={{ color: colors.amber, fontSize: fs(14), fontWeight: "700" }}>{userStats.dailyXp} / {goal} XP</Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: colors.track }]}>
            <LinearGradient
              colors={[colors.amber, colors.amber + "88"]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${dailyProgress * 100}%` }]}
            />
          </View>
          {userStats.dailyXp >= goal ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Feather name="check-circle" size={14} color={colors.green} />
              <Text style={{ color: colors.green, fontSize: fs(12), fontWeight: "600" }}>Цель выполнена! 🎉</Text>
            </View>
          ) : (
            <Text style={{ color: colors.mutedForeground, fontSize: fs(12) }}>
              Ещё {goal - userStats.dailyXp} XP для выполнения цели
            </Text>
          )}
        </View>

        {/* Week Streak */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <View style={styles.sectionHeader}>
            <Text style={{ fontSize: fs(16) }}>🔥</Text>
            <Text style={[styles.sectionTitle, { color: colors.foreground, fontSize: fs(14) }]}>Стрик недели</Text>
            <Text style={{ color: colors.red, fontSize: fs(14), fontWeight: "700" }}>{userStats.streak} дней 🔥</Text>
          </View>
          <View style={styles.weekRow}>
            {streak.map((active, i) => {
              const isToday = i === todayDow;
              return (
                <View key={i} style={styles.dayItem}>
                  <View style={[styles.dayDot, {
                    backgroundColor: active ? colors.red + "22" : colors.track,
                    borderColor: isToday ? colors.primary : active ? colors.red : colors.border,
                    borderWidth: isToday ? 2.5 : 1.5,
                  }]}>
                    <Text style={{ fontSize: active ? 16 : 13, lineHeight: 20 }}>{active ? "🔥" : "○"}</Text>
                  </View>
                  <Text style={{ fontSize: fs(11), fontWeight: "500", color: active ? colors.foreground : colors.mutedForeground }}>
                    {DAYS[i]}
                  </Text>
                </View>
              );
            })}
          </View>
          {(userStats.longestStreak ?? 0) > 0 && (
            <Text style={{ color: colors.mutedForeground, fontSize: fs(12), textAlign: "center", marginTop: 2 }}>
              Рекорд: {userStats.longestStreak} {userStats.longestStreak === 1 ? "день" : "дней"} 🏆
            </Text>
          )}
        </View>

        {/* Stats 2×2 */}
        <View style={styles.statsGrid}>
          {[
            { label: "Глав пройдено", value: `${completedChapters}/${chapters.length}`, icon: "map" as const, color: colors.green },
            { label: "Точность", value: userStats.totalAnswers > 0 ? `${Math.round((userStats.correctAnswers / userStats.totalAnswers) * 100)}%` : "—", icon: "target" as const, color: colors.amber },
            { label: "Заданий", value: `${userStats.solvedTasks}`, icon: "check-circle" as const, color: colors.primary },
            { label: "Лига", value: LEAGUE_NAMES[userStats.league - 1], icon: "award" as const, color: LEAGUE_COLORS[userStats.league - 1] },
          ].map((s) => (
            <View key={s.label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
              <View style={[styles.statIcon, { backgroundColor: s.color + "20" }]}>
                <Feather name={s.icon} size={18} color={s.color} />
              </View>
              <Text style={{ fontSize: fs(20), fontWeight: "800", color: colors.foreground }}>{s.value}</Text>
              <Text style={{ fontSize: fs(12), color: colors.subForeground }}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Chapter progress */}
        <View style={styles.chapterStrip}>
          <Text style={{ fontSize: fs(15), fontWeight: "700", color: colors.foreground, marginBottom: 2 }}>
            Прогресс по разделам
          </Text>
          {chapters.map((ch) => {
            const done = ch.nodes.filter((n) => userStats.completedNodeIds.includes(n.id)).length;
            const pct = done / ch.nodes.length;
            return (
              <View key={ch.id} style={styles.chapterRow}>
                <View style={[styles.chapterDot, { backgroundColor: ch.color + "30" }]}>
                  <Feather name={ch.iconName as any} size={13} color={ch.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.chapterMeta}>
                    <Text style={{ fontSize: fs(13), fontWeight: "600", color: colors.foreground, flex: 1 }} numberOfLines={1}>
                      {ch.title}
                    </Text>
                    <Text style={{ fontSize: fs(12), fontWeight: "700", color: pct === 1 ? colors.green : colors.subForeground }}>
                      {done}/{ch.nodes.length}
                    </Text>
                  </View>
                  <View style={[styles.chapterBar, { backgroundColor: colors.track }]}>
                    <View style={[styles.chapterFill, { backgroundColor: ch.color, width: `${pct * 100}%` }]} />
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 12 },
  headerTitle: { fontWeight: "700", fontFamily: "Inter_700Bold" },
  content: { paddingHorizontal: 20, gap: 14 },

  mascotCard: { flexDirection: "row", alignItems: "center", gap: 16, padding: 18, borderWidth: 1 },
  mascotText: { flex: 1, gap: 4 },
  mascotGreeting: { fontFamily: "Inter_500Medium" },
  mascotMessage: { fontWeight: "600", lineHeight: 22, fontFamily: "Inter_600SemiBold" },
  levelRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 },
  levelLabel: { fontWeight: "700", fontFamily: "Inter_700Bold" },
  xpBar: { flex: 1, height: 6, borderRadius: 3, overflow: "hidden" },
  xpFill: { height: "100%", borderRadius: 3 },

  nextCardWrap: { overflow: "hidden" },
  nextCard: { flexDirection: "row", alignItems: "center", padding: 18, gap: 14 },
  nextCardLeft: { flex: 1, gap: 6 },
  nextTypeRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  nextTypeBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(255,255,255,0.18)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  xpBadge: { flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "rgba(0,0,0,0.2)", paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
  nextPlayButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.22)", alignItems: "center", justifyContent: "center" },

  courseCompleteCard: { flexDirection: "row", alignItems: "center", gap: 14, padding: 18, borderWidth: 1 },
  courseCompleteTitle: { fontWeight: "700", fontFamily: "Inter_700Bold" },

  section: { padding: 16, borderWidth: 1, gap: 12 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionTitle: { flex: 1, fontWeight: "600", fontFamily: "Inter_600SemiBold" },
  progressTrack: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4 },
  weekRow: { flexDirection: "row", justifyContent: "space-between" },
  dayItem: { alignItems: "center", gap: 6 },
  dayDot: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },

  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  statCard: { flexBasis: "48%", flexGrow: 1, padding: 14, borderWidth: 1, gap: 6 },
  statIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },

  chapterStrip: { gap: 12 },
  chapterRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  chapterDot: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  chapterMeta: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 5 },
  chapterBar: { height: 5, borderRadius: 3, overflow: "hidden" },
  chapterFill: { height: "100%", borderRadius: 3 },
});
