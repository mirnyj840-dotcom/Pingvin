export type NodeType = "theory" | "miniQuiz" | "practice" | "boss";

export interface Question {
  id: string;
  text: string;
  options: string[];
  correct: string;
  explanation: string;
}

export interface LessonNode {
  id: string;
  chapterId: string;
  type: NodeType;
  label: string;
  iconName: string;
  theoryTitle?: string;
  theoryContent?: string;
  theoryKeyPoints?: string[];
  videoUrl?: string;
  questions?: Question[];
  xpReward: number;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  iconName: string;
  color: string;
  nodes: LessonNode[];
}

export const chapters: Chapter[] = [
  {
    id: "numbers",
    title: "Числа и вычисления",
    description: "Дроби, проценты, степени и корни",
    iconName: "hash",
    color: "#6366F1",
    nodes: [
      {
        id: "numbers_theory",
        chapterId: "numbers",
        type: "theory",
        label: "Теория",
        iconName: "book-open",
        theoryTitle: "Числа и вычисления",
        theoryContent:
          "На ОГЭ блок «Числа» включает дроби, проценты, степени и корни.\n\nПроцент — сотая часть числа. Найти p% от a: вычисляем a × p / 100.\n\nСтепень aⁿ — произведение n одинаковых множителей a. Например, 2³ = 8.\n\nКорень √a — неотрицательное число, квадрат которого равен a.\n\nПорядок действий: скобки → степени → умножение и деление → сложение и вычитание.",
        theoryKeyPoints: [
          "Процент: a × p / 100",
          "aⁿ = a · a · … · a (n раз)",
          "√a · √a = a при a ≥ 0",
          "(-a)² = a², (-a)³ = -a³",
          "Порядок: скобки → степени → ×÷ → +−",
        ],
        xpReward: 10,
      },
      {
        id: "numbers_quiz",
        chapterId: "numbers",
        type: "miniQuiz",
        label: "Мини-квиз",
        iconName: "edit-3",
        questions: [
          {
            id: "n_q1",
            text: "Сколько процентов составляет 12 от 48?",
            options: ["10%", "20%", "25%", "40%"],
            correct: "25%",
            explanation: "12 / 48 × 100 = 0,25 × 100 = 25%",
          },
          {
            id: "n_q2",
            text: "Вычислите: 2³ × 3",
            options: ["18", "24", "12", "6"],
            correct: "24",
            explanation: "2³ = 8, затем 8 × 3 = 24",
          },
          {
            id: "n_q3",
            text: "√36 + √49 = ?",
            options: ["11", "13", "12", "√85"],
            correct: "13",
            explanation: "√36 = 6, √49 = 7, итого 6 + 7 = 13",
          },
          {
            id: "n_q4",
            text: "0,3² = ?",
            options: ["0,9", "0,09", "0,6", "0,06"],
            correct: "0,09",
            explanation: "0,3 × 0,3 = 0,09",
          },
        ],
        xpReward: 20,
      },
      {
        id: "numbers_boss",
        chapterId: "numbers",
        type: "boss",
        label: "Босс-битва",
        iconName: "zap",
        questions: [
          {
            id: "nb_q1",
            text: "Найдите 30% от числа, если 20% равно 14.",
            options: ["21", "7", "28", "18"],
            correct: "21",
            explanation: "20% = 14 → 100% = 70 → 30% = 21",
          },
          {
            id: "nb_q2",
            text: "(-2)⁴ = ?",
            options: ["16", "-16", "8", "-8"],
            correct: "16",
            explanation: "Чётная степень отрицательного числа всегда положительна. (-2)⁴ = 16",
          },
          {
            id: "nb_q3",
            text: "√(25 × 4) = ?",
            options: ["100", "10", "29", "5"],
            correct: "10",
            explanation: "√100 = 10, или √25 × √4 = 5 × 2 = 10",
          },
          {
            id: "nb_q4",
            text: "Число увеличили на 20%, получили 72. Исходное число?",
            options: ["60", "56", "62", "58"],
            correct: "60",
            explanation: "x × 1,2 = 72 → x = 72 / 1,2 = 60",
          },
        ],
        xpReward: 40,
      },
    ],
  },
  {
    id: "algebra",
    title: "Алгебраические выражения",
    description: "Упрощение, формулы и разложение",
    iconName: "x",
    color: "#8B5CF6",
    nodes: [
      {
        id: "algebra_theory",
        chapterId: "algebra",
        type: "theory",
        label: "Теория",
        iconName: "book-open",
        theoryTitle: "Алгебраические выражения",
        theoryContent:
          "Алгебраические выражения упрощают с помощью формул сокращённого умножения.\n\n(a + b)² = a² + 2ab + b² — квадрат суммы\n(a - b)² = a² - 2ab + b² — квадрат разности\n(a + b)(a - b) = a² - b² — разность квадратов\n\nВынесение общего множителя: ax + ay = a(x + y)",
        theoryKeyPoints: [
          "(a+b)² = a² + 2ab + b²",
          "(a-b)² = a² - 2ab + b²",
          "(a+b)(a-b) = a² - b²",
          "Подобные слагаемые: 3x + 5x = 8x",
          "Вынесение: ax + ay = a(x+y)",
        ],
        xpReward: 10,
      },
      {
        id: "algebra_quiz",
        chapterId: "algebra",
        type: "miniQuiz",
        label: "Мини-квиз",
        iconName: "edit-3",
        questions: [
          {
            id: "al_q1",
            text: "Упростите: 3x + 5x − 2x",
            options: ["6x", "8x", "10x", "4x"],
            correct: "6x",
            explanation: "3 + 5 - 2 = 6, итого 6x",
          },
          {
            id: "al_q2",
            text: "(a + b)² = ?",
            options: ["a² + b²", "a² + 2ab + b²", "2a + 2b", "a² + ab + b²"],
            correct: "a² + 2ab + b²",
            explanation: "(a+b)² = a·a + a·b + b·a + b·b = a² + 2ab + b²",
          },
          {
            id: "al_q3",
            text: "Разложите на множители: x² − 9",
            options: ["(x−3)²", "(x+3)(x−3)", "(x+9)(x−1)", "(x−3)(x−9)"],
            correct: "(x+3)(x−3)",
            explanation: "x² − 9 = x² − 3² = (x+3)(x−3) — разность квадратов",
          },
        ],
        xpReward: 20,
      },
      {
        id: "algebra_boss",
        chapterId: "algebra",
        type: "boss",
        label: "Босс-битва",
        iconName: "zap",
        questions: [
          {
            id: "alb_q1",
            text: "2x(x − 3) + 5(x − 3) = ?",
            options: ["(2x+5)(x−3)", "(2x−5)(x+3)", "(2x+5)(x+3)", "7x(x−3)"],
            correct: "(2x+5)(x−3)",
            explanation: "Выносим (x−3): (2x+5)(x−3)",
          },
          {
            id: "alb_q2",
            text: "a² − 2ab + b² = ?",
            options: ["(a+b)²", "(a−b)²", "(a−b)(a+b)", "не раскладывается"],
            correct: "(a−b)²",
            explanation: "Это квадрат разности: (a−b)² = a² − 2ab + b²",
          },
          {
            id: "alb_q3",
            text: "Упростите: (x + 4)(x − 4)",
            options: ["x² − 16", "x² + 16", "x² − 8x − 16", "x² − 8"],
            correct: "x² − 16",
            explanation: "(x+4)(x−4) = x² − 4² = x² − 16",
          },
          {
            id: "alb_q4",
            text: "Вынесите общий множитель: 6a²b − 4ab²",
            options: ["2ab(3a − 2b)", "2ab(3a + 2b)", "ab(6a − 4b)", "2a(3ab − 2b²)"],
            correct: "2ab(3a − 2b)",
            explanation: "НОД = 2ab. 6a²b/2ab = 3a, 4ab²/2ab = 2b",
          },
        ],
        xpReward: 40,
      },
    ],
  },
  {
    id: "equations",
    title: "Уравнения",
    description: "Линейные и квадратные уравнения",
    iconName: "minus",
    color: "#EC4899",
    nodes: [
      {
        id: "equations_theory",
        chapterId: "equations",
        type: "theory",
        label: "Теория",
        iconName: "book-open",
        theoryTitle: "Уравнения",
        theoryContent:
          "Линейное уравнение: ax + b = 0, решение: x = −b/a.\n\nКвадратное уравнение: ax² + bx + c = 0.\nДискриминант: D = b² − 4ac.\n\nЕсли D > 0: два корня x₁,₂ = (−b ± √D) / 2a\nЕсли D = 0: один корень x = −b / 2a\nЕсли D < 0: корней нет\n\nПо теореме Виета: x₁ + x₂ = −b/a, x₁ · x₂ = c/a",
        theoryKeyPoints: [
          "D = b² − 4ac (дискриминант)",
          "x = (−b ± √D) / 2a",
          "D > 0 → 2 корня",
          "D = 0 → 1 корень",
          "D < 0 → нет корней",
        ],
        xpReward: 10,
      },
      {
        id: "equations_quiz",
        chapterId: "equations",
        type: "miniQuiz",
        label: "Мини-квиз",
        iconName: "edit-3",
        questions: [
          {
            id: "eq_q1",
            text: "Решите: 3x − 7 = 8",
            options: ["x = 5", "x = 3", "x = 1/3", "x = 15"],
            correct: "x = 5",
            explanation: "3x = 8 + 7 = 15, x = 15/3 = 5",
          },
          {
            id: "eq_q2",
            text: "Решите: x² = 25",
            options: ["x = 5", "x = ±5", "x = −5", "x = √25"],
            correct: "x = ±5",
            explanation: "x² = 25 → x = ±√25 = ±5",
          },
          {
            id: "eq_q3",
            text: "Корни уравнения x² − 5x + 6 = 0",
            options: ["2 и 3", "−2 и −3", "1 и 6", "−1 и −6"],
            correct: "2 и 3",
            explanation: "D = 25 − 24 = 1, x = (5±1)/2, x₁=3, x₂=2",
          },
        ],
        xpReward: 20,
      },
      {
        id: "equations_boss",
        chapterId: "equations",
        type: "boss",
        label: "Босс-битва",
        iconName: "zap",
        questions: [
          {
            id: "eqb_q1",
            text: "Дискриминант уравнения x² − 4x + 3 = 0",
            options: ["4", "1", "16", "28"],
            correct: "4",
            explanation: "D = (−4)² − 4·1·3 = 16 − 12 = 4",
          },
          {
            id: "eqb_q2",
            text: "2x + 3 = x − 5. Найдите x.",
            options: ["−8", "8", "−2", "2"],
            correct: "−8",
            explanation: "2x − x = −5 − 3 → x = −8",
          },
          {
            id: "eqb_q3",
            text: "Уравнение x² − 6x + 9 = 0 имеет...",
            options: ["два разных корня", "один корень x = 3", "нет корней", "корни x = ±3"],
            correct: "один корень x = 3",
            explanation: "D = 36 − 36 = 0 → один корень x = 6/2 = 3",
          },
          {
            id: "eqb_q4",
            text: "По теореме Виета, сумма корней x² + 3x − 4 = 0",
            options: ["3", "−3", "4", "−4"],
            correct: "−3",
            explanation: "x₁ + x₂ = −b/a = −3/1 = −3",
          },
        ],
        xpReward: 40,
      },
    ],
  },
  {
    id: "inequalities",
    title: "Неравенства",
    description: "Линейные и квадратные неравенства",
    iconName: "chevrons-right",
    color: "#F59E0B",
    nodes: [
      {
        id: "ineq_theory",
        chapterId: "inequalities",
        type: "theory",
        label: "Теория",
        iconName: "book-open",
        theoryTitle: "Неравенства",
        theoryContent:
          "Линейное неравенство решают как уравнение.\n\nВАЖНО: при умножении/делении на отрицательное число знак неравенства МЕНЯЕТСЯ.\n\n−2x > 6 → делим на −2, знак меняется → x < −3\n\nОтрезок [a; b]: a ≤ x ≤ b\nИнтервал (a; b): a < x < b\n\n|x| < a означает −a < x < a",
        theoryKeyPoints: [
          "Умножение на отрицательное → знак меняется",
          "|x| < a → −a < x < a",
          "|x| > a → x < −a или x > a",
          "Система: оба условия должны выполняться",
        ],
        xpReward: 10,
      },
      {
        id: "ineq_quiz",
        chapterId: "inequalities",
        type: "miniQuiz",
        label: "Мини-квиз",
        iconName: "edit-3",
        questions: [
          {
            id: "in_q1",
            text: "Решите: 2x − 4 > 6",
            options: ["x > 5", "x > 1", "x < 5", "x < 1"],
            correct: "x > 5",
            explanation: "2x > 10 → x > 5",
          },
          {
            id: "in_q2",
            text: "При умножении неравенства на −3 знак...",
            options: ["меняется", "не меняется", "обнуляется", "удваивается"],
            correct: "меняется",
            explanation: "При умножении на любое отрицательное число знак неравенства меняется на противоположный",
          },
          {
            id: "in_q3",
            text: "|x| < 5 — это то же самое, что...",
            options: ["−5 < x < 5", "x > 5", "x < −5 или x > 5", "x > 0"],
            correct: "−5 < x < 5",
            explanation: "|x| < a означает −a < x < a",
          },
        ],
        xpReward: 20,
      },
    ],
  },
  {
    id: "functions",
    title: "Функции",
    description: "Линейная, квадратная, обратная",
    iconName: "trending-up",
    color: "#10B981",
    nodes: [
      {
        id: "func_theory",
        chapterId: "functions",
        type: "theory",
        label: "Теория",
        iconName: "book-open",
        theoryTitle: "Функции",
        theoryContent:
          "Линейная функция y = kx + b — прямая. k — угловой коэффициент (наклон), b — смещение.\n\nКвадратная функция y = ax² + bx + c — парабола.\nВершина параболы: x₀ = −b/(2a), y₀ = f(x₀).\nЕсли a > 0 — ветви вверх, если a < 0 — ветви вниз.\n\nОбратная пропорциональность y = k/x — гипербола.",
        theoryKeyPoints: [
          "y = kx + b: k — наклон, b — смещение по y",
          "Вершина параболы: x₀ = −b/(2a)",
          "a > 0 → ветви вверх, a < 0 → ветви вниз",
          "y = k/x — гипербола (k ≠ 0)",
        ],
        xpReward: 10,
      },
      {
        id: "func_quiz",
        chapterId: "functions",
        type: "miniQuiz",
        label: "Мини-квиз",
        iconName: "edit-3",
        questions: [
          {
            id: "fn_q1",
            text: "Парабола y = x² сдвинута на 3 вправо. Уравнение:",
            options: ["y = (x−3)²", "y = x² − 3", "y = (x+3)²", "y = x² + 3"],
            correct: "y = (x−3)²",
            explanation: "Сдвиг вправо на c: замена x на (x−c). Итого y = (x−3)²",
          },
          {
            id: "fn_q2",
            text: "y = 2x − 5. Угловой коэффициент k = ?",
            options: ["2", "−5", "5", "−2"],
            correct: "2",
            explanation: "В y = kx + b угловой коэффициент k стоит перед x. k = 2",
          },
          {
            id: "fn_q3",
            text: "Вершина параболы y = x² − 6x + 5",
            options: ["(3, −4)", "(3, 4)", "(−3, −4)", "(6, 5)"],
            correct: "(3, −4)",
            explanation: "x₀ = 6/(2·1) = 3, y₀ = 9 − 18 + 5 = −4",
          },
        ],
        xpReward: 20,
      },
    ],
  },
  {
    id: "geometry",
    title: "Геометрия",
    description: "Треугольники, четырёхугольники, окружности",
    iconName: "triangle",
    color: "#3B82F6",
    nodes: [
      {
        id: "geo_theory",
        chapterId: "geometry",
        type: "theory",
        label: "Теория",
        iconName: "book-open",
        theoryTitle: "Геометрия",
        theoryContent:
          "Сумма углов треугольника = 180°.\nПлощадь треугольника: S = ½ · a · h, где h — высота к стороне a.\n\nТеорема Пифагора: a² + b² = c², где c — гипотенуза.\n\nПрямоугольник: S = a · b, P = 2(a + b).\nОкружность: длина C = 2πR, площадь S = πR².",
        theoryKeyPoints: [
          "Сумма углов △ = 180°",
          "S△ = ½ · a · h",
          "a² + b² = c² (Пифагор)",
          "Окружность: C = 2πR, S = πR²",
        ],
        xpReward: 10,
      },
      {
        id: "geo_quiz",
        chapterId: "geometry",
        type: "miniQuiz",
        label: "Мини-квиз",
        iconName: "edit-3",
        questions: [
          {
            id: "geo_q1",
            text: "Сумма углов треугольника = ?",
            options: ["180°", "360°", "90°", "270°"],
            correct: "180°",
            explanation: "Сумма внутренних углов любого треугольника равна 180°",
          },
          {
            id: "geo_q2",
            text: "Периметр квадрата со стороной 5 = ?",
            options: ["20", "25", "10", "15"],
            correct: "20",
            explanation: "P = 4 · a = 4 · 5 = 20",
          },
          {
            id: "geo_q3",
            text: "Катеты прямоугольного треугольника 3 и 4. Гипотенуза = ?",
            options: ["5", "7", "25", "12"],
            correct: "5",
            explanation: "c² = 3² + 4² = 9 + 16 = 25 → c = 5",
          },
        ],
        xpReward: 20,
      },
    ],
  },
  {
    id: "coordinates",
    title: "Координаты",
    description: "Расстояния, середины, векторы",
    iconName: "map-pin",
    color: "#F97316",
    nodes: [
      {
        id: "coord_theory",
        chapterId: "coordinates",
        type: "theory",
        label: "Теория",
        iconName: "book-open",
        theoryTitle: "Координатная плоскость",
        theoryContent:
          "Расстояние между точками A(x₁, y₁) и B(x₂, y₂):\nd = √((x₂−x₁)² + (y₂−y₁)²)\n\nСередина отрезка AB:\nM = ((x₁+x₂)/2 ; (y₁+y₂)/2)\n\nУравнение окружности с центром O(a, b) и радиусом R:\n(x−a)² + (y−b)² = R²",
        theoryKeyPoints: [
          "d = √((x₂−x₁)² + (y₂−y₁)²)",
          "Середина: ((x₁+x₂)/2; (y₁+y₂)/2)",
          "Окружность: (x−a)² + (y−b)² = R²",
        ],
        xpReward: 10,
      },
      {
        id: "coord_quiz",
        chapterId: "coordinates",
        type: "miniQuiz",
        label: "Мини-квиз",
        iconName: "edit-3",
        questions: [
          {
            id: "co_q1",
            text: "Длина отрезка от A(0,0) до B(3,4) = ?",
            options: ["5", "7", "12", "√25"],
            correct: "5",
            explanation: "d = √(3² + 4²) = √(9+16) = √25 = 5",
          },
          {
            id: "co_q2",
            text: "Середина отрезка с концами (2,4) и (6,8) = ?",
            options: ["(4, 6)", "(8, 12)", "(4, 4)", "(3, 5)"],
            correct: "(4, 6)",
            explanation: "M = ((2+6)/2; (4+8)/2) = (4; 6)",
          },
          {
            id: "co_q3",
            text: "Уравнение окружности с центром (0,0) и радиусом 5:",
            options: ["x² + y² = 25", "x² + y² = 5", "x² + y² = 10", "x + y = 5"],
            correct: "x² + y² = 25",
            explanation: "(x−0)² + (y−0)² = 5² → x² + y² = 25",
          },
        ],
        xpReward: 20,
      },
    ],
  },
  {
    id: "statistics",
    title: "Статистика",
    description: "Среднее, медиана, мода, графики",
    iconName: "bar-chart-2",
    color: "#14B8A6",
    nodes: [
      {
        id: "stat_theory",
        chapterId: "statistics",
        type: "theory",
        label: "Теория",
        iconName: "book-open",
        theoryTitle: "Статистика",
        theoryContent:
          "Среднее арифметическое: x̄ = (x₁ + x₂ + … + xₙ) / n\n\nМедиана — значение, делящее упорядоченный ряд пополам.\nЕсли n нечётное: медиана = средний элемент.\nЕсли n чётное: медиана = среднее двух средних.\n\nМода — наиболее часто встречающееся значение.\n\nРазмах = max − min",
        theoryKeyPoints: [
          "Среднее: сумма / количество",
          "Медиана — середина упорядоченного ряда",
          "Мода — самое частое значение",
          "Размах = max − min",
        ],
        xpReward: 10,
      },
      {
        id: "stat_quiz",
        chapterId: "statistics",
        type: "miniQuiz",
        label: "Мини-квиз",
        iconName: "edit-3",
        questions: [
          {
            id: "st_q1",
            text: "Среднее арифметическое 2, 4, 6, 8 = ?",
            options: ["5", "4", "6", "20"],
            correct: "5",
            explanation: "(2+4+6+8)/4 = 20/4 = 5",
          },
          {
            id: "st_q2",
            text: "Медиана набора {1, 3, 5, 7, 9} = ?",
            options: ["5", "3", "7", "4"],
            correct: "5",
            explanation: "В наборе из 5 элементов медиана = 3-й элемент = 5",
          },
          {
            id: "st_q3",
            text: "Мода набора {2, 3, 3, 4, 5} = ?",
            options: ["3", "4", "3,4", "2"],
            correct: "3",
            explanation: "Число 3 встречается дважды — чаще остальных",
          },
        ],
        xpReward: 20,
      },
    ],
  },
  {
    id: "probability",
    title: "Вероятность",
    description: "Теория вероятностей и комбинаторика",
    iconName: "percent",
    color: "#A855F7",
    nodes: [
      {
        id: "prob_theory",
        chapterId: "probability",
        type: "theory",
        label: "Теория",
        iconName: "book-open",
        theoryTitle: "Вероятность",
        theoryContent:
          "Вероятность события A: P(A) = m/n, где m — число благоприятных исходов, n — всего исходов.\n\n0 ≤ P(A) ≤ 1\nP(невозможного) = 0, P(достоверного) = 1\n\nВероятность противоположного события:\nP(не A) = 1 − P(A)\n\nСложение вероятностей несовместных событий:\nP(A или B) = P(A) + P(B)",
        theoryKeyPoints: [
          "P(A) = (благоприятные) / (всего)",
          "0 ≤ P(A) ≤ 1",
          "P(не A) = 1 − P(A)",
          "Несовместные: P(A или B) = P(A) + P(B)",
        ],
        xpReward: 10,
      },
      {
        id: "prob_quiz",
        chapterId: "probability",
        type: "miniQuiz",
        label: "Мини-квиз",
        iconName: "edit-3",
        questions: [
          {
            id: "pr_q1",
            text: "P(A) = 0,4. P(не A) = ?",
            options: ["0,6", "0,4", "1", "0,14"],
            correct: "0,6",
            explanation: "P(не A) = 1 − P(A) = 1 − 0,4 = 0,6",
          },
          {
            id: "pr_q2",
            text: "Бросают кубик. P(выпадет чётное число) = ?",
            options: ["1/2", "1/3", "1/6", "2/3"],
            correct: "1/2",
            explanation: "Чётные: {2,4,6} — 3 исхода из 6. P = 3/6 = 1/2",
          },
          {
            id: "pr_q3",
            text: "Из 10 шаров 3 красных. P(случайно взять красный) = ?",
            options: ["0,3", "0,7", "3", "0,03"],
            correct: "0,3",
            explanation: "P = 3/10 = 0,3",
          },
        ],
        xpReward: 20,
      },
    ],
  },
  {
    id: "ogepractice",
    title: "Практика ОГЭ",
    description: "Задания формата реального экзамена",
    iconName: "award",
    color: "#EF4444",
    nodes: [
      {
        id: "oge_theory",
        chapterId: "ogepractice",
        type: "theory",
        label: "Стратегия",
        iconName: "book-open",
        theoryTitle: "Как сдать ОГЭ на 5",
        theoryContent:
          "ОГЭ по математике: 25 заданий, 3 часа 55 минут.\n\nЧасть 1: задания 1–19 (краткий ответ, по 1 баллу)\nЧасть 2: задания 20–25 (развёрнутый ответ, до 2 баллов)\n\nДля оценки «5» нужно 22–32 балла.\n\nСтратегия: сначала решите все задания, в которых уверены. Затем вернитесь к сложным. Проверьте ответы перед сдачей.",
        theoryKeyPoints: [
          "25 заданий за 3 ч 55 мин",
          "Часть 1: №1–19 (краткий ответ)",
          "Часть 2: №20–25 (с решением)",
          "Оценка «5»: 22–32 балла",
          "Сначала лёгкие, потом сложные",
        ],
        xpReward: 10,
      },
      {
        id: "oge_quiz",
        chapterId: "ogepractice",
        type: "boss",
        label: "Финальный квиз",
        iconName: "award",
        questions: [
          {
            id: "og_q1",
            text: "45% от числа 120 = ?",
            options: ["54", "48", "45", "60"],
            correct: "54",
            explanation: "120 × 0,45 = 54",
          },
          {
            id: "og_q2",
            text: "Решите: 2x − 3 = 5 − 4x",
            options: ["x = 4/3", "x = 1", "x = 2", "x = 8/6"],
            correct: "x = 4/3",
            explanation: "6x = 8 → x = 8/6 = 4/3 ≈ 1,33",
          },
          {
            id: "og_q3",
            text: "Угол при основании равнобедренного треугольника с углом при вершине 40°?",
            options: ["70°", "40°", "50°", "140°"],
            correct: "70°",
            explanation: "Основания: (180° − 40°)/2 = 70°",
          },
          {
            id: "og_q4",
            text: "Среднее скорости 60 км/ч и 40 км/ч за равные расстояния = ?",
            options: ["48 км/ч", "50 км/ч", "100 км/ч", "45 км/ч"],
            correct: "48 км/ч",
            explanation: "Среднегармоническое: 2/(1/60 + 1/40) = 2·120/5 = 48 км/ч",
          },
        ],
        xpReward: 50,
      },
    ],
  },
];

export function findNode(nodeId: string): LessonNode | undefined {
  for (const ch of chapters) {
    const node = ch.nodes.find((n) => n.id === nodeId);
    if (node) return node;
  }
  return undefined;
}

export function findChapter(chapterId: string): Chapter | undefined {
  return chapters.find((c) => c.id === chapterId);
}

export const totalNodes = chapters.reduce((sum, ch) => sum + ch.nodes.length, 0);
