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
  handleSubtaskSubmit,
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
              {handleUpperFirstLetter(task.title)}
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
          {" "}
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              task.completed
                ? "bg-green-100 text-green-800"
                : isOverdue(task)
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {" "}
            {task.completed
              ? "Completada"
              : isOverdue(task)
              ? "Vencida"
              : "Pendiente"}{" "}
          </span>{" "}
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
                    value={subtaskInputs[task.id] || ""}
                    onChange={(e) =>
                      handleSubtaskChange(task.id, e.target.value)
                    }
                    placeholder="Escribe una subtarea..."
                    className="flex-1 p-1 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <button
                    onClick={() => handleSubtaskSubmit(task.id)}
                    className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-2 rounded-lg text-xs"
                  >
                    <FaPlus size={10} /> Agregar
                  </button>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-1 text-sm">
                  Subtareas:
                </h4>
                <ul className="list-disc pl-5 text-xs text-gray-600">
                  <li className="mb-1">Subtarea de ejemplo</li>
                </ul>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default TableTask;
