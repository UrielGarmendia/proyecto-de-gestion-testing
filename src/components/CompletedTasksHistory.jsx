import { FaHistory, FaTrash, FaCheckCircle } from "react-icons/fa";
import { useState } from "react";

const CompletedTasksHistory = ({ history, onClearHistory }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "alta":
        return "bg-red-100 text-red-800";
      case "media":
        return "bg-yellow-100 text-yellow-800";
      case "baja":
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const handleUpperFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <FaHistory className="text-2xl text-blue-500" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Historial de Tareas
          </h2>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
          >
            <FaTrash className="text-sm" />
            <span className="text-sm font-medium">Limpiar historial</span>
          </button>
        )}
      </div>

      {/* Contenido - Vista móvil (Cards) */}
      <div className="md:hidden space-y-3">
        {history.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-lg">
              No hay tareas en el historial
            </p>
          </div>
        ) : (
          history.map((task) => (
            <div
              key={`${task.id}-${task.movedAt}`}
              className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden transition-all hover:shadow-md"
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800 flex items-center gap-2">
                      <FaCheckCircle className="text-green-500" />
                      {task.title || "Tarea sin título"}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {task.category || "Sin categoría"}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(task.completedAt || task.movedAt)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {task.priority && (
                    <span
                      className={`${getPriorityColor(
                        task.priority
                      )} text-xs font-medium px-2 py-1 rounded-full`}
                    >
                      {handleUpperFirstLetter(task.priority)}
                    </span>
                  )}
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Completada
                  </span>
                </div>

                {task.description && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600">{task.description}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Contenido - Vista desktop (Tabla) */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {history.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-lg">
              No hay tareas en el historial
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Tarea
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Categoría
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Prioridad
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Estado
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Completada
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {history.map((task) => (
                  <tr
                    key={`${task.id}-${task.movedAt}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <FaCheckCircle className="text-green-500" />
                        <span className="font-medium text-gray-800">
                          {task.title || "Tarea sin título"}
                        </span>
                      </div>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {task.description}
                        </p>
                      )}
                    </td>
                    <td className="p-4 text-gray-600">
                      {task.category || "Sin categoría"}
                    </td>
                    <td className="p-4">
                      {task.priority && (
                        <span
                          className={`${getPriorityColor(
                            task.priority
                          )} text-xs font-medium px-3 py-1 rounded-full`}
                        >
                          {handleUpperFirstLetter(task.priority)}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        Completada
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {formatDate(task.completedAt || task.movedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de confirmación */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  ¿Borrar historial?
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Estás a punto de eliminar {history.length} tareas del
                    historial. Esta acción no se puede deshacer.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onClearHistory();
                  setShowConfirm(false);
                }}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedTasksHistory;
