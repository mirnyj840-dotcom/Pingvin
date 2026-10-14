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
  // ─── First Steps ───
  {
    id: "first_lesson",
    iconName: "star",
    iconColor: "#F59E0B",
    label: "Первый шаг",
    description: "Пройти первый урок",
    isUnlocked: ({ completedNodeIds }) => completedNodeIds.length >= 1,
  },
  {
    id: "five_lessons",
    iconName: "star",
    iconColor: "#F97316",
    label: "Пять уроков",
    description: "Пройти 5 уроков",
    isUnlocked: ({ completedNodeIds }) => completedNodeIds.length >= 5,
  },
  {
    id: "ten_lessons",
    iconName: "star",
    iconColor: "#EF4444",
    label: "10 уроков",
    description: "Пройти 10 уроков",
    isUnlocked: ({ completedNodeIds }) => completedNodeIds.length >= 10,
  },

  // ─── Streak ───
  {
    id: "streak_3",
    iconName: "zap",
    iconColor: "#FB923C",
    label: "3 дня подряд",
    description: "Заниматься 3 дня без перерыва",
    isUnlocked: ({ streak }) => streak >= 3,
  },
  {
    id: "streak_7",
    iconName: "zap",
    iconColor: "#EF4444",
    label: "Неделя силы",
    description: "Заниматься 7 дней подряд",
    isUnlocked: ({ streak }) => streak >= 7,
  },
  {
    id: "streak_14",
    iconName: "zap",
    iconColor: "#DC2626",
    label: "Две недели",
    description: "Заниматься 14 дней подряд",
    isUnlocked: ({ streak }) => streak >= 14,
  },
  {
    id: "streak_21",
    iconName: "zap",
    iconColor: "#B91C1C",
    label: "3 недели огня!",
    description: "Заниматься 21 день подряд",
    isUnlocked: ({ streak }) => streak >= 21,
  },
  {
    id: "streak_30",
    iconName: "zap",
    iconColor: "#991B1B",
    label: "Марафонец",
    description: "Заниматься 30 дней подряд",
    isUnlocked: ({ streak }) => streak >= 30,
  },

  // ─── XP ───
  {
    id: "xp_100",
    iconName: "award",
    iconColor: "#8B5CF6",
    label: "100 XP",
    description: "Набрать 100 опыта",
    isUnlocked: ({ xp }) => xp >= 100,
  },
  {
    id: "xp_250",
    iconName: "award",
    iconColor: "#7C3AED",
    label: "250 XP",
    description: "Набрать 250 опыта",
    isUnlocked: ({ xp }) => xp >= 250,
  },
  {
    id: "xp_500",
    iconName: "award",
    iconColor: "#6D28D9",
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
    id: "xp_2000",
    iconName: "award",
    iconColor: "#D97706",
    label: "2000 XP",
    description: "Набрать 2000 опыта",
    isUnlocked: ({ xp }) => xp >= 2000,
  },

  // ─── Accuracy ───
  {
    id: "accuracy_80",
    iconName: "target",
    iconColor: "#34D399",
    label: "Хороший результат",
    description: "Точность 80%+ на 10+ вопросах",
    isUnlocked: ({ correctAnswers, totalAnswers }) =>
      totalAnswers >= 10 && correctAnswers / totalAnswers >= 0.8,
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

  // ─── Tasks ───
  {
    id: "tasks_10",
    iconName: "check-circle",
    iconColor: "#60A5FA",
    label: "10 заданий",
    description: "Решить 10 заданий",
    isUnlocked: ({ solvedTasks }) => solvedTasks >= 10,
  },
  {
    id: "tasks_25",
    iconName: "check-circle",
    iconColor: "#3B82F6",
    label: "25 заданий",
    description: "Решить 25 заданий",
    isUnlocked: ({ solvedTasks }) => solvedTasks >= 25,
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
    id: "tasks_200",
    iconName: "check-circle",
    iconColor: "#1E40AF",
    label: "200 заданий",
    description: "Решить 200 заданий",
    isUnlocked: ({ solvedTasks }) => solvedTasks >= 200,
  },

  // ─── Chapter Completion ───
  {
    id: "chapter_numbers",
    iconName: "hash",
    iconColor: "#6366F1",
    label: "Числовой мастер",
    description: "Пройти главу «Числа»",
    isUnlocked: ({ completedNodeIds }) =>
      ["numbers_t1", "numbers_q1", "numbers_p1", "numbers_t2", "numbers_q2", "numbers_p2", "numbers_boss"].every((id) =>
        completedNodeIds.includes(id)
      ),
  },
  {
    id: "chapter_algebra",
    iconName: "x",
    iconColor: "#8B5CF6",
    label: "Алгебраист",
    description: "Пройти главу «Алгебра»",
    isUnlocked: ({ completedNodeIds }) =>
      ["algebra_theory", "algebra_quiz", "algebra_boss"].every((id) =>
        completedNodeIds.includes(id)
      ),
  },
  {
    id: "chapter_equations",
    iconName: "minus",
    iconColor: "#EC4899",
    label: "Уравнитель",
    description: "Пройти главу «Уравнения»",
    isUnlocked: ({ completedNodeIds }) =>
      ["equations_theory", "equations_quiz", "equations_boss"].every((id) =>
        completedNodeIds.includes(id)
      ),
  },
  {
    id: "chapter_inequalities",
    iconName: "chevrons-right",
    iconColor: "#F59E0B",
    label: "Неравенствовед",
    description: "Пройти главу «Неравенства»",
    isUnlocked: ({ completedNodeIds }) =>
      ["ineq_theory", "ineq_quiz", "ineq_boss"].every((id) =>
        completedNodeIds.includes(id)
      ),
  },
  {
    id: "chapter_functions",
    iconName: "trending-up",
    iconColor: "#10B981",
    label: "Функционал",
    description: "Пройти главу «Функции»",
    isUnlocked: ({ completedNodeIds }) =>
      ["func_theory", "func_quiz", "func_boss"].every((id) =>
        completedNodeIds.includes(id)
      ),
  },
  {
    id: "chapter_geometry",
    iconName: "triangle",
    iconColor: "#3B82F6",
    label: "Геометр",
    description: "Пройти главу «Геометрия»",
    isUnlocked: ({ completedNodeIds }) =>
      ["geo_theory", "geo_quiz", "geo_boss"].every((id) =>
        completedNodeIds.includes(id)
      ),
  },
  {
    id: "chapter_statistics",
    iconName: "bar-chart-2",
    iconColor: "#14B8A6",
    label: "Статистик",
    description: "Пройти главу «Статистика»",
    isUnlocked: ({ completedNodeIds }) =>
      ["stat_theory", "stat_quiz", "stat_boss"].every((id) =>
        completedNodeIds.includes(id)
      ),
  },
  {
    id: "chapter_probability",
    iconName: "percent",
    iconColor: "#A855F7",
    label: "Вероятник",
    description: "Пройти главу «Вероятность»",
    isUnlocked: ({ completedNodeIds }) =>
      ["prob_theory", "prob_quiz", "prob_boss"].every((id) =>
        completedNodeIds.includes(id)
      ),
  },

  // ─── Milestones ───
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
  {
    id: "all_theory",
    iconName: "book-open",
    iconColor: "#6366F1",
    label: "Теоретик",
    description: "Прочитать всю теорию",
    isUnlocked: ({ completedNodeIds }) =>
      [
        "numbers_theory", "algebra_theory", "equations_theory",
        "ineq_theory", "func_theory", "geo_theory",
        "coord_theory", "stat_theory", "prob_theory",
      ].every((id) => completedNodeIds.includes(id)),
  },
  {
    id: "first_boss",
    iconName: "zap",
    iconColor: "#EF4444",
    label: "Первый босс",
    description: "Победить первого босса",
    isUnlocked: ({ completedNodeIds }) =>
      completedNodeIds.some((id) => id.endsWith("_boss")),
  },
  {
    id: "all_bosses",
    iconName: "shield",
    iconColor: "#DC2626",
    label: "Победитель боссов",
    description: "Победить всех боссов",
    isUnlocked: ({ completedNodeIds }) =>
      [
        "numbers_boss", "algebra_boss", "equations_boss",
        "ineq_boss", "func_boss", "geo_boss",
        "coord_boss", "stat_boss", "prob_boss",
      ].every((id) => completedNodeIds.includes(id)),
  },
  {
    id: "course_complete",
    iconName: "award",
    iconColor: "#FFD700",
    label: "ОГЭ готов!",
    description: "Пройти весь курс!",
    isUnlocked: ({ completedNodeIds }) =>
      [
        "numbers_theory", "numbers_quiz", "numbers_boss",
        "algebra_theory", "algebra_quiz", "algebra_boss",
        "equations_theory", "equations_quiz", "equations_boss",
        "oge_theory", "oge_quiz",
      ].every((id) => completedNodeIds.includes(id)),
  },
];
