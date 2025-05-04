import { useState } from "react";
import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import FilterButtons from "./components/FilterButton";
import TaskList from "./components/TaskList";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const addTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const toggleComplete = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const clearCompletedTasks = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

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
            <TaskForm addTask={addTask} />
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
