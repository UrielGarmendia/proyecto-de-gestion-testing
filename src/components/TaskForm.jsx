import { useEffect, useState } from "react";
import { FaPen, FaPlus } from "react-icons/fa";

const TaskForm = ({ addTask, taskToEdit, handleEditTask, setTaskToEdit }) => {
  const [taskText, setTaskText] = useState("");
  const [priority, setPriority] = useState("baja");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("general");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (taskToEdit) {
      setTaskText(taskToEdit.text);
      setPriority(taskToEdit.priority);
      setDate(taskToEdit.date);
      setTime(taskToEdit.time);
      setCategory(taskToEdit.category);
      setNotes(taskToEdit.notes);
    } else {
      setTaskText("");
      setPriority("baja");
      setDate("");
      setTime("");
      setCategory("general");
      setNotes("");
    }
  }, [taskToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!taskText.trim()) {
      alert("Por favor, ingresa una tarea.");
      return;
    }

    const newTask = {
      id: taskToEdit ? taskToEdit.id : Date.now(),
      text: taskText,
      priority,
      date,
      time,
      category,
      notes,
      completed: taskToEdit ? taskToEdit.completed : false,
      subtasks: taskToEdit ? taskToEdit.subtasks : [],
    };

    //me verifica si el formulario se usa para crear o editar
    if (taskToEdit) {
      handleEditTask(newTask);
      setTaskToEdit(null); // ahora sí, bien puesto
    } else {
      addTask(newTask);
    }

    // verifica que no este editando y resetea el formulario
    if (!taskToEdit) {
      setTaskText("");
      setPriority("baja");
      setDate("");
      setTime("");
      setCategory("general");
      setNotes("");
    }

    if (taskToEdit) {
      setTaskToEdit(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-4">
      <input
        type="text"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        placeholder="Añade una nueva tarea..."
        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 text-gray-800 text-sm"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 text-gray-800 text-sm"
      >
        <option value="baja">Prioridad Baja</option>
        <option value="media">Prioridad Media</option>
        <option value="alta">Prioridad Alta</option>
      </select>
      <div className="flex space-x-2 w-full">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-1/2 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 text-gray-800 text-sm"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-1/2 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 text-gray-800 text-sm"
        />
      </div>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 text-gray-800 text-sm"
      >
        <option value="general">General</option>
        <option value="trabajo">Trabajo</option>
        <option value="personal">Personal</option>
        <option value="hogar">Hogar</option>
        <option value="otros">Otros</option>
      </select>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Añade notas a la tarea..."
        className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 text-gray-800 text-sm"
        rows="3"
      ></textarea>
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 text-sm"
      >
        {taskToEdit ? (
          <span key="save" className="capitalize">
            <FaPen className="inline mr-2" /> Guardar tarea
          </span>
        ) : (
          <span key="new" className="capitalize">
            <FaPlus className="inline mr-2" /> Añadir Tarea
          </span>
        )}
      </button>
    </form>
  );
};

export default TaskForm;
