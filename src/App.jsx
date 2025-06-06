import { useState, useEffect } from "react"; //importo los hooks
import { Routes, Route } from "react-router-dom"; //importo loshooks de react-router
//importo los componentes
import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import FilterButtons from "./components/FilterButton";
import TaskList from "./components/TaskList";
import Achievements from "./components/Archivements";
//importo las funciones de las subtareas
import {
  subtaskChange,
  addSubtask,
  toggleSubtask,
  getSubtaskProgress,
} from "./utils/subtaskUtils";
import CompletedTasksHistory from "./components/CompletedTasksHistory";
import AchievementsList from "./components/AchievementsList";
//llamo al localStorage
const miStorage = {
  getItem: (key) => localStorage.getItem(key),
  setItem: (key, value) => localStorage.setItem(key, value),
};
import WeeklySummaryPage from "./components/WeeklySummaryPage";
import MateMode from "./components/MateMode";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [subtasks, setSubtasks] = useState({});
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    taskId: null,
    taskTitle: "",
  });
  // Nuevo estado para confirmación de reseteo de logros
  const [resetAchievementsConfirmation, setResetAchievementsConfirmation] =
    useState({
      isOpen: false,
    });
  const [taskHistory, setTaskHistory] = useState([]);
  const [notification, setNotification] = useState(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);

  // detecta si es celular
  useEffect(() => {
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const isReallyMobile = window.innerWidth < 768;
        if (isMobile !== isReallyMobile) {
          setIsMobile(isReallyMobile);
        }
      }, 200);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  useEffect(() => {
    const storedTasks = miStorage.getItem("tasks");
    const storedSubtasks = miStorage.getItem("subtasks");
    const storedHistory = miStorage.getItem("taskHistory");
    const storedAchievements = miStorage.getItem("unlockedAchievements");
    // Cargar logros desbloqueados si existen
    if (storedAchievements) {
      setUnlockedAchievements(JSON.parse(storedAchievements));
    } else {
      // Inicializar con array vacío (sin logros desbloqueados)
      setUnlockedAchievements([]);
    }
    if (storedTasks) {
      const parsedTasks = JSON.parse(storedTasks);
      setTasks(parsedTasks);
      // Inicializa subtareas basado en las tareas cargadas
      if (storedSubtasks) {
        const parsedSubtasks = JSON.parse(storedSubtasks);
        const validSubtasks = {};
        parsedTasks.forEach((task) => {
          if (parsedSubtasks[task.id]) {
            validSubtasks[task.id] = parsedSubtasks[task.id];
          } else {
            validSubtasks[task.id] = {
              input: "",
              list: task.subtasks || [],
            };
          }
        });
        setSubtasks(validSubtasks);
      } else {
        const initialSubtasks = {};
        parsedTasks.forEach((task) => {
          initialSubtasks[task.id] = {
            input: "",
            list: task.subtasks || [],
          };
        });
        setSubtasks(initialSubtasks);
      }
    }
    // Cargar historial si existe
    if (storedHistory) {
      setTaskHistory(JSON.parse(storedHistory));
    }
    setHasLoaded(true);
  }, []);

  // Guarda en localStorage cuando cambian los datos
  useEffect(() => {
    if (hasLoaded) {
      miStorage.setItem("tasks", JSON.stringify(tasks));
      miStorage.setItem("subtasks", JSON.stringify(subtasks));
      miStorage.setItem("taskHistory", JSON.stringify(taskHistory));
      miStorage.setItem(
        "unlockedAchievements",
        JSON.stringify(unlockedAchievements)
      );
    }
  }, [tasks, subtasks, taskHistory, unlockedAchievements, hasLoaded]);

  // Crea la tarea
  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
    if (window.innerWidth < 768) {
      setShowForm(false);
    }
  };

  // Borra la tarea
  const deleteTask = (taskId) => {
    const taskToDelete = tasks.find((task) => task.id === taskId);
    setDeleteConfirmation({
      isOpen: true,
      taskId,
      taskTitle: taskToDelete.title,
    });
  };

  const handleDeleteConfirm = () => {
    setTasks(tasks.filter((task) => task.id !== deleteConfirmation.taskId));
    setDeleteConfirmation({ isOpen: false, taskId: null, taskTitle: "" });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({ isOpen: false, taskId: null, taskTitle: "" });
  };

  // Funciones para resetear logros
  const handleResetAchievements = () => {
    setResetAchievementsConfirmation({ isOpen: true });
  };

  const handleResetAchievementsConfirm = () => {
    setUnlockedAchievements([]);
    setResetAchievementsConfirmation({ isOpen: false });
    showNotification({
      title: "🔄 Logros reseteados",
      message:
        "Todos los logros han sido eliminados. ¡Puedes volver a conseguirlos!",
      icon: "🔄",
    });
  };

  const handleResetAchievementsCancel = () => {
    setResetAchievementsConfirmation({ isOpen: false });
  };

  // Marca la tarea como completado
  const toggleComplete = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : null,
            }
          : task
      )
    );
  };

  const togglePriority = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, priority: "alta" } : task
      )
    );
  };

  // Elimina las completas
  const clearHistory = () => {
    setTaskHistory([]);
  };

  // eliminar todas las tareas
  const clearAllTasks = () => {
    // Mover las tareas completadas al historial
    const completedTasks = tasks.filter((task) => task.completed);
    if (completedTasks.length > 0) {
      setTaskHistory((prev) => [
        ...prev,
        ...completedTasks.map((task) => ({
          ...task,
          movedAt: new Date().toISOString(),
        })),
      ]);
    }
    // Eliminar TODAS las tareas (tanto completadas como pendientes)
    setTasks([]);
    // Opcional: también limpiar las subtareas si es necesario
    setSubtasks({});
  };

  //mueve a la pestaña de historial
  const moveToHistory = (taskId) => {
    const taskToMove = tasks.find((task) => task.id === taskId);
    if (taskToMove) {
      setTaskHistory((prev) => [
        ...prev,
        { ...taskToMove, movedAt: new Date().toISOString() },
      ]);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    }
  };

  // Edita las tareas
  const handleEditTask = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    if (window.innerWidth < 768) {
      setShowForm(false);
    }
    setTaskToEdit(null); // Resetear taskToEdit después de editar
  };

  const filteredTasks = tasks
    .filter((task) => {
      const now = new Date();
      const getTaskDateTime = (t) => {
        if (!t.date) return null;
        const fullTime = t.time || "00:00";
        return new Date(`${t.date}T${fullTime}`);
      };
      const isVencida = () => {
        if (!task.date) return false;
        const taskDate = getTaskDateTime(task);
        return !task.completed && taskDate && now > taskDate;
      };
      const passesPriority =
        !filters.some((f) => ["baja", "media", "alta"].includes(f)) ||
        filters.includes(task.priority);
      const passesVencidas = !filters.includes("vencidas") || isVencida();
      const passesRecientes =
        !filters.includes("recent") ||
        (!task.completed && task.date && getTaskDateTime(task) >= now);
      return passesPriority && passesVencidas && passesRecientes;
    })
    .sort((a, b) => {
      if (filters.includes("recent")) {
        const getTime = (t) =>
          new Date(`${t.date || "2100-01-01"}T${t.time || "00:00"}`);
        return getTime(a) - getTime(b);
      }
      return 0;
    });

  // Alterna entre formulario y lista en el celular
  const toggleFormView = () => {
    setShowForm(!showForm);
  };

  const handleSubtaskChange = (taskId, value) => {
    setSubtasks((prev) => subtaskChange(prev, taskId, value));
  };

  const handleAddSubtask = (taskId) => {
    setSubtasks((prev) => addSubtask(prev, taskId));
  };

  const handleToggleSubtask = (taskId, subtaskId) => {
    setSubtasks((prev) => toggleSubtask(prev, taskId, subtaskId));
  };

  const handleGetSubtaskProgress = (taskId) => {
    return getSubtaskProgress(subtasks, taskId);
  };

  const showNotification = (notification) => {
    setNotification(notification);
    setTimeout(() => setNotification(null), 5000); // Oculta después de 5 segundos
  };

  // Función para manejar logros desbloqueados
  const handleAchievementUnlock = (newUnlockedAchievements) => {
    setUnlockedAchievements(newUnlockedAchievements);
  };

  return (
    <div className="min-h-screen md:p-1 flex flex-col items-start bg-[#edebe6]">
      <Header
        isLoggedIn={isLoggedIn}
        toggleLogin={() => setIsLoggedIn(!isLoggedIn)}
      />
      <Routes>
        <Route
          path="/"
          element={
            <>
              {/* botones de navegacion en celular */}
              <div className="w-full md:hidden flex justify-center my-2">
                <button
                  onClick={() => {
                    setShowForm(true);
                    setTimeout(() => {
                      const titleInput = document.querySelector(
                        'input[name="title"]'
                      );
                      if (titleInput) {
                        titleInput.focus({ preventScroll: true });
                      }
                    }, 100);
                  }}
                  className={`px-4 py-2 mx-1 rounded-lg ${
                    showForm ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                >
                  {taskToEdit ? "Editar tarea" : "Nueva tarea"}
                </button>
                <button
                  onClick={toggleFormView}
                  className={`px-4 py-2 mx-1 rounded-lg ${
                    !showForm ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                >
                  Ver tareas
                </button>
              </div>
              <div className="w-full flex flex-col md:flex-row items-start gap-4 px-2 md:px-3">
                {/* Formulario que aparece y desaparece en el celular */}
                <div
                  className={`w-full md:w-1/3 ${
                    showForm ? "block" : "hidden md:block"
                  }`}
                >
                  <div className="bg-white rounded-xl shadow-lg p-3 md:p-4 border border-gray-200 min-h-[300px] md:h-[500px] overflow-auto">
                    <TaskForm
                      addTask={addTask}
                      taskToEdit={taskToEdit}
                      handleEditTask={handleEditTask}
                      setTaskToEdit={setTaskToEdit}
                      isMobile={isMobile}
                    />
                  </div>
                </div>
                {/* Lista que aparece y desaparece en el celular */}
                <div
                  className={`flex-1 w-full ${
                    !showForm ? "block" : "hidden md:block"
                  }`}
                >
                  <div className="bg-white space-y-2 rounded-xl min-h-[300px] md:h-[500px] shadow-lg p-3 md:p-4 border border-gray-200 overflow-auto">
                    <FilterButtons
                      filters={filters}
                      setFilters={setFilters}
                      isMobile={isMobile}
                    />
                    <TaskList
                      tasks={filteredTasks}
                      deleteTask={deleteTask}
                      toggleComplete={toggleComplete}
                      togglePriority={togglePriority}
                      clearAllTasks={clearAllTasks}
                      setTaskToEdit={setTaskToEdit}
                      isMobile={isMobile}
                      subtasks={subtasks}
                      setSubtasks={setSubtasks}
                      handleSubtaskChange={handleSubtaskChange}
                      handleAddSubtask={handleAddSubtask}
                      toggleSubtask={handleToggleSubtask}
                      getSubtaskProgress={handleGetSubtaskProgress}
                      moveToHistory={moveToHistory}
                    />
                  </div>
                </div>
              </div>
            </>
          }
        />
        <Route
          path="/history"
          element={
            <CompletedTasksHistory
              moveToHistory={moveToHistory}
              history={taskHistory}
              onClearHistory={clearHistory}
            />
          }
        />
        <Route
          path="/achievements"
          element={
            <AchievementsList
              unlockedAchievements={unlockedAchievements}
              onResetAchievements={handleResetAchievements}
            />
          }
        />
        <Route
          path="/weekly-summary"
          element={<WeeklySummaryPage tasks={tasks} />}
        />
        <Route path="/mate-mode" element={<MateMode />} />
        {/* <Route path="/register" element={<RegisterComponent />} /> */}
      </Routes>

      {/* confirmacion de borrado de tareas */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-[rgba(0,_0,_0,_0.600)] flex items-center justify-center z-50">
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
                  ¿Eliminar tarea?
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Estás a punto de eliminar la tarea:{" "}
                    <strong>"{deleteConfirmation.taskTitle}"</strong>. Esta
                    acción no se puede deshacer.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* confirmacion de reseteo de logros */}
      {resetAchievementsConfirmation.isOpen && (
        <div className="fixed inset-0 bg-[rgba(0,_0,_0,_0.600)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-orange-100">
                <svg
                  className="h-6 w-6 text-orange-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  ¿Resetear todos los logros?
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Estás a punto de eliminar{" "}
                    <strong>todos los logros desbloqueados</strong>. Podrás
                    volver a conseguirlos completando las acciones
                    correspondientes. Esta acción no se puede deshacer.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={handleResetAchievementsCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                onClick={handleResetAchievementsConfirm}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Resetear logros
              </button>
            </div>
          </div>
        </div>
      )}

      <Achievements
        tasks={tasks}
        taskHistory={taskHistory}
        showNotification={showNotification}
        unlockedAchievements={unlockedAchievements}
        onAchievementUnlock={handleAchievementUnlock}
      />

      {notification && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 z-50">
          <div className="bg-white rounded-lg shadow-lg border-l-4 border-green-500 p-4 max-w-md mx-auto flex items-start gap-3 animate-fade-in-up">
            <div className="text-2xl mt-1">{notification.icon}</div>
            <div>
              <h3 className="font-bold text-gray-800">{notification.title}</h3>
              <p className="text-sm text-gray-600">{notification.message}</p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="ml-auto text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
