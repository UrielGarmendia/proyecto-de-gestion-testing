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
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);

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
    const timer = setInterval(() => {
      setDisplayedPercentage((prev) => {
        const diff = completionPercentage - prev;
        if (Math.abs(diff) < 1) return completionPercentage;
        return prev + Math.sign(diff);
      });
    }, 15);

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
    toggleComplete(taskId);

    setSubtasks((prev) => {
      if (!prev[taskId]) return prev;
      return {
        ...prev,
        [taskId]: {
          ...prev[taskId],
          list: prev[taskId].list.map((subtask) => ({
            ...subtask,
            completed: true,
          })),
        },
      };
    });
  };

  const handleTogglePriority = (taskId) => {
    togglePriority(taskId);
  };

  const handleClearAll = () => {
    setShowClearConfirmation(true);
  };

  const handleClearCancel = () => {
    setShowClearConfirmation(false);
  };

  const handleClearConfirm = () => {
    clearAllTasks();
    setShowClearConfirmation(false);
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
            onClick={handleClearAll}
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
        <span className="text-sm text-gray-600">{displayedPercentage}%</span>
      </div>

      {/* Diálogo de confirmación */}
      {showClearConfirmation && (
        <div className="fixed inset-0 bg-[rgba(0,_0,_0,_0.600)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  ¿Limpiar todas las tareas?
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Se eliminarán las tareas pendientes y las completadas se
                    moverán al historial.
                    <br />
                    <strong>Esta acción no se puede deshacer.</strong>
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={handleClearCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleClearConfirm}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resto del componente... */}
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
