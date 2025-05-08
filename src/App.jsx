import { useEffect, useState } from "react";
import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import FilterButtons from "./components/FilterButton";
import TaskList from "./components/TaskList";

let miStorage = window.localStorage;

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showForm, setShowForm] = useState(true); // controla la visibilidad del formulario en el celu

  // detecta si es celular
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setShowForm(false);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // lee de localStorage una sola vez
  useEffect(() => {
    const storedTasks = miStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
    setHasLoaded(true);

    // Listener para ajustar la interfaz cuando cambia el tamaño de pantalla
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowForm(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // guarda en localStorage despues de cargar
  useEffect(() => {
    if (hasLoaded) {
      miStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, hasLoaded]);

  //crea la tarea
  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
    // En móvil, mostrar la lista después de agregar una tarea
    if (window.innerWidth < 768) {
      setShowForm(false);
    }
  };

  //borra la tarea
  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  //marca la tarea como completado
  const toggleComplete = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  //elimina las completas
  const clearCompletedTasks = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  //edita las tareas
  const handleEditTask = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    // en el celu vuelve a la lista despues de editarla
    if (window.innerWidth < 768) {
      setShowForm(false);
    }
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "all") return true;
      if (filter === "recent") {
        if (task.completed) return false;
        if (!task.date) return false; // si no hay fecha no se vence
        // se establece como 00:00 si no hay hora
        const fullTime = task.time ? task.time : "00:00";
        const taskDateTime = new Date(`${task.date}T${fullTime}`);
        const now = new Date();
        return taskDateTime >= now;
      }
      return task.priority === filter;
    })
    .sort((a, b) => {
      if (filter === "recent") {
        const timeA = a.time ? a.time : "00:00";
        const timeB = b.time ? b.time : "00:00";
        const dateA = new Date(`${a.date}T${timeA}`);
        const dateB = new Date(`${b.date}T${timeB}`);
        return dateA - dateB;
      }
      return 0;
    });

  // alterna entre formulario y lista en el celu
  const toggleFormView = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="min-h-screen p-2 md:p-3 flex flex-col items-start bg-[#edebe6]">
      <Header
        isLoggedIn={isLoggedIn}
        toggleLogin={() => setIsLoggedIn(!isLoggedIn)}
      />

      {/* botones de navgecion en celu */}
      <div className="w-full md:hidden flex justify-center my-2">
        <button
          onClick={toggleFormView}
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
        {/* form que aparece y desaparece en el celu */}
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

        {/* lista que aparece y desaparece en el celu */}
        <div
          className={`flex-1 w-full ${!showForm ? "block" : "hidden md:block"}`}
        >
          <div className="bg-white rounded-xl min-h-[300px] md:h-[500px] shadow-lg p-3 md:p-4 border border-gray-200 overflow-auto">
            <FilterButtons
              filter={filter}
              setFilter={setFilter}
              isMobile={isMobile}
            />
            <TaskList
              tasks={filteredTasks}
              deleteTask={deleteTask}
              toggleComplete={toggleComplete}
              clearCompletedTasks={clearCompletedTasks}
              setTaskToEdit={(task) => {
                setTaskToEdit(task);
                // En móvil, mostrar el formulario al editar
                if (window.innerWidth < 768) {
                  setShowForm(true);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
