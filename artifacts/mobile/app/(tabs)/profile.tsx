import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useApp } from "@/contexts/AppContext";
import { useAppColors } from "@/hooks/useAppColors";
import Mascot from "@/components/Mascot";
import { achievements } from "@/data/achievements";

const LEAGUE_NAMES = ["Бронза", "Серебро", "Золото", "Платина", "Алмаз"];
const LEAGUE_COLORS = ["#CD7F32", "#C0C0C0", "#FFD700", "#E2E0DF", "#B9F2FF"];
const LEAGUE_ICONS: Array<keyof typeof Feather.glyphMap> = [
  "award",
  "award",
  "award",
  "star",
  "zap",
];

export default function ProfileScreen() {
  const colors = useAppColors();
  const insets = useSafeAreaInsets();
  const { userStats, settings } = useApp();

  const level = Math.floor(userStats.xp / 100) + 1;
  const xpInLevel = userStats.xp % 100;
  const xpProgress = xpInLevel / 100;
  const accuracy =
    userStats.totalAnswers > 0
      ? Math.round((userStats.correctAnswers / userStats.totalAnswers) * 100)
      : 0;

  const unlockedAchievements = achievements.filter((a) =>
    a.isUnlocked({
      xp: userStats.xp,
      streak: userStats.streak,
      solvedTasks: userStats.solvedTasks,
      correctAnswers: userStats.correctAnswers,
      totalAnswers: userStats.totalAnswers,
      completedNodeIds: userStats.completedNodeIds,
    })
  );

  const pt = insets.top + (Platform.OS === "web" ? 67 : 0);
  const pb = insets.bottom + (Platform.OS === "web" ? 34 : 0);

  const leagueColor = LEAGUE_COLORS[userStats.league - 1];
  const leagueName = LEAGUE_NAMES[userStats.league - 1];
  const leagueIcon = LEAGUE_ICONS[userStats.league - 1];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: pt + 8, paddingBottom: pb + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + Name */}
        <View style={styles.avatarSection}>
          <LinearGradient
            colors={[settings.avatarColor, settings.avatarColor + "99"]}
            style={[styles.avatarGradient, { borderRadius: 52 }]}
          >
            <Mascot type={settings.mascot} size={72} animated />
          </LinearGradient>
          <Text style={[styles.userName, { color: colors.foreground }]}>
            {userStats.name}
          </Text>
          <Text style={[styles.userSub, { color: colors.subForeground }]}>
            9 класс · ОГЭ 2025 · Ур. {level}
          </Text>

          {/* XP bar */}
          <View style={styles.xpSection}>
            <View
              style={[styles.xpTrack, { backgroundColor: colors.track }]}
            >
              <View
                style={[
                  styles.xpFill,
                  {
                    backgroundColor: colors.primary,
                    width: `${xpProgress * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.xpLabel, { color: colors.mutedForeground }]}>
              {xpInLevel} / 100 XP до ур. {level + 1}
            </Text>
          </View>
        </View>

        {/* League card */}
        <View
          style={[
            styles.leagueCard,
            { backgroundColor: leagueColor + "18", borderColor: leagueColor + "35" },
          ]}
        >
          <Feather name={leagueIcon} size={28} color={leagueColor} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.leagueTitle, { color: colors.foreground }]}>
              {leagueName} лига
            </Text>
            <Text style={[styles.leagueSub, { color: colors.subForeground }]}>
              {userStats.xp} XP заработано
            </Text>
          </View>
          <View
            style={[
              styles.leagueBadge,
              { backgroundColor: leagueColor + "30" },
            ]}
          >
            <Text style={[styles.leagueBadgeText, { color: leagueColor }]}>
              {userStats.league} / 5
            </Text>
          </View>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          {[
            {
              label: "Стрик",
              value: `${userStats.streak}`,
              icon: "activity" as const,
              color: colors.red,
              sub: "дней",
            },
            {
              label: "XP",
              value: `${userStats.xp}`,
              icon: "zap" as const,
              color: colors.primary,
              sub: "очков",
            },
            {
              label: "Заданий",
              value: `${userStats.solvedTasks}`,
              icon: "check-circle" as const,
              color: colors.green,
              sub: "решено",
            },
            {
              label: "Точность",
              value: `${accuracy}%`,
              icon: "target" as const,
              color: colors.amber,
              sub: "правильно",
            },
          ].map((stat) => (
            <View
              key={stat.label}
              style={[
                styles.statCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View
                style={[
                  styles.statIcon,
                  { backgroundColor: stat.color + "20" },
                ]}
              >
                <Feather name={stat.icon} size={18} color={stat.color} />
              </View>
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                {stat.value}
              </Text>
              <Text style={[styles.statSub, { color: colors.subForeground }]}>
                {stat.sub}
              </Text>
            </View>
          ))}
        </View>

        {/* Achievements */}
        <View style={styles.sectionWrap}>
          <View style={styles.sectionHeaderRow}>
            <Feather name="award" size={16} color={colors.amber} />
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Достижения
            </Text>
            <Text style={[styles.sectionCount, { color: colors.subForeground }]}>
              {unlockedAchievements.length} / {achievements.length}
            </Text>
          </View>
          <View style={styles.achievementsGrid}>
            {achievements.map((a) => {
              const unlocked = a.isUnlocked({
                xp: userStats.xp,
                streak: userStats.streak,
                solvedTasks: userStats.solvedTasks,
                correctAnswers: userStats.correctAnswers,
                totalAnswers: userStats.totalAnswers,
                completedNodeIds: userStats.completedNodeIds,
              });
              return (
                <View
                  key={a.id}
                  style={[
                    styles.achievementCard,
                    {
                      backgroundColor: unlocked
                        ? a.iconColor + "15"
                        : colors.card,
                      borderColor: unlocked
                        ? a.iconColor + "35"
                        : colors.border,
                      opacity: unlocked ? 1 : 0.45,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.achievementIcon,
                      {
                        backgroundColor: unlocked
                          ? a.iconColor + "25"
                          : colors.track,
                      },
                    ]}
                  >
                    <Feather
                      name={a.iconName as any}
                      size={20}
                      color={unlocked ? a.iconColor : colors.mutedForeground}
                    />
                  </View>
                  <Text
                    style={[
                      styles.achievementLabel,
                      { color: unlocked ? colors.foreground : colors.subForeground },
                    ]}
                    numberOfLines={2}
                  >
                    {a.label}
                  </Text>
                  {unlocked && (
                    <View
                      style={[
                        styles.checkBadge,
                        { backgroundColor: a.iconColor },
                      ]}
                    >
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
  avatarSection: { alignItems: "center", gap: 8, paddingTop: 8 },
  avatarGradient: {
    width: 104,
    height: 104,
    alignItems: "center",
    justifyContent: "center",
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
    marginTop: 4,
  },
  userSub: { fontSize: 13 },
  xpSection: { width: "100%", gap: 6, marginTop: 4 },
  xpTrack: { height: 8, borderRadius: 4, overflow: "hidden" },
  xpFill: { height: "100%", borderRadius: 4 },
  xpLabel: { fontSize: 12, textAlign: "center" },
  leagueCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  leagueTitle: { fontSize: 16, fontWeight: "700", fontFamily: "Inter_700Bold" },
  leagueSub: { fontSize: 12, marginTop: 2 },
  leagueBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  leagueBadgeText: { fontSize: 13, fontWeight: "700", fontFamily: "Inter_700Bold" },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statCard: {
    width: "47%",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  statValue: { fontSize: 22, fontWeight: "800", fontFamily: "Inter_700Bold" },
  statSub: { fontSize: 12 },
  sectionWrap: { gap: 12 },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  sectionCount: { fontSize: 13 },
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  achievementCard: {
    width: "30%",
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    gap: 6,
    position: "relative",
  },
  achievementIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  achievementLabel: {
    fontSize: 11,
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 14,
  },
  checkBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
