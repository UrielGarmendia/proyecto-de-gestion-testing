import { useEffect, useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaEdit,
  FaPlus,
  FaTrashAlt,
  FaStar,
  FaArchive,
  FaPen,
} from "react-icons/fa";

const CardTask = ({
  task,
  toggleComplete,
  togglePriority,
  toggleTaskDetails,
  getPriorityColor,
  deleteTask,
  onEditClick,
  expandedTasks,
  subtaskInputs,
  handleSubtaskChange,
  handleAddSubtask,
  toggleSubtask,
  getSubtaskProgress,
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
    }, 3);

    return () => clearInterval(timer);
  }, [subtaskProgressPercentage, isLoadingSubtasks]);

  return (
    <div className="mb-3 bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div
        className="p-3 flex items-center justify-between"
        onClick={() => toggleTaskDetails(task.id)}
      >
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={task.completed}
            onClick={(e) => e.stopPropagation()}
            onChange={() => {
              toggleComplete(task.id);
            }}
            className={`rounded-full h-5 w-5 appearance-none border-2 ${
              task.completed
                ? "border-green-400 bg-green-400 checked:bg-green-400"
                : "border-gray-300 hover:border-blue-400"
            } focus:ring-0 focus:ring-offset-0 cursor-pointer transition-colors`}
          />
          <span
            className={`text-sm ${
              task.completed ? "line-through text-gray-400" : "text-gray-700"
            }`}
          >
            {task.title}
          </span>
        </div>
        <div className="flex gap-2">
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
          <button className="text-blue-500 hover:text-blue-700 p-1">
            {expandedTasks[task.id] ? (
              <FaChevronUp size={14} />
            ) : (
              <FaChevronDown size={14} />
            )}
          </button>
        </div>
      </div>

      <div className="px-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block w-2 h-2 rounded-full ${getPriorityColor(
              task.priority
            )}`}
          ></span>
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs ${
              task.priority === "alta"
                ? "bg-red-100 text-red-800"
                : task.priority === "media"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {handleUpperFirstLetter(task.priority)}
          </span>
          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
            {task.category}
          </span>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            task.completed
              ? "bg-green-100 text-green-800"
              : isOverdue(task)
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {task.completed
            ? "Completada"
            : isOverdue(task)
            ? "Vencida"
            : "Pendiente"}
        </span>
      </div>
      {expandedTasks[task.id] && (
        <div
          className="p-3 border-t border-gray-200 bg-gray-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <span className="text-xs text-gray-500">Categoría:</span>
              <p className="text-sm">{task.category || "-"}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Fecha:</span>
              <p className="text-sm">
                {formatDateToDisplay(task.date) || "Sin fecha"}
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-500">Hora:</span>
              <p className="text-sm">{task.time || "Sin hora"}</p>
            </div>
          </div>

          {task.description && (
            <div className="mb-3">
              <span className="text-xs text-gray-500">Descripción:</span>
              <p className="text-sm text-gray-600 bg-white p-2 rounded border border-gray-200">
                {task.description}
              </p>
            </div>
          )}

          <div className="mb-2">
            <div className="flex items-center mb-1">
              <input
                type="text"
                value={subtaskInputs[task.id]?.input || ""}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => handleSubtaskChange(task.id, e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleAddSubtask(task.id)
                }
                placeholder="Escribe una subtarea..."
                className="flex-1 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm"
              />
              <button
                onClick={() => handleAddSubtask(task.id)}
                className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold p-2 rounded-lg text-xs flex items-center justify-center"
              >
                <FaPlus size={14} className="mr-1" />
                <span>Agregar</span>
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-1 text-sm">
              Subtareas ({(subtaskInputs[task.id]?.list || []).length})
            </h4>
            {/* Barra de progreso (solo si hay subtareas) */}
            {(subtaskInputs[task.id]?.list || []).length > 0 && (
              <div className="mt-3">
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
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2 rounded-full ${
                          displayedPercentage < 50
                            ? "bg-red-400"
                            : displayedPercentage < 80
                            ? "bg-yellow-400"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${displayedPercentage}%`,
                          transition:
                            "width 100ms cubic-bezier(0.65, 0, 0.35, 1)",
                        }}
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
            <ul className="space-y-2">
              {(subtaskInputs[task.id]?.list || []).map((subtask) => (
                <li
                  key={subtask.id}
                  className="flex items-center bg-white p-2 rounded border border-gray-200"
                >
                  <input
                    type="checkbox"
                    checked={subtask.completed || false}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleSubtask(task.id, subtask.id);
                    }}
                    className={`mr-2 rounded-full h-4 w-4 appearance-none border-2 ${
                      subtask.completed
                        ? "border-green-400 bg-green-400"
                        : "border-gray-300 hover:border-blue-400"
                    } focus:ring-0 focus:ring-offset-0 cursor-pointer transition-colors`}
                  />
                  <span
                    className={`text-sm flex-1 ${
                      subtask.completed ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {subtask.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
            {task.completed && (
              <button
                onClick={() => moveToHistory(task.id)}
                className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                title="Mover al historial"
              >
                <FaArchive size={16} />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditClick(task);
              }}
              className="p-2 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50"
              title="Editar tarea"
            >
              <FaPen size={14} />
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50"
              title="Eliminar"
            >
              <FaTrashAlt size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardTask;
