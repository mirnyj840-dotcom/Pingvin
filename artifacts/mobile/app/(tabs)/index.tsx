import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useApp } from "@/contexts/AppContext";
import { useAppColors } from "@/hooks/useAppColors";
import Mascot from "@/components/Mascot";
import StatPill from "@/components/StatPill";
import GradientButton from "@/components/GradientButton";
import { chapters, findNode } from "@/data/curriculum";

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const MASCOT_MESSAGES = [
  "Привет! Сегодня отличный день для учёбы!",
  "Давай покорим новую тему вместе!",
  "Ты молодец, продолжай в том же духе!",
  "Один урок в день — и ОГЭ будет сдан!",
];

export default function HomeScreen() {
  const colors = useAppColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { userStats, settings, weekStreak, nextLessonId, nodeStatus } = useApp();

  const streak = weekStreak();
  const nextId = nextLessonId();
  const level = Math.floor(userStats.xp / 100) + 1;
  const xpToNext = level * 100 - userStats.xp;
  const xpProgress = (userStats.xp % 100) / 100;
  const dailyProgress = Math.min(userStats.dailyXp / 50, 1);
  const message = MASCOT_MESSAGES[userStats.solvedTasks % MASCOT_MESSAGES.length];

  const completedChapters = chapters.filter((ch) =>
    ch.nodes.every((n) => userStats.completedNodeIds.includes(n.id))
  ).length;

  const handleStartLesson = async () => {
    if (!nextId) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/lesson/${nextId}`);
  };

  const pt = insets.top + (Platform.OS === "web" ? 67 : 0);
  const pb = insets.bottom + (Platform.OS === "web" ? 34 : 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: pt + 8 }]}>
        <StatPill iconName="zap" value={`${userStats.streak} дн`} color={colors.amber} />
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Главная
        </Text>
        <StatPill iconName="star" value={`${userStats.xp} XP`} color={colors.primary} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.content, { paddingBottom: pb + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Mascot Card */}
        <View style={[styles.mascotCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Mascot type={settings.mascot} size={100} animated />
          <View style={styles.mascotText}>
            <Text style={[styles.mascotGreeting, { color: colors.subForeground }]}>
              Привет, {userStats.name}!
            </Text>
            <Text style={[styles.mascotMessage, { color: colors.foreground }]}>
              {message}
            </Text>
            <View style={styles.levelRow}>
              <Text style={[styles.levelText, { color: colors.primary }]}>
                Ур. {level}
              </Text>
              <View style={[styles.xpBar, { backgroundColor: colors.track }]}>
                <View
                  style={[
                    styles.xpFill,
                    { backgroundColor: colors.primary, width: `${xpProgress * 100}%` },
                  ]}
                />
              </View>
              <Text style={[styles.xpHint, { color: colors.mutedForeground }]}>
                {xpToNext} XP
              </Text>
            </View>
          </View>
        </View>

        {/* Daily Goal */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Feather name="target" size={16} color={colors.amber} />
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Дневная цель
            </Text>
            <Text style={[styles.sectionValue, { color: colors.amber }]}>
              {userStats.dailyXp} / 50 XP
            </Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: colors.track }]}>
            <LinearGradient
              colors={[colors.amber, colors.amber + "99"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.progressFill,
                { width: `${dailyProgress * 100}%`, borderRadius: 4 },
              ]}
            />
          </View>
          {userStats.dailyXp >= 50 && (
            <View style={styles.goalMet}>
              <Feather name="check-circle" size={14} color={colors.green} />
              <Text style={[styles.goalMetText, { color: colors.green }]}>
                Цель выполнена!
              </Text>
            </View>
          )}
        </View>

        {/* Week Streak */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionHeader}>
            <Feather name="activity" size={16} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Стрик недели
            </Text>
          </View>
          <View style={styles.weekRow}>
            {streak.map((active, i) => (
              <View key={i} style={styles.dayItem}>
                <View
                  style={[
                    styles.dayDot,
                    {
                      backgroundColor: active ? colors.primary : colors.track,
                      borderColor: active ? colors.primary : colors.border,
                    },
                  ]}
                >
                  {active && <Feather name="check" size={12} color="white" />}
                </View>
                <Text
                  style={[
                    styles.dayLabel,
                    { color: active ? colors.foreground : colors.mutedForeground },
                  ]}
                >
                  {DAYS[i]}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Progress Overview */}
        <View style={[styles.statsGrid, { gap: 10 }]}>
          <StatCard
            label="Глав пройдено"
            value={`${completedChapters} / ${chapters.length}`}
            iconName="map"
            color={colors.green}
            colors={colors}
          />
          <StatCard
            label="Точность"
            value={
              userStats.totalAnswers > 0
                ? `${Math.round((userStats.correctAnswers / userStats.totalAnswers) * 100)}%`
                : "—"
            }
            iconName="target"
            color={colors.amber}
            colors={colors}
          />
          <StatCard
            label="Заданий решено"
            value={`${userStats.solvedTasks}`}
            iconName="check-circle"
            color={colors.primary}
            colors={colors}
          />
          <StatCard
            label="Лига"
            value={LEAGUE_NAMES[userStats.league - 1]}
            iconName="award"
            color={LEAGUE_COLORS[userStats.league - 1]}
            colors={colors}
          />
        </View>

        {/* Start Button */}
        <View style={{ marginTop: 4 }}>
          <GradientButton
            label={nextId ? "Начать занятие" : "Курс пройден!"}
            iconName={nextId ? "play" : "award"}
            onPress={handleStartLesson}
            disabled={!nextId}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const LEAGUE_NAMES = ["Бронза", "Серебро", "Золото", "Платина", "Алмаз"];
const LEAGUE_COLORS = ["#CD7F32", "#C0C0C0", "#FFD700", "#E5E4E2", "#B9F2FF"];

function StatCard({
  label,
  value,
  iconName,
  color,
  colors,
}: {
  label: string;
  value: string;
  iconName: keyof typeof Feather.glyphMap;
  color: string;
  colors: ReturnType<typeof useAppColors>;
}) {
  return (
    <View
      style={[
        styles.statCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={[styles.statIcon, { backgroundColor: color + "20" }]}>
        <Feather name={iconName} size={18} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.subForeground }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  content: {
    paddingHorizontal: 20,
    gap: 14,
  },
  mascotCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
  },
  mascotText: { flex: 1, gap: 4 },
  mascotGreeting: { fontSize: 12, fontFamily: "Inter_500Medium" },
  mascotMessage: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
    fontFamily: "Inter_600SemiBold",
  },
  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  levelText: { fontSize: 12, fontWeight: "700", fontFamily: "Inter_700Bold" },
  xpBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  xpFill: { height: "100%", borderRadius: 3 },
  xpHint: { fontSize: 11 },
  section: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  sectionValue: { fontSize: 14, fontWeight: "700", fontFamily: "Inter_700Bold" },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: { height: "100%" },
  goalMet: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: -4,
  },
  goalMetText: { fontSize: 12, fontWeight: "600", fontFamily: "Inter_600SemiBold" },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayItem: { alignItems: "center", gap: 6 },
  dayDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  dayLabel: { fontSize: 11, fontWeight: "500" },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  statCard: {
    width: "48%",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
    marginBottom: 10,
    marginRight: "4%",
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
  },
  statLabel: { fontSize: 12 },
});
