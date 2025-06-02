import { useEffect, useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaStar,
  FaPlus,
  FaTrashAlt,
  FaPen,
  FaArchive,
} from "react-icons/fa";

const TableTask = ({
  task,
  toggleComplete,
  togglePriority,
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
  moveToHistory,
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
        className={`border-b border-gray-100 transition-colors duration-150 ${
          task.completed
            ? "bg-gray-50 text-gray-400"
            : "hover:bg-blue-50 bg-white"
        } ${expandedTasks[task.id] ? "bg-blue-50" : ""}`}
      >
        <td className="p-3 pl-4 rounded-l-lg">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task.id)}
              className={`mr-3 rounded-full h-5 w-5 appearance-none border-2 ${
                task.completed
                  ? "border-green-400 bg-green-400 checked:bg-green-400"
                  : "border-gray-300 hover:border-blue-400"
              } focus:ring-0 focus:ring-offset-0 cursor-pointer transition-colors`}
            />
            <span
              className={`text-sm font-medium ${
                task.completed ? "line-through text-gray-400" : "text-gray-700"
              }`}
              onClick={() => toggleTaskDetails(task.id)}
              style={{ cursor: "pointer" }}
            >
              {task.title}
            </span>
          </div>
        </td>
        <td className="p-3">
          <div className="flex items-center">
            <span
              className={`inline-block w-3 h-3 rounded-full ${getPriorityColor(
                task.priority
              )} mr-2`}
            ></span>
            <span className="text-sm font-medium text-gray-700">
              {handleUpperFirstLetter(task.priority)}
            </span>
          </div>
        </td>
        <td className="p-3">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {task.category}
          </span>
        </td>
        <td className="p-3">
          <span className="text-sm font-medium text-gray-700">
            {formatDateToDisplay(task.date) || (
              <span className="text-gray-400">Sin fecha</span>
            )}
          </span>
        </td>
        <td className="p-3">
          <span className="text-sm font-medium text-gray-700">
            {task.time || <span className="text-gray-400">Sin hora</span>}
          </span>
        </td>
        <td className="p-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              task.completed
                ? "bg-green-100 text-green-700"
                : isOverdue(task)
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {task.completed
              ? "Completada"
              : isOverdue(task)
              ? "Vencida"
              : "Pendiente"}
          </span>
        </td>
        <td className="p-3 pr-4 rounded-r-lg">
          <div className="flex space-x-2 justify-end">
            <button
              onClick={() => togglePriority(task.id)}
              className={`p-2 rounded-full ${
                task.priority !== "alta"
                  ? "text-gray-400 hover:text-yellow-400 hover:bg-yellow-50"
                  : "invisible"
              }`}
              title="Subir prioridad"
            >
              <FaStar size={14} />
            </button>

            <button
              onClick={() => deleteTask(task.id)}
              className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50"
              title="Eliminar tarea"
            >
              <FaTrashAlt size={14} />
            </button>
            <button
              onClick={() => setTaskToEdit(task)}
              className="p-2 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50"
              title="Editar tarea"
            >
              <FaPen size={14} />
            </button>
            <button
              onClick={() => toggleTaskDetails(task.id)}
              className="p-2 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50"
              title="Detalles"
            >
              {expandedTasks[task.id] ? (
                <FaChevronUp size={14} />
              ) : (
                <FaChevronDown size={14} />
              )}
            </button>
            {task.completed && (
              <button
                onClick={() => moveToHistory(task.id)}
                className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                title="Mover al historial"
              >
                <FaArchive size={14} />
              </button>
            )}
          </div>
        </td>
      </tr>
      {expandedTasks[task.id] && (
        <tr className="border-b border-gray-100">
          <td colSpan="7" className="p-4 bg-blue-50 rounded-b-lg">
            <div className="pl-10 pr-4">
              {task.description && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2 text-sm">
                    Descripción:
                  </h4>
                  <p className="text-sm text-gray-600 whitespace-pre-line bg-white p-3 rounded-lg border border-gray-200">
                    {task.description}
                  </p>
                </div>
              )}

              <div className="mb-4">
                <div className="flex items-center">
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
                    className="flex-1 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm"
                  />
                  <button
                    onClick={() => handleAddSubtask(task.id)}
                    className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold p-2 rounded-lg text-sm flex items-center justify-center"
                  >
                    <FaPlus size={14} className="mr-1" />
                    <span>Agregar</span>
                  </button>
                </div>
              </div>

              {/* Lista de subtareas */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2 text-sm">
                  Subtareas ({(subtaskInputs[task.id]?.list || []).length})
                </h4>
                <ul className="space-y-2">
                  {(subtaskInputs[task.id]?.list || []).map((subtask) => (
                    <li
                      key={subtask.id}
                      className="flex items-center bg-white p-3 rounded-lg border border-gray-200"
                    >
                      <input
                        type="checkbox"
                        checked={subtask.completed || false}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleSubtask(task.id, subtask.id);
                        }}
                        className={`mr-3 rounded-full h-4 w-4 appearance-none border-2 ${
                          subtask.completed
                            ? "border-green-400 bg-green-400"
                            : "border-gray-300 hover:border-blue-400"
                        } focus:ring-0 focus:ring-offset-0 cursor-pointer transition-colors`}
                      />
                      <span
                        className={`text-sm flex-1 ${
                          subtask.completed
                            ? "line-through text-gray-400"
                            : "text-gray-700"
                        }`}
                      >
                        {subtask.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* barra de progreso de subtareas */}
                {(subtaskInputs[task.id]?.list || []).length > 0 && (
                  <div className="mt-4">
                    {isLoadingSubtasks ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-400 h-2.5 rounded-full animate-pulse w-1/3"></div>
                        </div>
                        <span className="text-xs text-gray-500">
                          Cargando progreso...
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-500 ease-in-out ${
                              subtaskProgressPercentage < 50
                                ? "bg-red-400"
                                : subtaskProgressPercentage < 80
                                ? "bg-yellow-400"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${subtaskProgressPercentage}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">
                            {displayedPercentage}%
                          </span>
                          <span className="text-xs text-gray-500">
                            ({subtaskProgressCompleted}/{subtaskProgressTotal})
                          </span>
                        </div>
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
