import { useEffect, useRef } from "react";
import { achievementsConfig, calculateStats } from "../utils/achievementsUtils";

const Achievements = ({
  tasks,
  taskHistory,
  showNotification,
  unlockedAchievements,
  onAchievementUnlock,
}) => {
  // Usamos useRef para mantener referencia de los logros previamente desbloqueados
  const previouslyUnlockedRef = useRef(new Set(unlockedAchievements));

  useEffect(() => {
    // Combinar tareas actuales y historial para cálculos completos
    const allTasks = [...tasks, ...taskHistory];
    const stats = calculateStats(allTasks);

    const newlyUnlocked = [];
    const currentUnlocked = [...unlockedAchievements];

    achievementsConfig.forEach((achievement) => {
      const isCurrentlyUnlocked = unlockedAchievements.includes(achievement.id);
      const shouldBeUnlocked = achievement.condition(stats);
      const wasPreviouslyUnlocked = previouslyUnlockedRef.current.has(
        achievement.id
      );

      // Solo desbloquear si cumple la condición Y no estaba desbloqueado antes
      if (shouldBeUnlocked && !isCurrentlyUnlocked) {
        currentUnlocked.push(achievement.id);

        // Solo mostrar notificación si no estaba previamente desbloqueado
        // (evita notificaciones al cargar la página)
        if (!wasPreviouslyUnlocked) {
          newlyUnlocked.push(achievement);
        }

        // Actualizar la referencia
        previouslyUnlockedRef.current.add(achievement.id);
      }
    });

    // Actualizar el estado si hay cambios
    if (currentUnlocked.length !== unlockedAchievements.length) {
      onAchievementUnlock(currentUnlocked);
    }

    // Mostrar notificaciones solo para logros verdaderamente nuevos
    if (newlyUnlocked.length > 0) {
      newlyUnlocked.forEach((achievement) => {
        showNotification({
          title: `🏆 ${achievement.title}`,
          message: achievement.description,
          icon: "🏆",
        });
      });
    }
  }, [
    tasks,
    taskHistory,
    unlockedAchievements,
    onAchievementUnlock,
    showNotification,
  ]);

  // Actualizar la referencia cuando cambian los logros desbloqueados desde el localStorage
  useEffect(() => {
    previouslyUnlockedRef.current = new Set(unlockedAchievements);
  }, [unlockedAchievements]);

  return null;
};

export default Achievements;
