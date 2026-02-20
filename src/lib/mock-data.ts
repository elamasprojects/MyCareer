import {
  BusinessContext,
  Subject,
  Module,
  Progress,
  UserProfile,
  UserSettings,
} from "./types";

export const mockBusinessContext: BusinessContext = {
  id: "bc-001",
  user_id: "user-001",
  business_name: "UGC Studio",
  description:
    "Agencia de contenido UGC que conecta marcas con creadores. Producción, estrategia y distribución de contenido generado por usuarios.",
  current_phase: "scaling",
  current_needs: [
    "Gestión de equipo",
    "Optimización de procesos",
    "Estrategia de pricing",
    "Liderazgo",
  ],
  revenue_monthly: 30000,
  team_size: 5,
  updated_at: "2026-02-15T10:00:00Z",
};

export const mockSubjects: Subject[] = [
  {
    id: "sub-001",
    user_id: "user-001",
    title: "Liderazgo y Gestión de Equipos",
    description:
      "Frameworks de liderazgo, delegación efectiva, cultura de equipo, feedback y gestión del rendimiento. Orientado a equipos pequeños en crecimiento.",
    orientation: "business_oriented",
    status: "active",
    priority_score: 92,
    icon: "Users",
    created_at: "2026-01-10T08:00:00Z",
    modules_count: 4,
    classes_completed: 7,
    classes_total: 23,
    progress_percent: 30,
  },
  {
    id: "sub-002",
    user_id: "user-001",
    title: "Optimización de Procesos",
    description:
      "Lean operations, automatización, SOPs, workflows eficientes y herramientas de productividad para escalar sin caos.",
    orientation: "business_oriented",
    status: "draft",
    priority_score: 88,
    icon: "Workflow",
    created_at: "2026-02-01T08:00:00Z",
    modules_count: 3,
    classes_completed: 0,
    classes_total: 18,
    progress_percent: 0,
  },
  {
    id: "sub-003",
    user_id: "user-001",
    title: "Estadística para Negocios",
    description:
      "Probabilidad, estadística descriptiva e inferencial, análisis de datos y toma de decisiones basada en evidencia aplicada a métricas de negocio.",
    orientation: "base",
    status: "active",
    priority_score: 85,
    icon: "BarChart3",
    created_at: "2025-12-01T08:00:00Z",
    modules_count: 4,
    classes_completed: 10,
    classes_total: 15,
    progress_percent: 67,
  },
  {
    id: "sub-004",
    user_id: "user-001",
    title: "Marketing de Contenidos",
    description:
      "Estrategia de contenido, copywriting, distribución multicanal, SEO y métricas de performance para crecer audiencia y convertir.",
    orientation: "business_oriented",
    status: "active",
    priority_score: 70,
    icon: "Megaphone",
    created_at: "2026-01-20T08:00:00Z",
    modules_count: 4,
    classes_completed: 2,
    classes_total: 20,
    progress_percent: 10,
  },
];

export const mockModules: Record<string, Module[]> = {
  "sub-003": [
    {
      id: "mod-001",
      subject_id: "sub-003",
      title: "Fundamentos de Estadística Descriptiva",
      description:
        "Tipos de datos, medidas de tendencia central, dispersión y visualización de datos para entender métricas de negocio.",
      sort_order: 1,
      is_locked: false,
      classes: [
        {
          id: "cls-001",
          module_id: "mod-001",
          title: "Tipos de datos y escalas de medición",
          description:
            "Clasificación de datos cualitativos y cuantitativos, escalas nominales, ordinales, de intervalo y de razón. Cómo identificar el tipo de dato correcto para cada métrica de tu negocio.",
          youtube_url: "https://www.youtube.com/watch?v=hEWY6kkBdpo",
          youtube_transcript: null,
          apply_to_business: null,
          sort_order: 1,
          status: "completed",
          completed_at: "2026-01-15T14:30:00Z",
          estimated_minutes: 25,
          resources: [
            {
              id: "res-001",
              class_id: "cls-001",
              type: "pdf",
              title: "Guía de tipos de datos y escalas",
              url: "/resources/tipos-datos.pdf",
              ai_summary: null,
              file_path: null,
            },
            {
              id: "res-002",
              class_id: "cls-001",
              type: "article",
              title: "Variables estadísticas — Khan Academy",
              url: "https://es.khanacademy.org/math/statistics-probability",
              ai_summary: null,
              file_path: null,
            },
          ],
        },
        {
          id: "cls-002",
          module_id: "mod-001",
          title: "Media, mediana y moda aplicadas",
          description:
            "Medidas de tendencia central: cuándo usar cada una, cómo calcularlas, y ejemplos con datos reales de revenue, ticket promedio y engagement.",
          youtube_url: "https://www.youtube.com/watch?v=0DA7Wtz1ddg",
          youtube_transcript: null,
          apply_to_business: null,
          sort_order: 2,
          status: "completed",
          completed_at: "2026-01-17T10:00:00Z",
          estimated_minutes: 30,
          resources: [
            {
              id: "res-003",
              class_id: "cls-002",
              type: "pdf",
              title: "Ejercicios de tendencia central",
              url: "/resources/tendencia-central.pdf",
              ai_summary: null,
              file_path: null,
            },
          ],
        },
        {
          id: "cls-003",
          module_id: "mod-001",
          title: "Varianza, desviación estándar y rango",
          description:
            "Medidas de dispersión: entender la variabilidad de tus datos. Aplicación a análisis de consistencia en ventas y performance de campañas.",
          youtube_url: "https://www.youtube.com/watch?v=A1bAFpi42EQ",
          youtube_transcript: null,
          apply_to_business: null,
          sort_order: 3,
          status: "completed",
          completed_at: "2026-01-20T16:00:00Z",
          estimated_minutes: 35,
          resources: [
            {
              id: "res-004",
              class_id: "cls-003",
              type: "article",
              title: "Desviación estándar explicada — Stat Trek",
              url: "https://stattrek.com/statistics/dictionary",
              ai_summary: null,
              file_path: null,
            },
            {
              id: "res-005",
              class_id: "cls-003",
              type: "pdf",
              title: "Plantilla de cálculo de dispersión",
              url: "/resources/dispersion-template.pdf",
              ai_summary: null,
              file_path: null,
            },
          ],
        },
        {
          id: "cls-004",
          module_id: "mod-001",
          title: "Visualización de datos: histogramas y boxplots",
          description:
            "Cómo construir e interpretar histogramas, diagramas de caja y gráficos de dispersión. Herramientas prácticas para visualizar métricas clave.",
          youtube_url: "https://www.youtube.com/watch?v=BE8CVGJuftI",
          youtube_transcript: null,
          apply_to_business: null,
          sort_order: 4,
          status: "completed",
          completed_at: "2026-01-22T11:00:00Z",
          estimated_minutes: 28,
          resources: [
            {
              id: "res-006",
              class_id: "cls-004",
              type: "youtube",
              title: "Tutorial de gráficos en Google Sheets",
              url: "https://www.youtube.com/watch?v=example1",
              ai_summary: null,
              file_path: null,
            },
          ],
        },
      ],
    },
    {
      id: "mod-002",
      subject_id: "sub-003",
      title: "Probabilidad Básica",
      description:
        "Conceptos fundamentales de probabilidad, distribuciones y su aplicación a predicciones de negocio y análisis de riesgo.",
      sort_order: 2,
      is_locked: false,
      classes: [
        {
          id: "cls-005",
          module_id: "mod-002",
          title: "Conceptos básicos de probabilidad",
          description:
            "Espacio muestral, eventos, probabilidad clásica y frecuentista. Cómo pensar probabilísticamente sobre decisiones de negocio.",
          youtube_url: "https://www.youtube.com/watch?v=KzfWUEJjG18",
          youtube_transcript: null,
          apply_to_business: null,
          sort_order: 1,
          status: "completed",
          completed_at: "2026-01-28T09:00:00Z",
          estimated_minutes: 32,
          resources: [
            {
              id: "res-007",
              class_id: "cls-005",
              type: "pdf",
              title: "Resumen de fórmulas de probabilidad",
              url: "/resources/probabilidad-formulas.pdf",
              ai_summary: null,
              file_path: null,
            },
            {
              id: "res-008",
              class_id: "cls-005",
              type: "article",
              title: "Intro a probabilidad — Seeing Theory",
              url: "https://seeing-theory.brown.edu/",
              ai_summary: null,
              file_path: null,
            },
          ],
        },
        {
          id: "cls-006",
          module_id: "mod-002",
          title: "Probabilidad condicional y Bayes",
          description:
            "Teorema de Bayes, probabilidad condicional e independencia. Cómo actualizar predicciones con nueva información del mercado.",
          youtube_url: "https://www.youtube.com/watch?v=HZGCoVF3YvM",
          youtube_transcript: null,
          apply_to_business: null,
          sort_order: 2,
          status: "completed",
          completed_at: "2026-02-01T15:00:00Z",
          estimated_minutes: 40,
          resources: [
            {
              id: "res-009",
              class_id: "cls-006",
              type: "paper",
              title: "An Intuitive Explanation of Bayes' Theorem",
              url: "https://yudkowsky.net/rational/bayes",
              ai_summary: null,
              file_path: null,
            },
          ],
        },
        {
          id: "cls-007",
          module_id: "mod-002",
          title: "Distribuciones de probabilidad",
          description:
            "Distribución normal, binomial y de Poisson. Cómo modelar eventos de negocio: conversiones, llegada de clientes, defectos en producción.",
          youtube_url: "https://www.youtube.com/watch?v=YXLVjCKVP7U",
          youtube_transcript: null,
          apply_to_business: null,
          sort_order: 3,
          status: "completed",
          completed_at: "2026-02-04T10:30:00Z",
          estimated_minutes: 38,
          resources: [
            {
              id: "res-010",
              class_id: "cls-007",
              type: "pdf",
              title: "Tabla de distribuciones y cuándo usarlas",
              url: "/resources/distribuciones-guia.pdf",
              ai_summary: null,
              file_path: null,
            },
            {
              id: "res-011",
              class_id: "cls-007",
              type: "other",
              title: "Simulador de distribuciones interactivo",
              url: "https://onlinestatbook.com/stat_sim/",
              ai_summary: null,
              file_path: null,
            },
          ],
        },
      ],
    },
    {
      id: "mod-003",
      subject_id: "sub-003",
      title: "Estadística Inferencial",
      description:
        "Muestreo, intervalos de confianza, pruebas de hipótesis y significancia estadística para tomar decisiones con datos.",
      sort_order: 3,
      is_locked: false,
      classes: [
        {
          id: "cls-008",
          module_id: "mod-003",
          title: "Muestreo y estimación",
          description:
            "Tipos de muestreo, sesgo, tamaño de muestra y estimación puntual. Cómo diseñar encuestas y experimentos válidos para tu negocio.",
          youtube_url: "https://www.youtube.com/watch?v=sbbYntt5CJk",
          youtube_transcript: null,
          apply_to_business: null,
          sort_order: 1,
          status: "completed",
          completed_at: "2026-02-08T14:00:00Z",
          estimated_minutes: 30,
          resources: [
            {
              id: "res-012",
              class_id: "cls-008",
              type: "article",
              title: "Calculadora de tamaño de muestra",
              url: "https://www.calculator.net/sample-size-calculator.html",
              ai_summary: null,
              file_path: null,
            },
          ],
        },
        {
          id: "cls-009",
          module_id: "mod-003",
          title: "Intervalos de confianza",
          description:
            "Construcción e interpretación de intervalos de confianza. Qué significa realmente un IC del 95% y cómo comunicar incertidumbre a stakeholders.",
          youtube_url: "https://www.youtube.com/watch?v=tFWsuO9f74o",
          youtube_transcript: null,
          apply_to_business: null,
          sort_order: 2,
          status: "completed",
          completed_at: "2026-02-10T11:00:00Z",
          estimated_minutes: 35,
          resources: [
            {
              id: "res-013",
              class_id: "cls-009",
              type: "pdf",
              title: "Cheat sheet de intervalos de confianza",
              url: "/resources/intervalos-confianza.pdf",
              ai_summary: null,
              file_path: null,
            },
            {
              id: "res-014",
              class_id: "cls-009",
              type: "article",
              title: "Confidence Intervals — Statistics by Jim",
              url: "https://statisticsbyjim.com/hypothesis-testing/confidence-interval/",
              ai_summary: null,
              file_path: null,
            },
          ],
        },
        {
          id: "cls-010",
          module_id: "mod-003",
          title: "Pruebas de hipótesis y p-valor",
          description:
            "Hipótesis nula y alternativa, errores tipo I y II, p-valor y significancia estadística. La base del A/B testing.",
          youtube_url: "https://www.youtube.com/watch?v=0oc49DyA3hU",
          youtube_transcript: null,
          apply_to_business: null,
          sort_order: 3,
          status: "completed",
          completed_at: "2026-02-13T09:30:00Z",
          estimated_minutes: 42,
          resources: [
            {
              id: "res-015",
              class_id: "cls-010",
              type: "pdf",
              title: "Guía de pruebas de hipótesis paso a paso",
              url: "/resources/hipotesis-guia.pdf",
              ai_summary: null,
              file_path: null,
            },
          ],
        },
        {
          id: "cls-011",
          module_id: "mod-003",
          title: "A/B Testing para decisiones de negocio",
          description:
            "Diseño e implementación de tests A/B: tamaño de muestra, duración, análisis de resultados y cuándo declarar un ganador.",
          youtube_url: null,
          youtube_transcript: null,
          apply_to_business: null,
          sort_order: 4,
          status: "pending",
          completed_at: null,
          estimated_minutes: 45,
          resources: [
            {
              id: "res-016",
              class_id: "cls-011",
              type: "article",
              title: "A/B Testing Guide — Optimizely",
              url: "https://www.optimizely.com/optimization-glossary/ab-testing/",
              ai_summary: null,
              file_path: null,
            },
            {
              id: "res-017",
              class_id: "cls-011",
              type: "other",
              title: "Calculadora de significancia A/B",
              url: "https://abtestguide.com/calc/",
              ai_summary: null,
              file_path: null,
            },
          ],
        },
      ],
    },
    {
      id: "mod-004",
      subject_id: "sub-003",
      title: "Regresión y Correlación",
      description:
        "Modelos de regresión lineal, correlación y predicción. Herramientas avanzadas para forecasting y análisis causal.",
      sort_order: 4,
      is_locked: true,
      classes: [
        {
          id: "cls-012",
          module_id: "mod-004",
          title: "Correlación: relación entre variables",
          description:
            "Coeficiente de correlación de Pearson, correlación vs causalidad, y cómo identificar relaciones entre métricas de negocio.",
          youtube_url: "https://www.youtube.com/watch?v=xTpHD5WLuoA",
          youtube_transcript: null,
          apply_to_business: null,
          sort_order: 1,
          status: "pending",
          completed_at: null,
          estimated_minutes: 30,
          resources: [
            {
              id: "res-018",
              class_id: "cls-012",
              type: "article",
              title: "Correlation vs Causation — Towards Data Science",
              url: "https://towardsdatascience.com/correlation-is-not-causation",
              ai_summary: null,
              file_path: null,
            },
          ],
        },
        {
          id: "cls-013",
          module_id: "mod-004",
          title: "Regresión lineal simple",
          description:
            "Modelo de regresión lineal, interpretación de coeficientes, R² y predicción. Cómo predecir revenue basado en inversión publicitaria.",
          youtube_url: null,
          youtube_transcript: null,
          apply_to_business: null,
          sort_order: 2,
          status: "pending",
          completed_at: null,
          estimated_minutes: 40,
          resources: [
            {
              id: "res-019",
              class_id: "cls-013",
              type: "pdf",
              title: "Ejercicios de regresión lineal",
              url: "/resources/regresion-ejercicios.pdf",
              ai_summary: null,
              file_path: null,
            },
            {
              id: "res-020",
              class_id: "cls-013",
              type: "youtube",
              title: "Regresión lineal en Google Sheets",
              url: "https://www.youtube.com/watch?v=example2",
              ai_summary: null,
              file_path: null,
            },
          ],
        },
        {
          id: "cls-014",
          module_id: "mod-004",
          title: "Regresión múltiple y forecasting",
          description:
            "Extensión a múltiples variables predictoras. Técnicas de forecasting para proyectar ventas, crecimiento y demanda.",
          youtube_url: null,
          youtube_transcript: null,
          apply_to_business: null,
          sort_order: 3,
          status: "pending",
          completed_at: null,
          estimated_minutes: 45,
          resources: [
            {
              id: "res-021",
              class_id: "cls-014",
              type: "paper",
              title: "Introduction to Forecasting — Rob Hyndman",
              url: "https://otexts.com/fpp3/",
              ai_summary: null,
              file_path: null,
            },
          ],
        },
      ],
    },
  ],
};

export const mockProgress: Progress = {
  id: "prog-001",
  user_id: "user-001",
  total_xp: 450,
  level: 5,
  xp_for_current_level: 400,
  xp_for_next_level: 600,
  current_streak: 7,
  longest_streak: 14,
  classes_completed: 23,
  last_study_date: "2026-02-20T08:00:00Z",
};

export const mockUserProfile: UserProfile = {
  id: "user-001",
  name: "Ezequiel",
  email: "ezequiel@ugcstudio.com",
  avatar_url: null,
  timezone: "America/Argentina/Buenos_Aires",
  created_at: "2025-11-01T10:00:00Z",
};

export const mockUserSettings: UserSettings = {
  id: "settings-001",
  user_id: "user-001",
  study_hours_per_day: 2,
  study_days_per_week: 5,
  theme: "dark",
  updated_at: "2026-02-15T10:00:00Z",
};

export function getSubjectById(id: string): Subject | undefined {
  return mockSubjects.find((s) => s.id === id);
}

export function getModulesForSubject(subjectId: string): Module[] {
  return (mockModules[subjectId] || []).sort(
    (a, b) => a.sort_order - b.sort_order
  );
}

export function getClassById(
  subjectId: string,
  classId: string
): { module: Module; classData: import("./types").Class } | undefined {
  const modules = mockModules[subjectId];
  if (!modules) return undefined;
  for (const mod of modules) {
    const cls = mod.classes.find((c) => c.id === classId);
    if (cls) return { module: mod, classData: cls };
  }
  return undefined;
}

export function getAllClassesForSubject(
  subjectId: string
): { module: Module; classData: import("./types").Class }[] {
  const modules = getModulesForSubject(subjectId);
  const result: { module: Module; classData: import("./types").Class }[] = [];
  for (const mod of modules) {
    for (const cls of mod.classes.sort((a, b) => a.sort_order - b.sort_order)) {
      result.push({ module: mod, classData: cls });
    }
  }
  return result;
}

export function getAdjacentClasses(
  subjectId: string,
  classId: string
): {
  prev: import("./types").Class | null;
  next: import("./types").Class | null;
} {
  const all = getAllClassesForSubject(subjectId);
  const idx = all.findIndex((c) => c.classData.id === classId);
  return {
    prev: idx > 0 ? all[idx - 1].classData : null,
    next: idx < all.length - 1 ? all[idx + 1].classData : null,
  };
}
