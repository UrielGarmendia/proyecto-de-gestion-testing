import {
  FaChevronDown,
  FaChevronUp,
  FaEdit,
  FaPlus,
  FaTrashAlt,
} from "react-icons/fa";

const CardTask = ({
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
  toggleSubtask,
  getSubtaskProgress,
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

  return (
    <div
      onClick={() => toggleTaskDetails(task.id)}
      className="mb-3 bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
    >
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={task.completed}
            onClick={(e) => e.stopPropagation()}
            onChange={() => {
              toggleComplete(task.id);
            }}
            className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4"
          />
          <span
            className={`text-sm ${
              task.completed ? "line-through text-gray-400" : ""
            }`}
          >
            {handleUpperFirstLetter(task.title)}
          </span>
        </div>
        <div className="flex gap-2">
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
        <span
          className={`inline-block px-2 py-1 rounded-full text-xs text-white ${getPriorityColor(
            task.priority
          )}`}
        >
          {handleUpperFirstLetter(task.priority)}
        </span>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
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
      </div>

      {expandedTasks[task.id] && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
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
              <p className="text-sm text-gray-600">{task.description}</p>
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
                className="flex-1 p-1 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <button
                onClick={() => handleAddSubtask(task.id)}
                className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-2 rounded-lg text-xs"
              >
                <FaPlus size={10} /> Agregar
              </button>
            </div>
          </div>

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
            {(subtaskInputs[task.id]?.list || []).length > 0 &&
              getSubtaskProgress(task.id) && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full ${
                        getSubtaskProgress(task.id).percentage < 50
                          ? "bg-red-400"
                          : getSubtaskProgress(task.id).percentage < 80
                          ? "bg-yellow-400"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${getSubtaskProgress(task.id).percentage}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    {getSubtaskProgress(task.id).completed}/
                    {getSubtaskProgress(task.id).total}
                  </span>
                </div>
              )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
            <button
              onClick={() => setTaskToEdit(task)}
              className="text-yellow-500 hover:text-yellow-700 p-2"
              title="Editar"
            >
              <FaEdit size={14} />
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-500 hover:text-red-700 p-2"
              title="Eliminar"
            >
              <FaTrashAlt size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardTask;
