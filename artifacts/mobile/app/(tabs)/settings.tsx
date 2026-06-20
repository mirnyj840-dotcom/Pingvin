import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Switch,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useApp } from "@/contexts/AppContext";
import { useTheme } from "@/hooks/useTheme";
import Mascot, { MascotType } from "@/components/Mascot";
import THEMES, { ThemeId } from "@/constants/themes";
import type { FontSize, DailyXpGoal } from "@/contexts/AppContext";

const MASCOT_OPTIONS: { type: MascotType; name: string }[] = [
  { type: "penguin", name: "Пингвин" },
  { type: "raccoon", name: "Енот" },
  { type: "bear", name: "Медведь" },
];

const FONT_SIZES: { id: FontSize; label: string; previewSize: number }[] = [
  { id: "small", label: "Маленький", previewSize: 12 },
  { id: "medium", label: "Средний", previewSize: 15 },
  { id: "large", label: "Большой", previewSize: 19 },
];

const DAILY_GOALS: { value: DailyXpGoal; label: string }[] = [
  { value: 25, label: "25 XP" },
  { value: 50, label: "50 XP" },
  { value: 100, label: "100 XP" },
  { value: 150, label: "150 XP" },
];

const AVATAR_COLORS = [
  "#6366F1", "#8B5CF6", "#A855F7", "#EC4899",
  "#FF7EB6", "#F59E0B", "#FF8A3D", "#EF4444",
  "#10B981", "#14B8A6", "#3B82F6", "#06B6D4",
  "#D97706", "#059669", "#7C3AED", "#DB2777",
];

export default function SettingsScreen() {
  const { colors, fs } = useTheme();
  const insets = useSafeAreaInsets();
  const { settings, updateSettings, resetProgress } = useApp();

  const pt = insets.top + (Platform.OS === "web" ? 67 : 0);
  const pb = insets.bottom + (Platform.OS === "web" ? 34 : 0);

  const tap = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

  const handleReset = () => {
    Alert.alert(
      "Сбросить прогресс?",
      "Весь прогресс, XP и стрик будут удалены. Это действие нельзя отменить.",
      [
        { text: "Отмена", style: "cancel" },
        { text: "Сбросить", style: "destructive", onPress: () => resetProgress() },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: pt + 8 }]}>
        <Feather name="settings" size={20} color={colors.primary} />
        <Text style={[styles.headerTitle, { color: colors.foreground, fontSize: fs(20) }]}>
          Настройки
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: pb + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Theme */}
        <SectionCard title="Тема" iconName="moon" colors={colors} fs={fs}>
          <View style={styles.themeGrid}>
            {(Object.values(THEMES) as (typeof THEMES)[ThemeId][]).map((theme) => (
              <TouchableOpacity
                key={theme.id}
                onPress={async () => { await tap(); updateSettings({ theme: theme.id }); }}
                style={[
                  styles.themeCard,
                  {
                    backgroundColor: theme.colors.card,
                    borderColor: settings.theme === theme.id ? theme.colors.primary : theme.colors.border,
                    borderWidth: settings.theme === theme.id ? 2.5 : 1.5,
                    borderRadius: theme.colors.radius,
                  },
                ]}
              >
                <View style={[styles.themePreview, { backgroundColor: theme.colors.background, borderRadius: theme.colors.radius * 0.6 }]}>
                  <View style={[styles.themeDot, { backgroundColor: theme.colors.primary }]} />
                  <View style={[styles.themeBar, { backgroundColor: theme.colors.primary + "60" }]} />
                  <View style={[styles.themeBarShort, { backgroundColor: theme.colors.primary + "30" }]} />
                </View>
                <Text style={[styles.themeLabel, {
                  color: settings.theme === theme.id ? theme.colors.primary : colors.foreground,
                  fontWeight: settings.theme === theme.id ? "700" : "500",
                  fontSize: fs(13),
                }]}>
                  {theme.nameRu}
                </Text>
                {settings.theme === theme.id && (
                  <View style={[styles.themeCheck, { backgroundColor: theme.colors.primary }]}>
                    <Feather name="check" size={10} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </SectionCard>

        {/* Daily Goal */}
        <SectionCard title="Дневная цель" iconName="target" colors={colors} fs={fs}>
          <View style={styles.goalRow}>
            {DAILY_GOALS.map((g) => (
              <TouchableOpacity
                key={g.value}
                onPress={async () => { await tap(); updateSettings({ dailyXpGoal: g.value }); }}
                style={[
                  styles.goalOption,
                  {
                    flex: 1,
                    backgroundColor: settings.dailyXpGoal === g.value ? colors.primary + "18" : colors.secondary,
                    borderColor: settings.dailyXpGoal === g.value ? colors.primary : colors.border,
                    borderWidth: settings.dailyXpGoal === g.value ? 2 : 1.5,
                    borderRadius: colors.radius * 0.7,
                  },
                ]}
              >
                <Feather name="zap" size={14} color={settings.dailyXpGoal === g.value ? colors.primary : colors.mutedForeground} />
                <Text style={{
                  color: settings.dailyXpGoal === g.value ? colors.primary : colors.subForeground,
                  fontWeight: settings.dailyXpGoal === g.value ? "700" : "500",
                  fontSize: fs(12),
                  marginTop: 2,
                }}>
                  {g.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </SectionCard>

        {/* Font Size */}
        <SectionCard title="Размер шрифта" iconName="type" colors={colors} fs={fs}>
          <View style={styles.fontRow}>
            {FONT_SIZES.map((f) => (
              <TouchableOpacity
                key={f.id}
                onPress={async () => { await tap(); updateSettings({ fontSize: f.id }); }}
                style={[
                  styles.fontOption,
                  {
                    flex: 1,
                    backgroundColor: settings.fontSize === f.id ? colors.primary + "15" : colors.secondary,
                    borderColor: settings.fontSize === f.id ? colors.primary : colors.border,
                    borderWidth: settings.fontSize === f.id ? 2 : 1.5,
                    borderRadius: colors.radius * 0.7,
                  },
                ]}
              >
                <Text style={{
                  fontSize: f.previewSize,
                  color: settings.fontSize === f.id ? colors.primary : colors.foreground,
                  fontWeight: "700",
                  fontFamily: "Inter_700Bold",
                }}>
                  Aa
                </Text>
                <Text style={{
                  fontSize: 11,
                  color: settings.fontSize === f.id ? colors.primary : colors.subForeground,
                  marginTop: 3,
                }}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={{ color: colors.mutedForeground, fontSize: fs(11), textAlign: "center" }}>
            Размер влияет на весь текст приложения
          </Text>
        </SectionCard>

        {/* Mascot */}
        <SectionCard title="Маскот" iconName="smile" colors={colors} fs={fs}>
          <View style={styles.mascotRow}>
            {MASCOT_OPTIONS.map((m) => (
              <TouchableOpacity
                key={m.type}
                onPress={async () => { await tap(); updateSettings({ mascot: m.type }); }}
                style={[
                  styles.mascotOption,
                  {
                    flex: 1,
                    backgroundColor: settings.mascot === m.type ? colors.primary + "15" : colors.secondary,
                    borderColor: settings.mascot === m.type ? colors.primary : colors.border,
                    borderWidth: settings.mascot === m.type ? 2.5 : 1.5,
                    borderRadius: colors.radius,
                  },
                ]}
              >
                <Mascot type={m.type} size={56} animated={settings.mascot === m.type} />
                <Text style={{
                  fontSize: fs(12), fontWeight: "600",
                  color: settings.mascot === m.type ? colors.primary : colors.subForeground,
                }}>
                  {m.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </SectionCard>

        {/* Avatar Color — 16 colors, 4 per row */}
        <SectionCard title="Цвет аватара" iconName="user" colors={colors} fs={fs}>
          <View style={styles.colorGrid}>
            {AVATAR_COLORS.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={async () => { await tap(); updateSettings({ avatarColor: c }); }}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: c },
                  settings.avatarColor === c && styles.colorSwatchSelected,
                ]}
              >
                {settings.avatarColor === c && <Feather name="check" size={14} color="white" />}
              </TouchableOpacity>
            ))}
          </View>
        </SectionCard>

        {/* Toggles */}
        <SectionCard title="Прочее" iconName="sliders" colors={colors} fs={fs}>
          <ToggleRow label="Звук" icon="volume-2" value={settings.soundEnabled ?? true}
            onToggle={(v) => updateSettings({ soundEnabled: v })} colors={colors} fs={fs} />
          <ToggleRow label="Вибрация" icon="smartphone" value={settings.vibrationEnabled ?? true}
            onToggle={(v) => updateSettings({ vibrationEnabled: v })} colors={colors} fs={fs} />
          <ToggleRow label="Уведомления" icon="bell" value={false}
            onToggle={() => {}} colors={colors} fs={fs} disabled />
          <ToggleRow label="Язык: Русский" icon="globe" value={true}
            onToggle={() => {}} colors={colors} fs={fs} disabled last />
        </SectionCard>

        {/* App info */}
        <SectionCard title="О приложении" iconName="info" colors={colors} fs={fs}>
          <InfoRow label="Версия" value="1.0.0" colors={colors} fs={fs} />
          <InfoRow label="Контент" value="ОГЭ Математика 2025" colors={colors} fs={fs} last />
        </SectionCard>

        <TouchableOpacity
          onPress={handleReset}
          style={[styles.dangerButton, {
            borderColor: colors.red + "50",
            backgroundColor: colors.red + "10",
            borderRadius: colors.radius,
          }]}
        >
          <Feather name="trash-2" size={16} color={colors.red} />
          <Text style={{ color: colors.red, fontSize: fs(15), fontWeight: "600" }}>
            Сбросить прогресс
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function SectionCard({ title, iconName, children, colors, fs }: {
  title: string; iconName: keyof typeof Feather.glyphMap;
  children: React.ReactNode;
  colors: ReturnType<typeof useTheme>["colors"];
  fs: ReturnType<typeof useTheme>["fs"];
}) {
  return (
    <View style={[styles.sectionCard, {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderRadius: colors.radius,
    }]}>
      <View style={styles.sectionTitleRow}>
        <Feather name={iconName} size={15} color={colors.primary} />
        <Text style={[styles.sectionTitle, { color: colors.foreground, fontSize: fs(15) }]}>
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}

function ToggleRow({ label, icon, value, onToggle, colors, fs, disabled, last }: {
  label: string; icon: keyof typeof Feather.glyphMap;
  value: boolean; onToggle: (v: boolean) => void;
  colors: ReturnType<typeof useTheme>["colors"];
  fs: ReturnType<typeof useTheme>["fs"];
  disabled?: boolean; last?: boolean;
}) {
  return (
    <View style={[styles.toggleRow, {
      borderBottomColor: colors.border,
      borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth,
    }]}>
      <Feather name={icon} size={16} color={disabled ? colors.mutedForeground : colors.primary} />
      <Text style={{ flex: 1, fontSize: fs(14), color: disabled ? colors.mutedForeground : colors.foreground }}>
        {label}
      </Text>
      <Switch
        value={value} onValueChange={disabled ? undefined : onToggle} disabled={disabled}
        trackColor={{ false: colors.track, true: colors.primary + "60" }}
        thumbColor={value ? colors.primary : colors.mutedForeground}
        ios_backgroundColor={colors.track}
      />
    </View>
  );
}

function InfoRow({ label, value, colors, fs, last }: {
  label: string; value: string;
  colors: ReturnType<typeof useTheme>["colors"];
  fs: ReturnType<typeof useTheme>["fs"];
  last?: boolean;
}) {
  return (
    <View style={[styles.infoRow, {
      borderBottomColor: colors.border,
      borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth,
    }]}>
      <Text style={{ fontSize: fs(14), color: colors.subForeground }}>{label}</Text>
      <Text style={{ fontSize: fs(14), fontWeight: "600", color: colors.foreground }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 20, paddingBottom: 12 },
  headerTitle: { flex: 1, fontWeight: "700", fontFamily: "Inter_700Bold" },
  content: { paddingHorizontal: 20, gap: 14 },

  sectionCard: { padding: 16, borderWidth: 1, gap: 14 },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionTitle: { fontWeight: "700", fontFamily: "Inter_700Bold" },

  themeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  themeCard: { width: "47%", padding: 10, gap: 8, position: "relative", overflow: "hidden" },
  themePreview: { height: 52, padding: 10, gap: 6 },
  themeDot: { width: 16, height: 16, borderRadius: 8 },
  themeBar: { height: 6, borderRadius: 3, width: "80%" },
  themeBarShort: { height: 6, borderRadius: 3, width: "50%" },
  themeLabel: { textAlign: "center", fontFamily: "Inter_600SemiBold" },
  themeCheck: { position: "absolute", top: 8, right: 8, width: 18, height: 18, borderRadius: 9, alignItems: "center", justifyContent: "center" },

  goalRow: { flexDirection: "row", gap: 8 },
  goalOption: { padding: 12, alignItems: "center", gap: 4 },

  fontRow: { flexDirection: "row", gap: 10 },
  fontOption: { padding: 14, alignItems: "center", gap: 4 },

  mascotRow: { flexDirection: "row", gap: 10 },
  mascotOption: { alignItems: "center", padding: 12, gap: 6 },

  colorGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  colorSwatch: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  colorSwatchSelected: { transform: [{ scale: 1.18 }], shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 },

  toggleRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10 },

  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10 },

  dangerButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, padding: 16, borderWidth: 1, marginBottom: 8 },
});
