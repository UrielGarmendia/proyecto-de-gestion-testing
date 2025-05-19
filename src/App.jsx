import { useEffect, useState } from "react";
import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import FilterButtons from "./components/FilterButton";
import TaskList from "./components/TaskList";

let miStorage = window.localStorage;

function App() {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null); // Estado para la tarea a editar
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showForm, setShowForm] = useState(true); // controla la visibilidad del formulario en el celu

  // Detecta si es celular
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

  // Lee de localStorage una sola vez
  useEffect(() => {
    const storedTasks = miStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
    setHasLoaded(true);
  }, []);

  // Guarda en localStorage después de cargar
  useEffect(() => {
    if (hasLoaded) {
      miStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, hasLoaded]);

  // Crea la tarea
  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
    if (window.innerWidth < 768) {
      setShowForm(false);
    }
  };

  // Borra la tarea
  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  // Marca la tarea como completado
  const toggleComplete = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Elimina las completas
  const clearCompletedTasks = () => {
    setTasks(tasks.filter((task) => !task.completed));
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

  return (
    <div className="min-h-screen p-2 md:p-3 flex flex-col items-start bg-[#edebe6]">
      <Header
        isLoggedIn={isLoggedIn}
        toggleLogin={() => setIsLoggedIn(!isLoggedIn)}
      />

      {/* Botones de navegación en celular */}
      <div className="w-full md:hidden flex justify-center my-2">
        <button
          onClick={() => {
            setShowForm(true);
            setTimeout(() => {
              const titleInput = document.querySelector('input[name="title"]');
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
          className={`flex-1 w-full ${!showForm ? "block" : "hidden md:block"}`}
        >
          <div className="bg-white rounded-xl min-h-[300px] md:h-[500px] shadow-lg p-3 md:p-4 border border-gray-200 overflow-auto">
            <FilterButtons
              filters={filters}
              setFilters={setFilters}
              isMobile={isMobile}
            />

            <TaskList
              tasks={filteredTasks}
              deleteTask={deleteTask}
              toggleComplete={toggleComplete}
              clearCompletedTasks={clearCompletedTasks}
              setTaskToEdit={setTaskToEdit}
              isMobile={isMobile}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
