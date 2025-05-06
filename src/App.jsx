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

  // lee de localStorage una sola vez
  useEffect(() => {
    const storedTasks = miStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
    setHasLoaded(true);
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
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "all") return true;

      if (filter === "recent") {
        if (task.completed) return false;
        if (!task.date) return false; // Si no tiene fecha, no puede vencerse

        // Si no hay hora, asumimos 00:00
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

  return (
    <div className="min-h-screen p-3 flex flex-col items-start bg-[#edebe6]">
      <Header
        isLoggedIn={isLoggedIn}
        toggleLogin={() => setIsLoggedIn(!isLoggedIn)}
      />

      <div className="w-full flex flex-col md:flex-row items-start gap-4 px-3 ">
        <div className=" md:w-1/3">
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 h-[500px]">
            <TaskForm
              addTask={addTask}
              taskToEdit={taskToEdit}
              handleEditTask={handleEditTask}
              setTaskToEdit={setTaskToEdit}
            />
          </div>
        </div>
        <div className="flex-1 ">
          <div className="bg-white rounded-xl h-[500px] shadow-lg p-4 border border-gray-200">
            <FilterButtons filter={filter} setFilter={setFilter} />
            <TaskList
              tasks={filteredTasks}
              deleteTask={deleteTask}
              toggleComplete={toggleComplete}
              clearCompletedTasks={clearCompletedTasks}
              setTaskToEdit={setTaskToEdit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
