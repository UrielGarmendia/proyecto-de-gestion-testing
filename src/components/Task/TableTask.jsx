import { useEffect, useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaCheck,
  FaPlus,
  FaTrashAlt,
  FaPen,
  FaRedo,
} from "react-icons/fa";
const TableTask = ({
  task,
  toggleComplete,
  toggleTaskDetails,
  getPriorityColor,
  deleteTask,
  setTaskToEdit,
  expandedTasks,
  subtaskInputs,
  handleSubtaskChange,
  handleAddSubtask,
  getSubtaskProgress,
  toggleSubtask,
}) => {
  const formatDateToDisplay = (time) => {
    if (!time) return "";
    const [year, month, day] = time.split("-");
    return `${parseInt(day)}/${parseInt(month)}/${year}`;
  };

  const handleUpperFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const isOverdue = (task) => {
    if (!task.date) return false;

    const now = new Date();
    const [year, month, day] = task.date.split("-").map(Number);

    if (task.time) {
      const [hour, minute] = task.time.split(":").map(Number);
      const taskDateTime = new Date(year, month - 1, day, hour, minute);
      return !task.completed && now > taskDateTime;
    } else {
      const taskDate = new Date(year, month - 1, day, 23, 59, 59);
      return !task.completed && now > taskDate;
    }
  };

  const [displayedPercentage, setDisplayedPercentage] = useState(0);

  const {
    percentage: subtaskProgressPercentage = 0,
    completed: subtaskProgressCompleted = 0,
    total: subtaskProgressTotal = 0,
  } = getSubtaskProgress(task.id) || {};

  const isLoadingSubtasks = subtaskProgressTotal === 0;

  useEffect(() => {
    if (isLoadingSubtasks) return;

    const timer = setInterval(() => {
      setDisplayedPercentage((prev) => {
        const diff = subtaskProgressPercentage - prev;
        if (Math.abs(diff) < 1) return subtaskProgressPercentage;
        return prev + Math.sign(diff);
      });
    }, 5);

    return () => clearInterval(timer);
  }, [subtaskProgressPercentage, isLoadingSubtasks]);

  return (
    <>
      <tr
        className={`border-b hover:bg-gray-50 ${
          task.completed ? "bg-gray-50" : ""
        }`}
      >
        <td className="p-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task.id)}
              className="mr-2 rounded text-blue-500 focus:ring-blue-500 h-4 w-4"
            />
            <span
              className={`text-sm ${
                task.completed ? "line-through text-gray-400" : ""
              }`}
              onClick={() => toggleTaskDetails(task.id)}
              style={{ cursor: "pointer" }}
            >
              {task.title}
            </span>
          </div>
        </td>
        <td className="p-2 text-sm">
          <div className="flex items-center">
            <span
              className={`inline-block w-2 h-2 rounded-full ${getPriorityColor(
                task.priority
              )} mr-2`}
            ></span>
            {handleUpperFirstLetter(task.priority)}
          </div>
        </td>
        <td className="p-2 text-sm">{task.category}</td>
        <td className="p-2 text-sm">
          {formatDateToDisplay(task.date) || "Sin fecha"}
        </td>
        <td className="p-2 text-sm">{task.time || "Sin hora"}</td>
        <td className="p-2 text-sm">
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              task.completed
                ? "bg-green-100 text-green-800"
                : isOverdue(task)
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {task.completed
              ? "Completada"
              : isOverdue(task)
              ? "Vencida"
              : "Pendiente"}
          </span>
        </td>
        <td className="p-2">
          <div className="flex space-x-2">
            <button
              onClick={() => toggleComplete(task.id)}
              className="p-1 text-gray-600 hover:text-blue-600"
              title={task.completed ? "Reabrir tarea" : "Completar tarea"}
            >
              {task.completed ? <FaRedo size={12} /> : <FaCheck size={12} />}
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="p-1 text-gray-600 hover:text-red-600"
              title="Eliminar tarea"
            >
              <FaTrashAlt size={12} />
            </button>
            <button
              onClick={() => setTaskToEdit(task)}
              className="p-1 text-gray-600 hover:text-blue-600"
              title="Editar tarea"
            >
              <FaPen size={12} />
            </button>
            <button
              onClick={() => toggleTaskDetails(task.id)}
              className="p-1 text-gray-600 hover:text-green-600"
              title="Detalles"
            >
              {expandedTasks[task.id] ? (
                <FaChevronUp size={12} />
              ) : (
                <FaChevronDown size={12} />
              )}
            </button>
          </div>
        </td>
      </tr>
      {expandedTasks[task.id] && (
        <tr className="border-b">
          <td colSpan="7" className="p-2 bg-gray-50">
            <div className="pl-6">
              {task.description && (
                <div className="mb-2">
                  <h4 className="font-medium text-gray-700 mb-1 text-sm">
                    Descripción:
                  </h4>
                  <p className="text-xs text-gray-600 whitespace-pre-line">
                    {task.description}
                  </p>
                </div>
              )}

              <div className="mb-2">
                <div className="flex items-center mb-1">
                  <input
                    type="text"
                    value={subtaskInputs[task.id]?.input || ""}
                    onChange={(e) =>
                      handleSubtaskChange(task.id, e.target.value)
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleAddSubtask(task.id)
                    }
                    placeholder="Escribe una subtarea..."
                    className="flex-1 p-1 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <button
                    onClick={() => handleAddSubtask(task.id)}
                    className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold p-1.5 rounded-lg text-xs"
                  >
                    <FaPlus size={16} />
                  </button>
                </div>
              </div>

              {/* Lista de subtareas */}
              <div>
                <h4 className="font-medium text-gray-700 mb-1 text-sm">
                  Subtareas ({(subtaskInputs[task.id]?.list || []).length}):
                </h4>
                <ul className="space-y-1 pl-2">
                  {(subtaskInputs[task.id]?.list || []).map((subtask) => (
                    <li key={subtask.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={subtask.completed || false}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleSubtask(task.id, subtask.id);
                        }}
                        className="mr-2 rounded text-blue-500 h-3 w-3"
                      />
                      <span
                        className={`text-xs ${
                          subtask.completed ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {subtask.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Barra de progreso (solo si hay subtareas) */}
                {(subtaskInputs[task.id]?.list || []).length > 0 && (
                  <div className="mt-2">
                    {isLoadingSubtasks ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-400 h-2 rounded-full animate-pulse w-1/3"></div>
                        </div>
                        <span className="text-xs text-gray-400">
                          Cargando progreso...
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ease-in-out ${
                              subtaskProgressPercentage < 50
                                ? "bg-red-400"
                                : subtaskProgressPercentage < 80
                                ? "bg-yellow-400"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${subtaskProgressPercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">
                          {displayedPercentage}%
                        </span>
                        <span className="text-xs text-gray-600">
                          {subtaskProgressCompleted}/{subtaskProgressTotal}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default TableTask;
