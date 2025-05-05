import { useEffect, useState } from "react";
import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import FilterButtons from "./components/FilterButton";
import TaskList from "./components/TaskList";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // //lee las tareas al abrir
  // useEffect(() => {
  //   const storedTasks = localStorage.getItem("tasks");
  //   if (storedTasks) {
  //     setTasks(JSON.parse(storedTasks));
  //   }
  // }, []);
  // localStorage.setItem("prueba", "funciona");
  // localStorage.getItem("prueba");

  // //guarda las tareas
  // useEffect(() => {
  //   console.log(JSON.stringify(tasks));

  //   localStorage.setItem("tasks", JSON.stringify(tasks));
  //   console.log("Guardando en localStorage:", tasks);
  // }, [tasks]);

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

  //filtra las tareas
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.priority === filter;
  });

  return (
    <div className="min-h-screen p-2 flex flex-col items-start bg-[#edebe6]">
      <Header
        isLoggedIn={isLoggedIn}
        toggleLogin={() => setIsLoggedIn(!isLoggedIn)}
      />

      <div className="w-full flex flex-col md:flex-row items-start gap-4 px-4">
        <div className=" md:w-1/3 ">
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 ">
            <TaskForm
              addTask={addTask}
              taskToEdit={taskToEdit}
              handleEditTask={handleEditTask}
              setTaskToEdit={setTaskToEdit}
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
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
