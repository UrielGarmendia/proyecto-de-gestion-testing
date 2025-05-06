import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import Task from "./Task";

const TaskList = ({
  tasks,
  deleteTask,
  toggleComplete,
  clearCompletedTasks,
  setTaskToEdit,
}) => {
  const [subtaskInputs, setSubtaskInputs] = useState({});
  const [expandedTasks, setExpandedTasks] = useState({});

  // totales de tareas
  const totalTasks = tasks.length;

  // total de completas
  const completedTasks = tasks.filter((tarea) => tarea.completed);
  const totalCompleted = completedTasks.length;
  // total de pendientes
  const totalPending = totalTasks - totalCompleted;

  //funcion que calcula el porcentaje para la barra
  const completionPercentage =
    totalTasks === 0 ? 0 : Math.round((totalCompleted / totalTasks) * 100);

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

  const handleAddSubtask = (taskId) => {
    setSubtaskInputs({
      ...subtaskInputs,
      [taskId]: "",
    });
    setExpandedTasks({
      ...expandedTasks,
      [taskId]: !expandedTasks[taskId],
    });
  };

  const handleSubtaskChange = (taskId, value) => {
    setSubtaskInputs({
      ...subtaskInputs,
      [taskId]: value,
    });
  };

  const handleSubtaskSubmit = (taskId) => {
    if (subtaskInputs[taskId]?.trim()) {
      console.log(
        `Subtarea añadida a la tarea ${taskId}: ${subtaskInputs[taskId]}`
      );
      setSubtaskInputs({
        ...subtaskInputs,
        [taskId]: "",
      });
    }
  };

  const toggleTaskDetails = (taskId) => {
    setExpandedTasks({
      ...expandedTasks,
      [taskId]: !expandedTasks[taskId],
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-lg font-semibold">Tareas Agregadas</h2>
        <div className="flex items-center gap-4 text-sm">
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
            className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm"
          >
            <FaTrashAlt size={12} /> Limpiar completas
          </button>
        </div>
      </div>
      {/*  barra de progreso */}
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
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <span className="text-sm text-gray-600">{completionPercentage}%</span>
      </div>

      {/* tabla de tareas */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
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
              {tasks.map((task) => (
                <Task
                  key={task.id}
                  task={task}
                  toggleComplete={toggleComplete}
                  toggleTaskDetails={toggleTaskDetails}
                  getPriorityColor={getPriorityColor}
                  deleteTask={deleteTask}
                  setTaskToEdit={setTaskToEdit}
                  handleAddSubtask={handleAddSubtask}
                  expandedTasks={expandedTasks}
                  subtaskInputs={subtaskInputs}
                  handleSubtaskChange={handleSubtaskChange}
                  handleSubtaskSubmit={handleSubtaskSubmit}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
