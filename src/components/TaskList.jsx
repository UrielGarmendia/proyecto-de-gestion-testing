import { useEffect, useMemo, useRef, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import TableTask from "./Task/TableTask";
import CardTask from "./Task/CardTask";

const TaskList = (props) => {
  const {
    tasks,
    deleteTask,
    toggleComplete,
    clearCompletedTasks,
    setTaskToEdit,
    isMobile,
  } = props;
  const mobileView = isMobile !== undefined ? isMobile : false;

  const [subtaskInputs, setSubtaskInputs] = useState({});
  const [expandedTasks, setExpandedTasks] = useState({});
  const [displayedPercentage, setDisplayedPercentage] = useState(0);

  // estadisticas de tareas
  const { totalTasks, totalCompleted, totalPending, completionPercentage } =
    useMemo(() => {
      const totalTasks = tasks.length;
      const totalCompleted = tasks.filter((task) => task.completed).length;
      const completionPercentage =
        totalTasks === 0 ? 0 : Math.round((totalCompleted / totalTasks) * 100);
      return {
        totalTasks,
        totalCompleted,
        totalPending: totalTasks - totalCompleted,
        completionPercentage,
      };
    }, [tasks]);

  // barra de progreso
  // const completionPercentage =
  //   totalTasks === 0 ? 0 : Math.round((totalCompleted / totalTasks) * 100);
  // const [displayedPercentage, setDisplayedPercentage] =
  //   useState(completionPercentage);

  const animationRef = useRef();
  useEffect(() => {
    const targetPercentage = completionPercentage;
    const duration = 100;
    const startTime = performance.now();
    const startPercentage = displayedPercentage;

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      const newPercentage =
        startPercentage + (targetPercentage - startPercentage) * progress;
      setDisplayedPercentage(Math.round(newPercentage));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
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

  // const handleAddSubtask = (taskId) => {
  //   setSubtaskInputs({ ...subtaskInputs, [taskId]: "" });
  //   setExpandedTasks({ ...expandedTasks, [taskId]: !expandedTasks[taskId] });
  // };

  const handleSubtaskChange = (taskId, value) => {
    setSubtaskInputs({ ...subtaskInputs, [taskId]: value });
  };

  const handleSubtaskSubmit = (taskId) => {
    if (subtaskInputs[taskId]?.trim()) {
      console.log(
        `Subtarea añadida a la tarea ${taskId}: ${subtaskInputs[taskId]}`
      );
      setSubtaskInputs({ ...subtaskInputs, [taskId]: "" });
    }
  };

  const toggleTaskDetails = (taskId) => {
    setExpandedTasks({ ...expandedTasks, [taskId]: !expandedTasks[taskId] });
  };

  return (
    <div className="w-full space-y-4">
      {console.log()}
      {/* parte con las estadísticas de tareas */}
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
          <button
            onClick={clearCompletedTasks}
            className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs sm:text-sm"
          >
            <FaTrashAlt size={12} /> Limpiar completas
          </button>
        </div>
      </div>

      {/* barra que muestra progreso de completado */}
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-width duration-500 ease-in-out ${
              completionPercentage < 50
                ? "bg-red-400"
                : completionPercentage < 80
                ? "bg-yellow-400"
                : "bg-green-500"
            }`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <span className="text-sm text-gray-600">{displayedPercentage}%</span>
      </div>

      {/* vista en escritorio - usa una tabla */}
      {/* {console.log(isMobile)} */}
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
                        toggleComplete={toggleComplete}
                        toggleTaskDetails={toggleTaskDetails}
                        getPriorityColor={getPriorityColor}
                        deleteTask={deleteTask}
                        setTaskToEdit={setTaskToEdit}
                        expandedTasks={expandedTasks}
                        subtaskInputs={subtaskInputs}
                        handleSubtaskChange={handleSubtaskChange}
                        handleSubtaskSubmit={handleSubtaskSubmit}
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

      {/* vista en celu - usa cards */}
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
                setTaskToEdit={setTaskToEdit}
                expandedTasks={expandedTasks}
                subtaskInputs={subtaskInputs}
                handleSubtaskChange={handleSubtaskChange}
                handleSubtaskSubmit={handleSubtaskSubmit}
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
