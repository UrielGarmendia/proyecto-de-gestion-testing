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
      // hacer logica de la subtarea
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
    <div className="w-full">
      <div className="flex justify-between items-start mb-4 flex-col sm:flex-row sm:items-center">
        <h2 className="text-xl font-semibold mb-2 sm:mb-0">Tareas Agregadas</h2>
        <button
          onClick={clearCompletedTasks}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-lg flex items-center"
        >
          <FaTrashAlt className="mr-2" /> Limpiar completadas
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border-b text-sm">Tarea</th>{" "}
              <th className="p-2 border-b text-sm">Prioridad</th>
              <th className="p-2 border-b text-sm">Categoría</th>
              <th className="p-2 border-b text-sm">Fecha Límite</th>
              <th className="p-2 border-b text-sm">Estado</th>
              <th className="p-2 border-b text-sm">Acciones</th>
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
      {tasks.length === 0 && (
        <div className="text-center py-6 text-gray-500 text-sm">
          No hay tareas agregadas aún
        </div>
      )}
    </div>
  );
};

export default TaskList;
