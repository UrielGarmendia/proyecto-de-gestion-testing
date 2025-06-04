import { Link } from "react-router-dom";
import { useState } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiCalendar,
  FiClock,
  FiGrid,
  FiList,
} from "react-icons/fi";

const WeeklySummaryPage = ({ tasks }) => {
  const [expandedDays, setExpandedDays] = useState({});
  const [viewMode, setViewMode] = useState("grid");

  // Días ordenados de Lunes (0) a Domingo (6)
  const daysOfWeek = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const toggleDayExpansion = (day) => {
    setExpandedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const expandAllDays = () => {
    const allExpanded = {};
    daysOfWeek.forEach((day) => {
      allExpanded[day] = true;
    });
    setExpandedDays(allExpanded);
  };

  const collapseAllDays = () => {
    setExpandedDays({});
  };

  const groupTasksByDay = () => {
    const tasksByDay = daysOfWeek.reduce((acc, day) => {
      acc[day] = [];
      return acc;
    }, {});

    const datedTasks = tasks.filter((task) => task.date && !task.completed);

    datedTasks.forEach((task) => {
      const taskDate = new Date(task.date);
      // Corrección clave: Ajuste para que Lunes sea 0 y Domingo 6
      const dayIndex = (taskDate.getDay() + 6) % 7;
      const dayName = daysOfWeek[dayIndex];

      tasksByDay[dayName].push({
        ...task,
        // Ordenamos por hora si existe
        sortKey: task.time || "23:59",
      });
    });

    // Ordenar tareas por hora dentro de cada día
    daysOfWeek.forEach((day) => {
      tasksByDay[day].sort((a, b) => a.sortKey.localeCompare(b.sortKey));
    });

    return tasksByDay;
  };

  const tasksByDay = groupTasksByDay();

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "short" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "alta":
        return "bg-red-100 text-red-800 border-red-300";
      case "media":
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
          {/* Controles superiores */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Resumen Semanal
              </h1>
            </div>

            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
              <button
                onClick={expandAllDays}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
              >
                <FiChevronDown size={14} /> Expandir todo
              </button>
              <button
                onClick={collapseAllDays}
                className="px-3 py-1.5 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition"
              >
                Colapsar todo
              </button>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    viewMode === "grid" ? "bg-white shadow-sm" : "text-gray-500"
                  }`}
                >
                  Cuadrícula
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    viewMode === "list" ? "bg-white shadow-sm" : "text-gray-500"
                  }`}
                >
                  Lista
                </button>
              </div>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition"
                >
                  {/* Encabezado del día */}
                  <button
                    onClick={() => toggleDayExpansion(day)}
                    className={`w-full p-3 flex justify-between items-center ${
                      expandedDays[day]
                        ? "bg-gray-50 text-blue-600"
                        : "bg-white"
                    }`}
                  >
                    <span className="font-semibold">{day}</span>
                    <span className="flex items-center gap-2">
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                        {tasksByDay[day]?.length || 0}
                      </span>
                      {expandedDays[day] ? (
                        <FiChevronUp size={16} />
                      ) : (
                        <FiChevronDown size={16} />
                      )}
                    </span>
                  </button>

                  {/* Tareas */}
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      expandedDays[day] ? "max-h-[1000px]" : "max-h-0"
                    }`}
                  >
                    <div className="p-2 space-y-2">
                      {tasksByDay[day]?.length > 0 ? (
                        tasksByDay[day].map((task) => (
                          <div
                            key={task.id}
                            className={`p-3 rounded-lg border ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            <h3 className="font-medium line-clamp-2">
                              {task.title}
                            </h3>
                            <div className="flex items-center text-xs text-gray-500 mt-2 gap-2">
                              <FiCalendar size={12} />
                              <span>{formatDate(task.date)}</span>
                              {task.time && (
                                <>
                                  <FiClock size={12} />
                                  <span>{task.time}</span>
                                </>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-center text-sm text-gray-400">
                          Sin tareas
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="border border-gray-200 rounded-xl overflow-hidden bg-white"
                >
                  <button
                    onClick={() => toggleDayExpansion(day)}
                    className={`w-full p-4 text-left font-semibold flex justify-between items-center ${
                      expandedDays[day]
                        ? "bg-gray-50 text-blue-600"
                        : "bg-white text-gray-700"
                    } hover:bg-gray-50 transition`}
                  >
                    <span>{day}</span>
                    <span className="flex items-center text-gray-400">
                      {expandedDays[day] ? <FiChevronUp /> : <FiChevronDown />}
                      <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                        {tasksByDay[day]?.length || 0} tareas
                      </span>
                    </span>
                  </button>

                  <div
                    className={`transition-all duration-300 ${
                      expandedDays[day] ? "max-h-[1000px]" : "max-h-0"
                    }`}
                  >
                    <div className="divide-y divide-gray-100">
                      {tasksByDay[day]?.length > 0 ? (
                        tasksByDay[day].map((task) => (
                          <div
                            key={task.id}
                            className={`p-4 ${getPriorityColor(task.priority)}`}
                          >
                            <div className="flex justify-between">
                              <h3
                                className="font-semibold text-sm md:text-base text-gray-800 line-clamp-2"
                                title={task.title}
                              >
                                {task.title}
                              </h3>

                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  task.priority === "alta"
                                    ? "bg-red-200 text-red-800"
                                    : task.priority === "media"
                                    ? "bg-amber-200 text-amber-800"
                                    : "bg-gray-200 text-gray-800"
                                }`}
                              >
                                {task.priority || "baja"}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <FiCalendar size={12} />
                                {formatDate(task.date)}
                              </span>
                              {task.time && (
                                <span className="flex items-center gap-1">
                                  <FiClock size={12} />
                                  {task.time}
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-sm text-gray-400">
                          No hay tareas programadas para este día
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklySummaryPage;
