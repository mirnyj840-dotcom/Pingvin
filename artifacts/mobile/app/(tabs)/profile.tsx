import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import { useApp } from "@/contexts/AppContext";
import { useTheme } from "@/hooks/useTheme";
import Mascot from "@/components/Mascot";
import { achievements } from "@/data/achievements";
import { chapters } from "@/data/curriculum";

const LEAGUE_NAMES = ["Бронза", "Серебро", "Золото", "Платина", "Алмаз"];
const LEAGUE_COLORS = ["#CD7F32", "#C0C0C0", "#FFD700", "#E2E0DF", "#B9F2FF"];
const LEAGUE_ICONS: Array<keyof typeof Feather.glyphMap> = ["award", "award", "award", "star", "zap"];

const RING_SIZE = 188;
const RING_SW = 14;
const RING_R = (RING_SIZE - RING_SW * 2) / 2;
const RING_CIRC = 2 * Math.PI * RING_R;

export default function ProfileScreen() {
  const { colors, fs } = useTheme();
  const insets = useSafeAreaInsets();
  const { userStats, settings } = useApp();

  const level = Math.floor(userStats.xp / 100) + 1;
  const xpInLevel = userStats.xp % 100;
  const xpProgress = xpInLevel / 100;
  const accuracy = userStats.totalAnswers > 0
    ? Math.round((userStats.correctAnswers / userStats.totalAnswers) * 100) : 0;
  const completedChapters = chapters.filter((ch) =>
    ch.nodes.every((n) => userStats.completedNodeIds.includes(n.id))
  ).length;
  const daysInApp = userStats.weeklyDates.length;

  const unlockedCount = achievements.filter((a) =>
    a.isUnlocked({
      xp: userStats.xp, streak: userStats.streak,
      longestStreak: userStats.longestStreak,
      solvedTasks: userStats.solvedTasks,
      correctAnswers: userStats.correctAnswers,
      totalAnswers: userStats.totalAnswers,
      completedNodeIds: userStats.completedNodeIds,
    })
  ).length;

  const pt = insets.top + (Platform.OS === "web" ? 67 : 0);
  const pb = insets.bottom + (Platform.OS === "web" ? 34 : 0);
  const leagueColor = LEAGUE_COLORS[userStats.league - 1];
  const leagueName = LEAGUE_NAMES[userStats.league - 1];
  const leagueIcon = LEAGUE_ICONS[userStats.league - 1];
  const dashLen = RING_CIRC * xpProgress;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: pt + 8, paddingBottom: pb + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero: XP ring + mascot */}
        <View style={styles.heroSection}>
          <View style={styles.ringWrap}>
            <Svg width={RING_SIZE} height={RING_SIZE}>
              <Circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_R} stroke={colors.track} strokeWidth={RING_SW} fill="none" />
              <Circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_R} stroke={colors.primary} strokeWidth={RING_SW}
                strokeDasharray={`${dashLen} ${RING_CIRC}`} fill="none" strokeLinecap="round"
                transform={`rotate(-90, ${RING_SIZE / 2}, ${RING_SIZE / 2})`} />
            </Svg>
            <View style={styles.mascotOverlay} pointerEvents="none">
              <Mascot type={settings.mascot} size={112} animated />
            </View>
            <View style={[styles.levelBadge, { backgroundColor: colors.primary }]}>
              <Text style={{ color: "white", fontSize: fs(12), fontWeight: "700" }}>Ур. {level}</Text>
            </View>
          </View>

          {/* Avatar color dot */}
          <View style={[styles.avatarDot, { backgroundColor: settings.avatarColor }]} />
          <Text style={{ fontSize: fs(22), fontWeight: "800", color: colors.foreground, marginTop: 2 }}>
            {userStats.name}
          </Text>
          <Text style={{ fontSize: fs(13), color: colors.subForeground }}>9 класс · ОГЭ 2025</Text>
          <Text style={{ fontSize: fs(12), color: colors.mutedForeground, marginTop: 2 }}>
            {xpInLevel} / 100 XP — до ур. {level + 1} ещё {100 - xpInLevel} XP
          </Text>
        </View>

        {/* League card */}
        <View style={[styles.leagueCard, { backgroundColor: leagueColor + "16", borderColor: leagueColor + "40", borderRadius: colors.radius }]}>
          <View style={[styles.leagueIconWrap, { backgroundColor: leagueColor + "28" }]}>
            <Feather name={leagueIcon} size={24} color={leagueColor} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: fs(16), fontWeight: "700", color: colors.foreground }}>{leagueName} лига</Text>
            <Text style={{ fontSize: fs(12), color: colors.subForeground, marginTop: 2 }}>{userStats.xp} XP собрано</Text>
          </View>
          <View style={styles.leagueSteps}>
            {[1, 2, 3, 4, 5].map((l) => (
              <View key={l} style={[styles.leagueStep, { backgroundColor: l <= userStats.league ? leagueColor : colors.track }]} />
            ))}
          </View>
        </View>

        {/* Stats 2×2 */}
        <View style={styles.statsGrid}>
          {[
            { label: "Стрик", value: `${userStats.streak}`, sub: "дней подряд", icon: "zap" as const, color: colors.red },
            { label: "XP", value: `${userStats.xp}`, sub: "очков опыта", icon: "award" as const, color: colors.primary },
            { label: "Заданий", value: `${userStats.solvedTasks}`, sub: "решено", icon: "check-circle" as const, color: colors.green },
            { label: "Точность", value: `${accuracy}%`, sub: "правильных", icon: "target" as const, color: colors.amber },
          ].map((s) => (
            <View key={s.label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
              <View style={[styles.statIcon, { backgroundColor: s.color + "20" }]}>
                <Feather name={s.icon} size={18} color={s.color} />
              </View>
              <Text style={{ fontSize: fs(22), fontWeight: "800", color: colors.foreground }}>{s.value}</Text>
              <Text style={{ fontSize: fs(12), color: colors.subForeground }}>{s.sub}</Text>
            </View>
          ))}
        </View>

        {/* Detailed stats */}
        <View style={[styles.extraCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <Text style={{ fontSize: fs(15), fontWeight: "700", color: colors.foreground, marginBottom: 4 }}>
            Подробная статистика
          </Text>
          {[
            { label: "Рекорд стрика", value: `${userStats.longestStreak ?? 0} дней 🏆` },
            { label: "Глав завершено", value: `${completedChapters} / ${chapters.length}` },
            { label: "Дней активности", value: `${daysInApp}` },
            { label: "Правильных ответов", value: `${userStats.correctAnswers} из ${userStats.totalAnswers}` },
            { label: "Точность", value: `${accuracy}%` },
          ].map((row, i, arr) => (
            <View key={row.label} style={[styles.extraRow, {
              borderBottomColor: colors.border,
              borderBottomWidth: i === arr.length - 1 ? 0 : StyleSheet.hairlineWidth,
            }]}>
              <Text style={{ fontSize: fs(14), color: colors.subForeground }}>{row.label}</Text>
              <Text style={{ fontSize: fs(14), fontWeight: "600", color: colors.foreground }}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* Achievements */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeader}>
            <Feather name="award" size={16} color={colors.amber} />
            <Text style={{ flex: 1, fontSize: fs(16), fontWeight: "700", color: colors.foreground }}>
              Достижения
            </Text>
            <View style={[styles.countBadge, { backgroundColor: colors.amber + "20" }]}>
              <Text style={{ fontSize: fs(12), fontWeight: "600", color: colors.amber }}>
                {unlockedCount} / {achievements.length}
              </Text>
            </View>
          </View>

          <View style={styles.achievementsGrid}>
            {achievements.map((a) => {
              const unlocked = a.isUnlocked({
                xp: userStats.xp, streak: userStats.streak,
                longestStreak: userStats.longestStreak,
                solvedTasks: userStats.solvedTasks,
                correctAnswers: userStats.correctAnswers,
                totalAnswers: userStats.totalAnswers,
                completedNodeIds: userStats.completedNodeIds,
              });
              return (
                <View key={a.id} style={[styles.achievementCard, {
                  backgroundColor: unlocked ? a.iconColor + "14" : colors.card,
                  borderColor: unlocked ? a.iconColor + "35" : colors.border,
                  borderRadius: colors.radius * 0.75,
                  opacity: unlocked ? 1 : 0.42,
                }]}>
                  <View style={[styles.achievementIcon, { backgroundColor: unlocked ? a.iconColor + "26" : colors.track }]}>
                    <Feather name={a.iconName as any} size={20} color={unlocked ? a.iconColor : colors.mutedForeground} />
                  </View>
                  <Text style={[styles.achievementLabel, { color: unlocked ? colors.foreground : colors.subForeground, fontSize: fs(11) }]}
                    numberOfLines={2}>
                    {a.label}
                  </Text>
                  {unlocked && (
                    <View style={[styles.checkBadge, { backgroundColor: a.iconColor }]}>
                      <Feather name="check" size={9} color="white" />
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 16 },

  heroSection: { alignItems: "center", gap: 8, paddingTop: 4 },
  ringWrap: { width: RING_SIZE, height: RING_SIZE, position: "relative", alignItems: "center", justifyContent: "center" },
  mascotOverlay: { position: "absolute", alignItems: "center", justifyContent: "center" },
  levelBadge: { position: "absolute", bottom: 6, right: 6, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  avatarDot: { width: 12, height: 12, borderRadius: 6, marginTop: -4 },

  leagueCard: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderWidth: 1 },
  leagueIconWrap: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  leagueSteps: { flexDirection: "row", gap: 4 },
  leagueStep: { width: 8, height: 8, borderRadius: 4 },

  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  statCard: { flexBasis: "47%", flexGrow: 1, padding: 14, borderWidth: 1, gap: 4 },
  statIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 2 },

  extraCard: { borderWidth: 1, padding: 16, gap: 0 },
  extraRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10 },

  sectionWrap: { gap: 12 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  countBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },

  achievementsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  achievementCard: { width: "30%", padding: 10, borderWidth: 1, alignItems: "center", gap: 6, position: "relative" },
  achievementIcon: { width: 46, height: 46, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  achievementLabel: { textAlign: "center", fontWeight: "500", lineHeight: 14 },
  checkBadge: { position: "absolute", top: 6, right: 6, width: 16, height: 16, borderRadius: 8, alignItems: "center", justifyContent: "center" },
});
