import { useEffect, useMemo, useState } from "react";
import { FaClipboard, FaExclamationTriangle, FaTrashAlt } from "react-icons/fa";
import TableTask from "./Task/TableTask";
import CardTask from "./Task/CardTask";
import TaskForm from "./TaskForm";

const TaskList = ({
  tasks,
  deleteTask,
  toggleComplete,
  togglePriority,
  clearAllTasks,
  setTaskToEdit,
  onEditClick,
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

  const handleEdit = (task) => {
    setTaskToEdit(task);

    // Enfocar el formulario principal después de un pequeño retraso
    setTimeout(() => {
      const formContainer = document.getElementById("form-container");
      if (formContainer) {
        formContainer.scrollIntoView({ behavior: "smooth" });
        const titleInput = formContainer.querySelector('input[name="title"]');
        if (titleInput) titleInput.focus();
      }
    }, 100);
  };

  // const cancelEdit = () => {
  //   setEditingTaskId(null);
  //   setTaskToEdit(null);
  // };

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
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Resumen de Tareas
            </h2>
          </div>
          <div className="w-full sm:w-auto">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="text-xs font-medium text-gray-500">Creadas</p>
                <p className="text-xl font-bold text-gray-800">{totalTasks}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                <p className="text-xs font-medium text-green-600">
                  Completadas
                </p>
                <p className="text-xl font-bold text-green-700">
                  {totalCompleted}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="text-xs font-medium text-blue-600">Pendientes</p>
                <p className="text-xl font-bold text-blue-700">
                  {totalPending}
                </p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                <p className="text-xs font-medium text-red-600">Vencidas</p>
                <p className="text-xl font-bold text-red-700">{totalExpired}</p>
              </div>
              <button
                onClick={handleClearAll}
                className="flex flex-col sm:flex-row items-center justify-center gap-1 p-3 rounded-lg border border-gray-200 hover:border-red-200 bg-white hover:bg-red-50 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <FaTrashAlt size={14} className="text-red-500" />
                  <span className="text-xs font-medium text-red-600">
                    Limpiar todo
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

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

      {showClearConfirmation && (
        <div className="fixed inset-0 bg-[rgba(0,_0,_0,_0.600)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <FaExclamationTriangle className="text-red-600" size={24} />
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

      {!mobileView && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-h-[255px]">
              <div className="rounded-xl overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-50 to-gray-50 sticky top-0 bg-[#f2f2f2]">
                    <tr className="text-left text-sm font-medium text-gray-600">
                      <th className="p-4 pl-6 border-b border-gray-200 font-semibold">
                        Tarea
                      </th>
                      <th className="p-4 border-b border-gray-200 font-semibold">
                        Prioridad
                      </th>
                      <th className="p-4 border-b border-gray-200 font-semibold">
                        Categoría
                      </th>
                      <th className="p-4 border-b border-gray-200 font-semibold">
                        Fecha
                      </th>
                      <th className="p-4 border-b border-gray-200 font-semibold">
                        Hora
                      </th>
                      <th className="p-4 border-b border-gray-200 font-semibold">
                        Estado
                      </th>
                      <th className="p-4 pr-6 border-b border-gray-200 font-semibold text-center">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {tasks.length > 0 ? (
                      tasks.map((task) => [
                        <TableTask
                          key={`task-${task.id}`}
                          task={task}
                          toggleComplete={handleToggleComplete}
                          togglePriority={handleTogglePriority}
                          toggleTaskDetails={toggleTaskDetails}
                          getPriorityColor={getPriorityColor}
                          deleteTask={deleteTask}
                          setTaskToEdit={() => handleEdit(task)}
                          expandedTasks={expandedTasks}
                          subtaskInputs={subtasks}
                          handleSubtaskChange={handleSubtaskChange}
                          handleAddSubtask={handleAddSubtask}
                          toggleSubtask={toggleSubtask}
                          getSubtaskProgress={getSubtaskProgress}
                          moveToHistory={moveToHistory}
                        />,
                      ])
                    ) : (
                      <tr>
                        <td colSpan="7" className="p-8 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <FaClipboard size={60} className="mb-1" />
                            <h3 className="text-lg font-medium mb-1">
                              No hay tareas
                            </h3>
                            <p className="text-sm max-w-md">
                              Comienza agregando una nueva tarea
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {isMobile && (
        <div className="overflow-y-auto max-h-[332px] px-1">
          {tasks.length > 0 ? (
            tasks.map((task) => [
              <CardTask
                key={`task-${task.id}`}
                task={task}
                toggleComplete={toggleComplete}
                toggleTaskDetails={toggleTaskDetails}
                getPriorityColor={getPriorityColor}
                deleteTask={deleteTask}
                onEditClick={onEditClick}
                expandedTasks={expandedTasks}
                subtaskInputs={subtasks}
                handleAddSubtask={handleAddSubtask}
                handleSubtaskChange={handleSubtaskChange}
                toggleSubtask={toggleSubtask}
                getSubtaskProgress={getSubtaskProgress}
              />,
            ])
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
