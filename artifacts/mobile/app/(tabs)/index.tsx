import React, { useEffect, useRef } from "react";
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
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useApp } from "@/contexts/AppContext";
import { useTheme } from "@/hooks/useTheme";
import Mascot from "@/components/Mascot";
import { chapters, findNode } from "@/data/curriculum";

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const DAILY_MESSAGES = [
  "Сегодня отличный день для учёбы!",
  "Давай покорим новую тему вместе!",
  "Ты молодец, продолжай в том же духе!",
  "Знания — твоё главное оружие!",
  "Сегодня ты на шаг ближе к пятёрке!",
  "Повторение — мать учения. Вперёд!",
  "Каждый правильный ответ — победа!",
  "Не останавливайся, ты делаешь отлично!",
  "Математика — это логика, и у тебя она есть!",
  "Сложности временны, знания навсегда!",
  "Твой мозг растёт прямо сейчас!",
  "Маленький шаг сегодня — большой результат в июне!",
];

const MATH_TIPS = [
  { icon: "🔢", title: "Правило ИУПС", body: "При делении дроби на дробь переверни вторую и умножай." },
  { icon: "📐", title: "Пифагор", body: "В прямоугольном треугольнике: a² + b² = c², где c — гипотенуза." },
  { icon: "📊", title: "Среднее значение", body: "Среднее = (сумма всех чисел) ÷ (количество чисел)." },
  { icon: "⚖️", title: "Линейное уравнение", body: "ax = b → x = b/a (если a ≠ 0). Проверяй ответ подстановкой!" },
  { icon: "🔁", title: "НОК и НОД", body: "НОК(a,b) × НОД(a,b) = a × b. Используй при сложении дробей." },
  { icon: "📈", title: "Степени", body: "aⁿ · aᵐ = aⁿ⁺ᵐ. Произведение степеней с одним основанием = сложение показателей." },
  { icon: "🎲", title: "Вероятность", body: "P = (число благопр. исходов) ÷ (общее число исходов). Всегда от 0 до 1." },
  { icon: "📏", title: "Периметр и площадь", body: "Прямоугольник: P = 2(a+b), S = a·b. Квадрат: P = 4a, S = a²." },
  { icon: "🔣", title: "Раскрытие скобок", body: "(a+b)² = a² + 2ab + b². Запомни это наизусть — встречается в каждом варианте!" },
  { icon: "📉", title: "Квадратное уравнение", body: "D = b² − 4ac. Если D < 0, корней нет. Если D = 0, один корень: x = −b/2a." },
  { icon: "🌡️", title: "Проценты", body: "x% от N = N · x / 100. Например: 15% от 200 = 200 · 15 / 100 = 30." },
  { icon: "⏱️", title: "Скорость, время, путь", body: "S = v · t, v = S/t, t = S/v. Единицы должны совпадать!" },
];

function getDailyTip() {
  const day = Math.floor(Date.now() / 86400000);
  return MATH_TIPS[day % MATH_TIPS.length];
}

function getOgeCountdown(): { days: number; year: number; passed: boolean } {
  const now = new Date();
  const year = now.getFullYear();
  const ogeThisYear = new Date(year, 5, 3); // June 3 current year
  const ogeNextYear = new Date(year + 1, 5, 3); // June 3 next year
  if (now <= ogeThisYear) {
    const diff = Math.ceil((ogeThisYear.getTime() - now.getTime()) / 86400000);
    return { days: diff, year, passed: false };
  } else {
    const diff = Math.ceil((ogeNextYear.getTime() - now.getTime()) / 86400000);
    return { days: diff, year: year + 1, passed: true };
  }
}

const TYPE_LABEL: Record<string, string> = {
  theory: "ТЕОРИЯ",
  miniQuiz: "КВИЗ",
  practice: "ПРАКТИКА",
  boss: "БОСС",
};
const TYPE_ICON: Record<string, keyof typeof Feather.glyphMap> = {
  theory: "book-open",
  miniQuiz: "edit-3",
  practice: "cpu",
  boss: "zap",
};
const LEAGUE_NAMES = ["Бронза", "Серебро", "Золото", "Платина", "Алмаз"];

function getDailyMessage(): string {
  const day = Math.floor(Date.now() / 86400000);
  return DAILY_MESSAGES[day % DAILY_MESSAGES.length];
}
function getGreeting(): string {
  const h = new Date().getHours();
  return h < 12 ? "Доброе утро" : h < 18 ? "Добрый день" : "Добрый вечер";
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
  const xpProgress = xpInLevel / 100;
  const goal = settings.dailyXpGoal ?? 50;
  const dailyProgress = Math.min(userStats.dailyXp / goal, 1);
  const completedChapters = chapters.filter((ch) =>
    ch.nodes.every((n) => userStats.completedNodeIds.includes(n.id))
  ).length;
  const todayDow = (new Date().getDay() + 6) % 7;
  const accuracy = userStats.totalAnswers > 0
    ? Math.round((userStats.correctAnswers / userStats.totalAnswers) * 100) : 0;

  // Animated XP bar
  const xpAnim = useRef(new RNAnimated.Value(0)).current;
  const dailyAnim = useRef(new RNAnimated.Value(0)).current;
  useEffect(() => {
    RNAnimated.parallel([
      RNAnimated.timing(xpAnim, { toValue: xpProgress, duration: 800, delay: 300, useNativeDriver: false }),
      RNAnimated.timing(dailyAnim, { toValue: dailyProgress, duration: 700, delay: 500, useNativeDriver: false }),
    ]).start();
  }, [xpProgress, dailyProgress]);
  const xpBarWidth = xpAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });
  const dailyBarWidth = dailyAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });

  const pt = insets.top + (Platform.OS === "web" ? 67 : 0);
  const pb = insets.bottom + (Platform.OS === "web" ? 34 : 0);

  const oge = getOgeCountdown();
  const ogeTip = getDailyTip();
  const ogeUrgent = oge.days <= 30;

  const lessonGradient: [string, string] =
    nextNode?.type === "boss" ? ["#be123c", "#9f1239"]
    : nextNode?.type === "practice" ? ["#0e7490", "#155e75"]
    : [colors.primary, `${colors.primary}CC`];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* ── HEADER ── */}
      <View style={[styles.header, { paddingTop: pt + 8 }]}>
        {/* Streak pill */}
        <View style={[styles.statPill, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={{ fontSize: 14 }}>⚡</Text>
          <Text style={{ color: colors.foreground, fontSize: fs(13), fontWeight: "700" }}>
            {userStats.streak} дн
          </Text>
        </View>

        <Text style={{ color: colors.foreground, fontSize: fs(17), fontWeight: "700", fontFamily: "Inter_700Bold" }}>
          Главная
        </Text>

        {/* XP pill */}
        <View style={[styles.statPill, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="star" size={13} color={colors.primary} />
          <Text style={{ color: colors.foreground, fontSize: fs(13), fontWeight: "700" }}>
            {userStats.xp} XP
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.content, { paddingBottom: pb + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── MASCOT GREETING CARD ── */}
        <View style={[styles.mascotCard, {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
          shadowColor: colors.primary,
          shadowOpacity: 0.07,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 3,
        }]}>
          {/* Penguin on left */}
          <View style={styles.mascotImageWrap}>
            <Mascot type={settings.mascot} size={100} mode="idle" />
          </View>

          {/* Text on right */}
          <View style={styles.mascotContent}>
            <Text style={{ color: colors.subForeground, fontSize: fs(12), fontWeight: "500" }}>
              {getGreeting()}, {userStats.name}! 👋
            </Text>
            <Text style={{ color: colors.foreground, fontSize: fs(15), fontWeight: "700", fontFamily: "Inter_700Bold", lineHeight: fs(15) * 1.35, marginTop: 3 }}>
              {getDailyMessage()}
            </Text>

            {/* Level + XP bar */}
            <View style={styles.levelRow}>
              <Text style={{ color: colors.primary, fontSize: fs(12), fontWeight: "700" }}>
                Ур.{level}
              </Text>
              <View style={[styles.xpTrack, { backgroundColor: colors.track }]}>
                <RNAnimated.View style={[styles.xpFill, { backgroundColor: colors.primary, width: xpBarWidth }]} />
              </View>
              <Text style={{ color: colors.mutedForeground, fontSize: fs(11) }}>
                {xpInLevel}/100
              </Text>
            </View>
          </View>
        </View>

        {/* ── OGE COUNTDOWN ── */}
        <LinearGradient
          colors={ogeUrgent ? ["#7f1d1d", "#b91c1c"] : [colors.card, colors.card]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.ogeCard, {
            borderColor: ogeUrgent ? "#ef444450" : colors.border,
            borderRadius: colors.radius,
          }]}
        >
          <View style={[styles.ogeIconWrap, { backgroundColor: ogeUrgent ? "rgba(255,255,255,0.15)" : colors.red + "18" }]}>
            <Text style={{ fontSize: 22 }}>📅</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: ogeUrgent ? "rgba(255,255,255,0.7)" : colors.subForeground, fontSize: fs(12), fontWeight: "500" }}>
              До ОГЭ {oge.year}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "baseline", gap: 4 }}>
              <Text style={{ color: ogeUrgent ? "white" : colors.foreground, fontSize: fs(28), fontWeight: "900", fontFamily: "Inter_700Bold" }}>
                {oge.days}
              </Text>
              <Text style={{ color: ogeUrgent ? "rgba(255,255,255,0.75)" : colors.subForeground, fontSize: fs(14), fontWeight: "600" }}>
                {oge.days % 10 === 1 && oge.days % 100 !== 11 ? "день" : oge.days % 10 >= 2 && oge.days % 10 <= 4 && !(oge.days % 100 >= 12 && oge.days % 100 <= 14) ? "дня" : "дней"}
              </Text>
            </View>
          </View>
          <View style={styles.ogeRight}>
            <Text style={{ fontSize: 36, opacity: ogeUrgent ? 0.9 : 0.5 }}>🎓</Text>
          </View>
        </LinearGradient>

        {/* ── NEXT LESSON CARD ── */}
        {nextNode ? (
          <TouchableOpacity
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push(`/lesson/${nextId}`);
            }}
            activeOpacity={0.88}
            style={{ borderRadius: colors.radius, overflow: "hidden" }}
          >
            <LinearGradient
              colors={lessonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.lessonCard}
            >
              {/* Decorative blobs */}
              <View style={[styles.lessonBlob, { backgroundColor: "rgba(255,255,255,0.07)", width: 90, height: 90, borderRadius: 45, top: -20, right: 50 }]} />
              <View style={[styles.lessonBlob, { backgroundColor: "rgba(255,255,255,0.05)", width: 60, height: 60, borderRadius: 30, bottom: -15, left: 20 }]} />

              <View style={styles.lessonLeft}>
                {/* Tags row */}
                <View style={styles.lessonTags}>
                  <View style={styles.lessonTypePill}>
                    <Feather name={TYPE_ICON[nextNode.type] ?? "book-open"} size={11} color="rgba(255,255,255,0.9)" />
                    <Text style={{ color: "rgba(255,255,255,0.92)", fontSize: fs(11), fontWeight: "700", letterSpacing: 0.3 }}>
                      {TYPE_LABEL[nextNode.type] ?? "УРОК"}
                    </Text>
                  </View>
                  <View style={styles.lessonXpPill}>
                    <Text style={{ color: "#FDE68A", fontSize: fs(11), fontWeight: "700" }}>
                      ⚡ +{nextNode.xpReward} XP
                    </Text>
                  </View>
                </View>

                <Text style={{ color: "white", fontSize: fs(20), fontWeight: "800", fontFamily: "Inter_700Bold", marginTop: 8, lineHeight: fs(20) * 1.25 }} numberOfLines={2}>
                  {nextNode.theoryTitle ?? nextNode.label}
                </Text>
                {nextNode.questions && (
                  <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: fs(12), marginTop: 4 }}>
                    {nextNode.questions.length} вопросов
                  </Text>
                )}
              </View>

              {/* Play button */}
              <View style={styles.playBtn}>
                <Feather name="play" size={22} color="white" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View style={[styles.doneCard, { backgroundColor: colors.green + "15", borderColor: colors.green + "30", borderRadius: colors.radius }]}>
            <Text style={{ fontSize: 28 }}>🎉</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.foreground, fontSize: fs(16), fontWeight: "700" }}>Курс завершён!</Text>
              <Text style={{ color: colors.subForeground, fontSize: fs(13), marginTop: 2 }}>Все уроки пройдены. Ты звезда!</Text>
            </View>
          </View>
        )}

        {/* ── DAILY GOAL ── */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconCircle, { backgroundColor: colors.amber + "20" }]}>
              <Text style={{ fontSize: 16 }}>🎯</Text>
            </View>
            <Text style={{ flex: 1, color: colors.foreground, fontSize: fs(15), fontWeight: "700", fontFamily: "Inter_700Bold" }}>
              Дневная цель
            </Text>
            <Text style={{ color: colors.amber, fontSize: fs(15), fontWeight: "800" }}>
              {userStats.dailyXp} / {goal} XP
            </Text>
          </View>

          <View style={[styles.progressTrack, { backgroundColor: colors.track }]}>
            <RNAnimated.View style={[styles.progressFill, { width: dailyBarWidth, backgroundColor: colors.amber }]} />
          </View>

          <View style={styles.goalFooter}>
            {userStats.dailyXp >= goal ? (
              <View style={styles.goalDoneRow}>
                <Feather name="check-circle" size={14} color={colors.green} />
                <Text style={{ color: colors.green, fontSize: fs(13), fontWeight: "600" }}>Цель выполнена! 🎉</Text>
              </View>
            ) : (
              <Text style={{ color: colors.mutedForeground, fontSize: fs(13) }}>
                Ещё {goal - userStats.dailyXp} XP для выполнения цели
              </Text>
            )}
            {/* Paper plane deco */}
            <Text style={{ fontSize: 22, opacity: 0.35 }}>🛸</Text>
          </View>
        </View>

        {/* ── WEEK STREAK ── */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconCircle, { backgroundColor: colors.red + "18" }]}>
              <Text style={{ fontSize: 16 }}>🔥</Text>
            </View>
            <Text style={{ flex: 1, color: colors.foreground, fontSize: fs(15), fontWeight: "700", fontFamily: "Inter_700Bold" }}>
              Стрик недели
            </Text>
            <Text style={{ color: colors.red, fontSize: fs(14), fontWeight: "800" }}>
              {userStats.streak} {userStats.streak === 1 ? "день" : "дней"} 🔥
            </Text>
          </View>

          <View style={styles.weekRow}>
            {streak.map((active, i) => {
              const isToday = i === todayDow;
              return (
                <View key={i} style={styles.dayItem}>
                  <View style={[styles.dayCircle, {
                    backgroundColor: active ? colors.red + "18" : colors.secondary,
                    borderColor: isToday ? colors.primary : active ? colors.red + "50" : colors.border,
                    borderWidth: isToday ? 2.5 : 1.5,
                  }]}>
                    {active ? (
                      <Text style={{ fontSize: 16 }}>🔥</Text>
                    ) : (
                      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.track }} />
                    )}
                  </View>
                  <Text style={{ fontSize: fs(11), color: active ? colors.foreground : colors.mutedForeground, fontWeight: active ? "600" : "400" }}>
                    {DAYS[i]}
                  </Text>
                </View>
              );
            })}
          </View>

          {(userStats.longestStreak ?? 0) > 0 && (
            <Text style={{ color: colors.mutedForeground, fontSize: fs(12), textAlign: "center", marginTop: 4 }}>
              Рекорд: {userStats.longestStreak} дней 🏆
            </Text>
          )}
        </View>

        {/* ── STATS GRID 2×2 ── */}
        <View style={styles.statsGrid}>
          {/* Chapters */}
          <View style={[styles.statCard, {
            backgroundColor: colors.green + "12",
            borderColor: colors.green + "28",
            borderRadius: colors.radius,
          }]}>
            <View style={[styles.statCardIcon, { backgroundColor: colors.green + "22" }]}>
              <Feather name="map" size={16} color={colors.green} />
            </View>
            <Text style={{ color: colors.foreground, fontSize: fs(26), fontWeight: "900", fontFamily: "Inter_700Bold" }}>
              {completedChapters}/{chapters.length}
            </Text>
            <Text style={{ color: colors.subForeground, fontSize: fs(12), marginTop: 2 }}>Глав пройдено</Text>
            <Text style={{ position: "absolute", bottom: 8, right: 10, fontSize: 34, opacity: 0.18 }}>⛰️</Text>
          </View>

          {/* Accuracy */}
          <View style={[styles.statCard, {
            backgroundColor: colors.amber + "12",
            borderColor: colors.amber + "28",
            borderRadius: colors.radius,
          }]}>
            <View style={[styles.statCardIcon, { backgroundColor: colors.amber + "22" }]}>
              <Feather name="target" size={16} color={colors.amber} />
            </View>
            <Text style={{ color: colors.foreground, fontSize: fs(26), fontWeight: "900", fontFamily: "Inter_700Bold" }}>
              {userStats.totalAnswers > 0 ? `${accuracy}%` : "—"}
            </Text>
            <Text style={{ color: colors.subForeground, fontSize: fs(12), marginTop: 2 }}>Точность</Text>
            <Text style={{ position: "absolute", bottom: 8, right: 10, fontSize: 34, opacity: 0.18 }}>🎯</Text>
          </View>

          {/* Tasks */}
          <View style={[styles.statCard, {
            backgroundColor: colors.primary + "10",
            borderColor: colors.primary + "25",
            borderRadius: colors.radius,
          }]}>
            <View style={[styles.statCardIcon, { backgroundColor: colors.primary + "20" }]}>
              <Feather name="check-circle" size={16} color={colors.primary} />
            </View>
            <Text style={{ color: colors.foreground, fontSize: fs(26), fontWeight: "900", fontFamily: "Inter_700Bold" }}>
              {userStats.solvedTasks}
            </Text>
            <Text style={{ color: colors.subForeground, fontSize: fs(12), marginTop: 2 }}>Заданий</Text>
            <Text style={{ position: "absolute", bottom: 8, right: 10, fontSize: 34, opacity: 0.18 }}>✅</Text>
          </View>

          {/* League */}
          <View style={[styles.statCard, {
            backgroundColor: "#F59E0B12",
            borderColor: "#F59E0B28",
            borderRadius: colors.radius,
          }]}>
            <View style={[styles.statCardIcon, { backgroundColor: "#F59E0B22" }]}>
              <Feather name="award" size={16} color="#F59E0B" />
            </View>
            <Text style={{ color: colors.foreground, fontSize: fs(18), fontWeight: "900", fontFamily: "Inter_700Bold" }}>
              {LEAGUE_NAMES[userStats.league - 1]}
            </Text>
            <Text style={{ color: colors.subForeground, fontSize: fs(12), marginTop: 2 }}>Лига</Text>
            <Text style={{ position: "absolute", bottom: 8, right: 10, fontSize: 34, opacity: 0.18 }}>🏆</Text>
          </View>
        </View>

        {/* ── MATH TIP OF THE DAY ── */}
        <View style={[styles.tipCard, {
          backgroundColor: colors.card,
          borderColor: colors.primary + "30",
          borderRadius: colors.radius,
        }]}>
          <View style={[styles.tipHeader, { backgroundColor: colors.primary + "14" }]}>
            <Text style={{ fontSize: 16 }}>{ogeTip.icon}</Text>
            <Text style={{ color: colors.primary, fontSize: fs(12), fontWeight: "700", letterSpacing: 0.4 }}>
              СОВЕТ ДНЯ
            </Text>
            <View style={{ flex: 1 }} />
            <Feather name="book-open" size={13} color={colors.primary + "80"} />
          </View>
          <View style={styles.tipBody}>
            <Text style={{ color: colors.foreground, fontSize: fs(14), fontWeight: "700", fontFamily: "Inter_700Bold", marginBottom: 4 }}>
              {ogeTip.title}
            </Text>
            <Text style={{ color: colors.subForeground, fontSize: fs(13), lineHeight: fs(13) * 1.5 }}>
              {ogeTip.body}
            </Text>
          </View>
        </View>

        {/* ── CHAPTER PROGRESS ── */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <View style={styles.cardHeader}>
            <Text style={{ flex: 1, color: colors.foreground, fontSize: fs(15), fontWeight: "700", fontFamily: "Inter_700Bold" }}>
              📚 Прогресс по разделам
            </Text>
          </View>
          {chapters.map((ch) => {
            const done = ch.nodes.filter((n) => userStats.completedNodeIds.includes(n.id)).length;
            const pct = done / ch.nodes.length;
            return (
              <View key={ch.id} style={styles.chRow}>
                <View style={[styles.chDot, { backgroundColor: ch.color + "25" }]}>
                  <Feather name={ch.iconName as any} size={13} color={ch.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
                    <Text style={{ color: colors.foreground, fontSize: fs(13), fontWeight: "600" }} numberOfLines={1}>{ch.title}</Text>
                    <Text style={{ color: pct === 1 ? colors.green : colors.subForeground, fontSize: fs(12), fontWeight: "700" }}>{done}/{ch.nodes.length}</Text>
                  </View>
                  <View style={[styles.chBar, { backgroundColor: colors.track }]}>
                    <View style={[styles.chFill, { backgroundColor: ch.color, width: `${pct * 100}%` }]} />
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
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  content: { paddingHorizontal: 20, gap: 14 },

  // Mascot card
  mascotCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    overflow: "visible",
    gap: 12,
  },
  mascotImageWrap: {
    width: 106,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: -16,
    marginTop: -8,
  },
  mascotContent: { flex: 1, gap: 6 },
  levelRow: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 4 },
  xpTrack: { flex: 1, height: 6, borderRadius: 3, overflow: "hidden" },
  xpFill: { height: "100%", borderRadius: 3 },

  // Lesson card
  lessonCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 12,
    minHeight: 120,
  },
  lessonBlob: { position: "absolute" },
  lessonLeft: { flex: 1, gap: 4 },
  lessonTags: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  lessonTypePill: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  lessonXpPill: {
    backgroundColor: "rgba(0,0,0,0.22)",
    paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20,
  },
  playBtn: {
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1.5, borderColor: "rgba(255,255,255,0.35)",
  },

  // Done card
  doneCard: {
    flexDirection: "row", alignItems: "center", gap: 14,
    padding: 18, borderWidth: 1,
  },

  // Generic card
  card: { padding: 16, borderWidth: 1, gap: 14 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  cardIconCircle: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },

  // Daily goal
  progressTrack: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4 },
  goalFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  goalDoneRow: { flexDirection: "row", alignItems: "center", gap: 6 },

  // Streak
  weekRow: { flexDirection: "row", justifyContent: "space-between" },
  dayItem: { alignItems: "center", gap: 6 },
  dayCircle: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: "center", justifyContent: "center",
  },

  // Stats grid
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  statCard: {
    flexBasis: "47%", flexGrow: 1, padding: 14,
    borderWidth: 1, minHeight: 110, overflow: "hidden",
    position: "relative",
  },
  statCardIcon: {
    width: 32, height: 32, borderRadius: 9,
    alignItems: "center", justifyContent: "center", marginBottom: 8,
  },

  // Chapter progress
  chRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  chDot: { width: 30, height: 30, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  chBar: { height: 5, borderRadius: 3, overflow: "hidden" },
  chFill: { height: "100%", borderRadius: 3 },

  // OGE countdown
  ogeCard: {
    flexDirection: "row", alignItems: "center",
    padding: 16, gap: 14, borderWidth: 1,
  },
  ogeIconWrap: {
    width: 50, height: 50, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
  },
  ogeRight: { alignItems: "center", justifyContent: "center" },

  // Math tip
  tipCard: { borderWidth: 1, overflow: "hidden" },
  tipHeader: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: 16, paddingVertical: 10,
  },
  tipBody: { padding: 16 },
});
