import {
  FaTrophy,
  FaCheckCircle,
  FaCalendarCheck,
  FaBolt,
  FaStar,
  FaSun,
  FaFire,
  FaListUl,
} from "react-icons/fa";

const achievementsConfig = [
  {
    id: "first_task",
    title: "Por algo se empieza",
    description: "Completaste tu primera tarea",
    icon: <FaCheckCircle />,
    condition: (stats) => stats.totalCompleted >= 1,
    unlocked: false,
  },
  {
    id: "five_tasks",
    title: "Rachita",
    description: "Completaste 5 tareas",
    icon: <FaFire />,
    condition: (stats) => stats.totalCompleted >= 5,
    unlocked: false,
  },
  {
    id: "ten_tasks",
    title: "Flama 🔥",
    description: "Completaste 10 tareas",
    icon: <FaTrophy />,
    condition: (stats) => stats.totalCompleted >= 10,
    unlocked: false,
  },
  {
    id: "all_tasks_week",
    title: "Semanita productiva",
    description: "Completaste todas las tareas de esta semana",
    icon: <FaCalendarCheck />,
    condition: (stats) =>
      stats.weeklyCompletion === 100 && stats.totalWeeklyTasks > 0,
    unlocked: false,
  },
  {
    id: "high_priority",
    title: "Prioridades claras",
    description: "Completaste 3 tareas de alta prioridad",
    icon: <FaStar />,
    condition: (stats) => stats.highPriorityCompleted >= 3,
    unlocked: false,
  },
  {
    id: "early_bird",
    title: "Al que madruga dios lo ayuda",
    description: "Completaste una tarea antes de las 8 AM",
    icon: <FaSun />,
    condition: (stats) => stats.earlyMorningTasks > 0,
    unlocked: false,
  },
  {
    id: "streak_3",
    title: "Rachita de 3 días",
    description: "Completaste tareas por 3 días consecutivos",
    icon: <FaBolt />,
    condition: (stats) => stats.currentStreak >= 3,
    unlocked: false,
  },
  {
    id: "all_categories",
    title: "Generalista",
    description: "Completaste tareas en todas las categorías",
    icon: <FaListUl />,
    condition: (stats) =>
      stats.uniqueCategories >= 3 &&
      stats.uniqueCategories >= stats.totalCategories &&
      stats.totalCategories > 0,
    unlocked: false,
  },
];

export const calculateStats = (tasks) => {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const completedTasks = tasks.filter((task) => task.completed);
  const weeklyTasks = completedTasks.filter(
    (task) => new Date(task.completedAt || task.movedAt) >= oneWeekAgo
  );

  const highPriorityTasks = completedTasks.filter(
    (task) => task.priority === "alta"
  );

  const totalWeeklyTasks = tasks.filter(
    (task) => task.date && new Date(task.date) >= oneWeekAgo
  ).length;

  // Verificar tareas temprano
  const earlyMorningTasks = completedTasks.filter((task) => {
    const completedDate = task.completedAt || task.movedAt;
    if (!completedDate) return false;
    const completedHour = new Date(completedDate).getHours();
    return completedHour < 8;
  }).length;

  // Calcular racha actual
  let currentStreak = 0;
  const today = new Date().toDateString();
  const completedDates = completedTasks
    .map((task) => {
      const date = task.completedAt || task.movedAt;
      return date ? new Date(date).toDateString() : null;
    })
    .filter((date) => date !== null);

  const uniqueDates = [...new Set(completedDates)].sort().reverse();

  if (uniqueDates.length > 0 && uniqueDates[0] === today) {
    currentStreak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1]);
      const currDate = new Date(uniqueDates[i]);
      const diffDays = (prevDate - currDate) / (1000 * 60 * 60 * 24);
      if (diffDays === 1) currentStreak++;
      else break;
    }
  }

  // Categorías únicas completadas (solo de tareas completadas)
  const allCategories = [
    ...new Set(tasks.map((task) => task.category).filter(Boolean)),
  ];
  const completedCategories = [
    ...new Set(completedTasks.map((task) => task.category).filter(Boolean)),
  ];

  return {
    totalCompleted: completedTasks.length,
    weeklyCompletion:
      totalWeeklyTasks > 0
        ? Math.round((weeklyTasks.length / totalWeeklyTasks) * 100)
        : 0,
    totalWeeklyTasks, // Agregamos esta propiedad que faltaba
    highPriorityCompleted: highPriorityTasks.length,
    earlyMorningTasks,
    currentStreak,
    uniqueCategories: completedCategories.length,
    totalCategories: allCategories.length,
    hasTasks: tasks.length > 0,
  };
};

export { achievementsConfig };
