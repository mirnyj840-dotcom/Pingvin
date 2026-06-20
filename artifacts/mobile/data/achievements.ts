export interface Achievement {
  id: string;
  iconName: string;
  iconColor: string;
  label: string;
  description: string;
  isUnlocked: (stats: {
    xp: number;
    streak: number;
    longestStreak?: number;
    solvedTasks: number;
    correctAnswers: number;
    totalAnswers: number;
    completedNodeIds: string[];
  }) => boolean;
}

export const achievements: Achievement[] = [
  {
    id: "first_lesson",
    iconName: "star",
    iconColor: "#F59E0B",
    label: "Первый шаг",
    description: "Пройти первый урок",
    isUnlocked: ({ completedNodeIds }) => completedNodeIds.length >= 1,
  },
  {
    id: "streak_3",
    iconName: "zap",
    iconColor: "#EF4444",
    label: "3 дня подряд",
    description: "Заниматься 3 дня без перерыва",
    isUnlocked: ({ streak }) => streak >= 3,
  },
  {
    id: "streak_7",
    iconName: "zap",
    iconColor: "#DC2626",
    label: "Неделя силы",
    description: "Заниматься 7 дней подряд",
    isUnlocked: ({ streak }) => streak >= 7,
  },
  {
    id: "streak_30",
    iconName: "zap",
    iconColor: "#B91C1C",
    label: "Марафонец",
    description: "Заниматься 30 дней подряд",
    isUnlocked: ({ streak }) => streak >= 30,
  },
  {
    id: "xp_100",
    iconName: "award",
    iconColor: "#6366F1",
    label: "100 XP",
    description: "Набрать 100 опыта",
    isUnlocked: ({ xp }) => xp >= 100,
  },
  {
    id: "xp_500",
    iconName: "award",
    iconColor: "#4F46E5",
    label: "500 XP",
    description: "Набрать 500 опыта",
    isUnlocked: ({ xp }) => xp >= 500,
  },
  {
    id: "xp_1000",
    iconName: "award",
    iconColor: "#F59E0B",
    label: "1000 XP",
    description: "Набрать 1000 опыта",
    isUnlocked: ({ xp }) => xp >= 1000,
  },
  {
    id: "accuracy_90",
    iconName: "target",
    iconColor: "#10B981",
    label: "Снайпер",
    description: "Точность 90%+ на 10+ вопросах",
    isUnlocked: ({ correctAnswers, totalAnswers }) =>
      totalAnswers >= 10 && correctAnswers / totalAnswers >= 0.9,
  },
  {
    id: "accuracy_100",
    iconName: "target",
    iconColor: "#059669",
    label: "Отличник",
    description: "100% точность на 5+ вопросах",
    isUnlocked: ({ correctAnswers, totalAnswers }) =>
      totalAnswers >= 5 && correctAnswers === totalAnswers,
  },
  {
    id: "tasks_10",
    iconName: "check-circle",
    iconColor: "#3B82F6",
    label: "10 заданий",
    description: "Решить 10 заданий",
    isUnlocked: ({ solvedTasks }) => solvedTasks >= 10,
  },
  {
    id: "tasks_50",
    iconName: "check-circle",
    iconColor: "#2563EB",
    label: "50 заданий",
    description: "Решить 50 заданий",
    isUnlocked: ({ solvedTasks }) => solvedTasks >= 50,
  },
  {
    id: "tasks_100",
    iconName: "check-circle",
    iconColor: "#1D4ED8",
    label: "100 заданий",
    description: "Решить 100 заданий",
    isUnlocked: ({ solvedTasks }) => solvedTasks >= 100,
  },
  {
    id: "chapter_numbers",
    iconName: "book",
    iconColor: "#6366F1",
    label: "Числовой мастер",
    description: "Пройти главу «Числа»",
    isUnlocked: ({ completedNodeIds }) =>
      ["numbers_theory", "numbers_quiz", "numbers_boss"].every((id) =>
        completedNodeIds.includes(id)
      ),
  },
  {
    id: "chapter_algebra",
    iconName: "book",
    iconColor: "#8B5CF6",
    label: "Алгебраист",
    description: "Пройти главу «Алгебра»",
    isUnlocked: ({ completedNodeIds }) =>
      ["algebra_theory", "algebra_quiz", "algebra_boss"].every((id) =>
        completedNodeIds.includes(id)
      ),
  },
  {
    id: "chapter_geometry",
    iconName: "book",
    iconColor: "#3B82F6",
    label: "Геометр",
    description: "Пройти главу «Геометрия»",
    isUnlocked: ({ completedNodeIds }) =>
      ["geo_theory", "geo_quiz"].every((id) =>
        completedNodeIds.includes(id)
      ),
  },
  {
    id: "five_chapters",
    iconName: "map",
    iconColor: "#EC4899",
    label: "Исследователь",
    description: "Начать 5 разных глав",
    isUnlocked: ({ completedNodeIds }) => {
      const started = new Set(
        completedNodeIds.map((id) => id.split("_")[0])
      );
      return started.size >= 5;
    },
  },
];
