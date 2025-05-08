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
  handleSubtaskSubmit,
}) => {
  const formatDateToDisplay = (time) => {
    if (!time) return "";
    const [year, month, day] = time.split("-");
    return `${parseInt(day)}/${parseInt(month)}/${year}`;
  };

  return (
    <div className="mb-3 bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleComplete(task.id)}
            className="rounded text-blue-500 focus:ring-blue-500 h-4 w-4"
          />
          <span
            className={`text-sm ${
              task.completed ? "line-through text-gray-400" : ""
            }`}
          >
            {task.title}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => toggleTaskDetails(task.id)}
            className="text-blue-500 hover:text-blue-700 p-1"
          >
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
          {task.priority}
        </span>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            task.completed
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {task.completed ? "Completada" : "Pendiente"}
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

          <div className="flex items-center gap-2 mb-3">
            <input
              type="text"
              value={subtaskInputs[task.id] || ""}
              onChange={(e) => handleSubtaskChange(task.id, e.target.value)}
              placeholder="Añadir subtarea..."
              className="flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={() => handleSubtaskSubmit(task.id)}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              <FaPlus size={12} />
            </button>
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
