import { useEffect, useMemo, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import TableTask from "./Task/TableTask";
import CardTask from "./Task/CardTask";

const TaskList = ({
  tasks,
  deleteTask,
  toggleComplete,
  togglePriority,
  clearAllTasks,
  setTaskToEdit,
  isMobile,
  subtasks,
  setSubtasks,
  handleSubtaskChange,
  handleAddSubtask,
  toggleSubtask,
  getSubtaskProgress,
  moveToHistory,
}) => {
  const mobileView = isMobile !== undefined ? isMobile : false;

  const [expandedTasks, setExpandedTasks] = useState({});
  const [displayedPercentage, setDisplayedPercentage] = useState(0);

  // Filtrar tareas vencidas
  const {
    totalTasks,
    totalCompleted,
    totalPending,
    totalExpired,
    completionPercentage,
  } = useMemo(() => {
    const totalTasks = tasks.length;
    const totalCompleted = tasks.filter((task) => task.completed).length;
    const totalExpired = tasks.filter(
      (task) => new Date(task.fecha) < new Date() && !task.completed
    ).length;
    const completionPercentage =
      totalTasks === 0 ? 0 : Math.round((totalCompleted / totalTasks) * 100);

    return {
      totalTasks,
      totalCompleted,
      totalPending: totalTasks - totalCompleted,
      totalExpired,
      completionPercentage,
    };
  }, [tasks]);

  // barra de progreso
  useEffect(() => {
    // Animación más simple pero efectiva
    const timer = setInterval(() => {
      setDisplayedPercentage((prev) => {
        const diff = completionPercentage - prev;
        if (Math.abs(diff) < 1) return completionPercentage; // Umbral para detenerse
        return prev + Math.sign(diff); // Aumenta/disminuye de 1 en 1
      });
    }, 15); // Ajusta este valor para cambiar la velocidad

    return () => clearInterval(timer);
  }, [completionPercentage]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "alta":
        return "bg-red-500";
      case "media":
        return "bg-yellow-500";
      case "baja":
      default:
        return "bg-green-500";
    }
  };

  const toggleTaskDetails = (taskId) => {
    setExpandedTasks({ ...expandedTasks, [taskId]: !expandedTasks[taskId] });
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
  };

  const handleToggleComplete = (taskId) => {
    toggleComplete(taskId); // Llama a la función original

    // Preservamos las subtareas al completar la tarea
    setSubtasks((prev) => {
      if (!prev[taskId]) return prev;
      return {
        ...prev,
        [taskId]: {
          ...prev[taskId],
          list: prev[taskId].list.map((subtask) => ({
            ...subtask,
            completed: true, // Opcional: marcar todas las subtareas como completadas
          })),
        },
      };
    });
  };

  const handleTogglePriority = (taskId) => {
    togglePriority(taskId); // Llama a la función original
  };

  return (
    <div className="w-full space-y-4">
      {/* Parte con las estadísticas de tareas */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center gap-3">
        <h2 className="text-lg font-semibold">Tareas Agregadas</h2>
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <span>
            Creadas: <b>{totalTasks}</b>
          </span>
          <span className="text-green-600">
            Completadas: <b>{totalCompleted}</b>
          </span>
          <span className="text-blue-600">
            Pendientes: <b>{totalPending}</b>
          </span>
          <span className="text-red-600">
            Vencidas: <b>{totalExpired}</b>
          </span>
          <button
            onClick={() => {
              clearAllTasks();
            }}
            className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs sm:text-sm"
          >
            <FaTrashAlt size={12} /> Limpiar todas las tareas
          </button>
        </div>
      </div>

      {/* Barra que muestra progreso de completado */}
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              completionPercentage < 50
                ? "bg-red-400"
                : completionPercentage < 80
                ? "bg-yellow-400"
                : "bg-green-500"
            }`}
            style={{
              width: `${completionPercentage}%`,
              transition: "width 300ms cubic-bezier(0.65, 0, 0.35, 1)",
            }}
          />
        </div>
        <span className="text-sm text-gray-600">
          {/* Muestra el porcentaje directamente */}
          {displayedPercentage}%
        </span>
      </div>

      {/* Vista en escritorio - usa una tabla */}
      {!mobileView && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <div className="overflow-y-auto max-h-[332px]">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr className="text-left text-sm text-gray-600">
                    <th className="p-3 border-b">Tarea</th>
                    <th className="p-3 border-b">Prioridad</th>
                    <th className="p-3 border-b">Categoría</th>
                    <th className="p-3 border-b">Fecha</th>
                    <th className="p-3 border-b">Hora</th>
                    <th className="p-3 border-b">Estado</th>
                    <th className="p-3 border-b">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length > 0 ? (
                    tasks.map((task) => (
                      <TableTask
                        key={task.id}
                        task={task}
                        toggleComplete={handleToggleComplete}
                        togglePriority={handleTogglePriority}
                        toggleTaskDetails={toggleTaskDetails}
                        getPriorityColor={getPriorityColor}
                        deleteTask={deleteTask}
                        setTaskToEdit={setTaskToEdit}
                        expandedTasks={expandedTasks}
                        subtaskInputs={subtasks}
                        handleSubtaskChange={handleSubtaskChange}
                        handleAddSubtask={handleAddSubtask}
                        toggleSubtask={toggleSubtask}
                        getSubtaskProgress={getSubtaskProgress}
                        moveToHistory={moveToHistory}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-4 text-center text-gray-500">
                        No hay tareas agregadas
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Vista en celular - usa cards */}
      {isMobile && (
        <div className="overflow-y-auto max-h-[332px] px-1">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <CardTask
                key={task.id}
                task={task}
                toggleComplete={toggleComplete}
                toggleTaskDetails={toggleTaskDetails}
                getPriorityColor={getPriorityColor}
                deleteTask={deleteTask}
                setTaskToEdit={() => handleEditTask(task)}
                expandedTasks={expandedTasks}
                subtaskInputs={subtasks}
                handleAddSubtask={handleAddSubtask}
                handleSubtaskChange={handleSubtaskChange}
                toggleSubtask={toggleSubtask}
                getSubtaskProgress={getSubtaskProgress}
              />
            ))
          ) : (
            <div className="p-4 text-center text-gray-500 bg-white rounded-lg shadow border border-gray-200">
              No hay tareas agregadas
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskList;
