import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { chapters } from "@/data/curriculum";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/utils/supabase";

export type MascotType = "penguin" | "raccoon" | "bear";
export type ThemeId = "space" | "classic" | "pink" | "dawn";
export type FontSize = "small" | "medium" | "large";
export type DailyXpGoal = 25 | 50 | 100 | 150;

export interface AppSettings {
  theme: ThemeId;
  fontSize: FontSize;
  mascot: MascotType;
  avatarColor: string;
  dailyXpGoal: DailyXpGoal;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface UserStats {
  name: string;
  surname: string;
  patronymic: string;
  groupNumber: string;
  onboardingDone: boolean;
  isLoaded: boolean;
  xp: number;
  streak: number;
  longestStreak: number;
  completedNodeIds: string[];
  unlockedAchievementIds: string[];
  dailyXp: number;
  dailyXpDate: string;
  league: number;
  streakFreezes: number;
  weeklyDates: string[];
  solvedTasks: number;
  correctAnswers: number;
  totalAnswers: number;
}

export interface LessonResult {
  correct: number;
  total: number;
  xpEarned: number;
  passed: boolean;
  alreadyDone: boolean;
  isStreakDay: boolean;
}

interface AppContextValue {
  userStats: UserStats;
  settings: AppSettings;
  loadedUserId: string | null;
  syncError: string | null;
  retrySync: () => Promise<void>;
  completeOnboarding: (
    name: string,
    mascot: MascotType,
    profile?: {
      surname: string;
      patronymic: string;
      groupNumber: string;
    }
  ) => Promise<void>;
  completeNode: (
    nodeId: string,
    correct: number,
    total: number
  ) => Promise<LessonResult>;
  updateSettings: (patch: Partial<AppSettings>) => Promise<void>;
  nodeStatus: (nodeId: string) => "locked" | "active" | "done";
  weekStreak: () => boolean[];
  nextLessonId: () => string | null;
  resetProgress: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

// Curriculum v4 is a new course. Legacy lesson completion must not unlock it.
const STORAGE_KEY = "oge_app_v4";
const LEGACY_STORAGE_KEYS = ["oge_app_v3", "oge_app_v2"];
const USER_STORAGE_PREFIX = `${STORAGE_KEY}:user:`;
const LEGACY_OWNER_KEY = `${STORAGE_KEY}:supabase-owner`;
// Owner preview mode: unlock the whole path only in the local development build.
// Production builds keep the normal sequential lesson progression.
const OWNER_PREVIEW_MODE = __DEV__;

const DEFAULT_SETTINGS: AppSettings = {
  theme: "space",
  fontSize: "medium",
  mascot: "penguin",
  avatarColor: "#6366F1",
  dailyXpGoal: 50,
  soundEnabled: true,
  vibrationEnabled: true,
};

const DEFAULT_STATS: UserStats = {
  name: "Ученик",
  surname: "",
  patronymic: "",
  groupNumber: "",
  onboardingDone: false,
  isLoaded: false,
  xp: 0,
  streak: 0,
  longestStreak: 0,
  completedNodeIds: [],
  unlockedAchievementIds: [],
  dailyXp: 0,
  dailyXpDate: "",
  league: 1,
  streakFreezes: 1,
  weeklyDates: [],
  solvedTasks: 0,
  correctAnswers: 0,
  totalAnswers: 0,
};

interface PersistedAppData {
  stats: UserStats;
  settings: AppSettings;
  updatedAt: string | null;
}

function getUserStorageKey(userId: string): string {
  return `${USER_STORAGE_PREFIX}${userId}`;
}

function parsePersistedAppData(
  value: unknown,
  updatedAtOverride?: unknown
): PersistedAppData | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const rawStats = record.stats;
  const rawSettings = record.settings;
  if (
    !rawStats ||
    typeof rawStats !== "object" ||
    !rawSettings ||
    typeof rawSettings !== "object"
  ) {
    return null;
  }

  const stats = {
    ...DEFAULT_STATS,
    ...(rawStats as Partial<UserStats>),
    isLoaded: false,
  };
  const settings = {
    ...DEFAULT_SETTINGS,
    ...(rawSettings as Partial<AppSettings>),
  };
  if (settings.theme === ("noir" as ThemeId)) settings.theme = "classic";
  if (settings.theme === ("nordic" as ThemeId)) settings.theme = "pink";

  const savedAt =
    typeof updatedAtOverride === "string"
      ? updatedAtOverride
      : typeof record.updatedAt === "string"
        ? record.updatedAt
        : null;

  return { stats, settings, updatedAt: savedAt };
}

function createPersistedAppData(
  stats: UserStats,
  settings: AppSettings,
  updatedAt: string | null = new Date().toISOString()
): PersistedAppData {
  const { isLoaded: _isLoaded, ...savedStats } = stats;
  return {
    stats: { ...savedStats, isLoaded: false },
    settings,
    updatedAt,
  };
}

async function readStoredAppData(key: string): Promise<PersistedAppData | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? parsePersistedAppData(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

async function readLegacyAppData(): Promise<PersistedAppData | null> {
  for (const key of [STORAGE_KEY, ...LEGACY_STORAGE_KEYS]) {
    const saved = await readStoredAppData(key);
    if (saved) return saved;
  }
  return null;
}

async function claimLegacyAppData(
  userId: string
): Promise<PersistedAppData | null> {
  const claimedBy = await AsyncStorage.getItem(LEGACY_OWNER_KEY);
  if (claimedBy) return null;

  const legacyData = await readLegacyAppData();
  if (!legacyData) return null;

  await AsyncStorage.setItem(
    getUserStorageKey(userId),
    JSON.stringify(legacyData)
  );
  await AsyncStorage.setItem(LEGACY_OWNER_KEY, userId);
  return legacyData;
}

async function writeRemoteAppData(
  userId: string,
  appData: PersistedAppData
): Promise<string> {
  const updatedAt = appData.updatedAt ?? new Date().toISOString();
  const { data, error } = await supabase
    .from("student_app_state")
    .upsert(
      {
        user_id: userId,
        state: {
          version: 1,
          stats: appData.stats,
          settings: appData.settings,
        },
        updated_at: updatedAt,
      },
      { onConflict: "user_id" }
    )
    .select("updated_at")
    .single();

  if (error) throw error;
  return typeof data.updated_at === "string" ? data.updated_at : updatedAt;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const { session, isLoading: authIsLoading } = useAuth();
  const [userStats, setUserStats] = useState<UserStats>(DEFAULT_STATS);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());
  const userId = session?.user.id ?? null;

  useEffect(() => {
    if (authIsLoading) return;

    let isCurrent = true;
    setUserStats((current) => ({ ...current, isLoaded: false }));
    setLoadedUserId(null);
    setSyncError(null);

    const loadData = async () => {
      let loadedData: PersistedAppData = {
        stats: DEFAULT_STATS,
        settings: DEFAULT_SETTINGS,
        updatedAt: null,
      };

      try {
        if (!userId) {
          loadedData = (await readLegacyAppData()) ?? loadedData;
        } else {
          const userKey = getUserStorageKey(userId);
          const localData = await readStoredAppData(userKey);
          const { data: remoteRow, error } = await supabase
            .from("student_app_state")
            .select("state, updated_at")
            .eq("user_id", userId)
            .maybeSingle();

          if (error) {
            const claimedLegacyData = localData
              ? null
              : await claimLegacyAppData(userId);
            loadedData = localData ?? claimedLegacyData ?? loadedData;
            if (isCurrent) {
              setSyncError(
                "Облачные данные пока недоступны. Проверьте настройку Supabase; изменения остаются на устройстве."
              );
            }
          } else if (remoteRow) {
            const remoteData = parsePersistedAppData(
              remoteRow.state,
              remoteRow.updated_at
            );
            if (!remoteData) {
              loadedData = localData ?? loadedData;
              if (isCurrent) {
                setSyncError(
                  "Не удалось прочитать облачный профиль. Данные на устройстве сохранены."
                );
              }
            } else {
              const localTime = localData?.updatedAt
                ? Date.parse(localData.updatedAt)
                : 0;
              const remoteTime = remoteData.updatedAt
                ? Date.parse(remoteData.updatedAt)
                : 0;

              if (localData && localTime > remoteTime) {
                loadedData = localData;
                try {
                  const savedAt = await writeRemoteAppData(userId, localData);
                  loadedData = { ...localData, updatedAt: savedAt };
                  await AsyncStorage.setItem(
                    userKey,
                    JSON.stringify(loadedData)
                  );
                  await AsyncStorage.setItem(LEGACY_OWNER_KEY, userId);
                } catch {
                  if (isCurrent) {
                    setSyncError(
                      "Не удалось синхронизировать изменения. Они сохранены на устройстве."
                    );
                  }
                }
              } else {
                loadedData = remoteData;
                await AsyncStorage.setItem(
                  userKey,
                  JSON.stringify(remoteData)
                );
                if (isCurrent) setSyncError(null);
              }
            }
          } else {
            const claimedLegacyData = localData
              ? null
              : await claimLegacyAppData(userId);
            loadedData = localData ?? claimedLegacyData ?? loadedData;
            if (localData || claimedLegacyData) {
              try {
                const savedAt = await writeRemoteAppData(userId, loadedData);
                loadedData = { ...loadedData, updatedAt: savedAt };
                await AsyncStorage.setItem(
                  userKey,
                  JSON.stringify(loadedData)
                );
                await AsyncStorage.setItem(LEGACY_OWNER_KEY, userId);
                if (isCurrent) setSyncError(null);
              } catch {
                if (isCurrent) {
                  setSyncError(
                    "Не удалось загрузить данные в облако. Они сохранены на устройстве."
                  );
                }
              }
            }
          }
        }
      } catch {
        if (userId) {
          loadedData =
            (await readStoredAppData(getUserStorageKey(userId))) ??
            loadedData;
          if (isCurrent) {
            setSyncError(
              "Не удалось загрузить данные из Supabase. Локальная копия сохранена."
            );
          }
        }
      }

      if (!isCurrent) return;
      setUserStats({ ...loadedData.stats, isLoaded: true });
      setSettings(loadedData.settings);
      setLoadedUserId(userId);
    };

    void loadData();
    return () => {
      isCurrent = false;
    };
  }, [authIsLoading, userId]);

  async function saveData(stats: UserStats, sett: AppSettings) {
    const operation = saveQueue.current.then(async () => {
      const data = createPersistedAppData(stats, sett);
      const key = userId ? getUserStorageKey(userId) : STORAGE_KEY;

      try {
        await AsyncStorage.setItem(key, JSON.stringify(data));
      } catch {
        if (userId) {
          setSyncError("Не удалось сохранить данные на устройстве.");
        }
        return;
      }

      if (!userId) return;

      try {
        const savedAt = await writeRemoteAppData(userId, data);
        const savedData = { ...data, updatedAt: savedAt };
        await AsyncStorage.setItem(key, JSON.stringify(savedData));
        await AsyncStorage.setItem(LEGACY_OWNER_KEY, userId);
        setSyncError(null);
      } catch {
        setSyncError(
          "Не удалось синхронизировать данные. Они сохранены на устройстве; нажмите «Повторить»."
        );
      }
    });

    saveQueue.current = operation.catch(() => undefined);
    await operation;
  }

  async function retrySync(): Promise<void> {
    await saveData(userStats, settings);
  }

  async function completeOnboarding(
    name: string,
    mascot: MascotType,
    profile?: {
      surname: string;
      patronymic: string;
      groupNumber: string;
    }
  ): Promise<void> {
    const newStats = {
      ...userStats,
      name: name.trim(),
      onboardingDone: true,
      ...(profile
        ? {
            surname: profile.surname.trim(),
            patronymic: profile.patronymic.trim(),
            groupNumber: profile.groupNumber.trim(),
          }
        : {}),
    };
    const newSettings = { ...settings, mascot };
    setUserStats(newStats);
    setSettings(newSettings);
    await saveData(newStats, newSettings);
  }

  const nodeStatus = useCallback(
    (nodeId: string): "locked" | "active" | "done" => {
      if (userStats.completedNodeIds.includes(nodeId)) return "done";
      if (OWNER_PREVIEW_MODE) return "active";

      let chapterIdx = -1;
      let nodeIdx = -1;
      for (let ci = 0; ci < chapters.length; ci++) {
        const ni = chapters[ci].nodes.findIndex((n) => n.id === nodeId);
        if (ni !== -1) {
          chapterIdx = ci;
          nodeIdx = ni;
          break;
        }
      }
      if (chapterIdx === -1) return "locked";
      if (chapterIdx === 0 && nodeIdx === 0) return "active";

      let prevNodeId: string | null = null;
      if (nodeIdx > 0) {
        prevNodeId = chapters[chapterIdx].nodes[nodeIdx - 1].id;
      } else if (chapterIdx > 0) {
        const prevChapter = chapters[chapterIdx - 1];
        prevNodeId = prevChapter.nodes[prevChapter.nodes.length - 1].id;
      }

      if (prevNodeId && userStats.completedNodeIds.includes(prevNodeId))
        return "active";
      return "locked";
    },
    [userStats.completedNodeIds]
  );

  async function completeNode(
    nodeId: string,
    correct: number,
    total: number
  ): Promise<LessonResult> {
    const status = nodeStatus(nodeId);
    if (status === "done") {
      return {
        correct,
        total,
        xpEarned: 0,
        passed: true,
        alreadyDone: true,
        isStreakDay: false,
      };
    }

    let xpReward = 20;
    for (const ch of chapters) {
      const node = ch.nodes.find((n) => n.id === nodeId);
      if (node) {
        xpReward = node.xpReward;
        break;
      }
    }

    const passed = total === 0 || correct / total >= 0.8;
    const xpEarned = passed ? xpReward : Math.floor(xpReward * 0.15);

    const today = new Date().toISOString().split("T")[0];
    const hadToday = userStats.weeklyDates.includes(today);

    const dailyXp =
      userStats.dailyXpDate === today
        ? userStats.dailyXp + xpEarned
        : xpEarned;
    const weeklyDates = hadToday
      ? userStats.weeklyDates
      : [...userStats.weeklyDates, today];

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().split("T")[0];
    const hadYesterday = userStats.weeklyDates.includes(yStr);
    let newStreak = userStats.streak;
    if (!hadToday) {
      newStreak = hadYesterday ? userStats.streak + 1 : 1;
    }

    const newLongestStreak = Math.max(userStats.longestStreak, newStreak);

    const newXp = userStats.xp + xpEarned;
    let newLeague = userStats.league;
    if (newXp >= 2000) newLeague = 5;
    else if (newXp >= 1200) newLeague = 4;
    else if (newXp >= 700) newLeague = 3;
    else if (newXp >= 300) newLeague = 2;

    const newCompletedIds = passed
      ? [...userStats.completedNodeIds, nodeId]
      : userStats.completedNodeIds;

    const newStats: UserStats = {
      ...userStats,
      xp: newXp,
      streak: newStreak,
      longestStreak: newLongestStreak,
      completedNodeIds: newCompletedIds,
      dailyXp,
      dailyXpDate: today,
      weeklyDates,
      solvedTasks: userStats.solvedTasks + 1,
      correctAnswers: userStats.correctAnswers + correct,
      totalAnswers: userStats.totalAnswers + total,
      league: newLeague,
    };

    setUserStats(newStats);
    await saveData(newStats, settings);

    const isStreakDay = passed && !hadToday;
    return { correct, total, xpEarned, passed, alreadyDone: false, isStreakDay };
  }

  async function updateSettings(patch: Partial<AppSettings>): Promise<void> {
    const newSettings = { ...settings, ...patch };
    setSettings(newSettings);
    await saveData(userStats, newSettings);
  }

  function weekStreak(): boolean[] {
    const result: boolean[] = [];
    const today = new Date();
    // Найдём понедельник текущей недели
    const dayOfWeek = today.getDay(); // 0=Вс, 1=Пн, ..., 6=Сб
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      result.push(userStats.weeklyDates.includes(d.toISOString().split("T")[0]));
    }
    return result;
  }

  function nextLessonId(): string | null {
    for (const ch of chapters) {
      for (const node of ch.nodes) {
        if (nodeStatus(node.id) === "active") return node.id;
      }
    }
    return null;
  }

  async function resetProgress(): Promise<void> {
    const newStats = { ...DEFAULT_STATS, isLoaded: true };
    setUserStats(newStats);
    setSettings(DEFAULT_SETTINGS);
    await saveData(newStats, DEFAULT_SETTINGS);
  }

  return (
    <AppContext.Provider
      value={{
        userStats,
        settings,
        loadedUserId,
        syncError,
        retrySync,
        completeOnboarding,
        completeNode,
        updateSettings,
        nodeStatus,
        weekStreak,
        nextLessonId,
        resetProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
