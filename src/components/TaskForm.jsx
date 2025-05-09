import { useEffect, useState } from "react";
import { FaPen, FaPlus } from "react-icons/fa";

const TaskForm = ({ addTask, taskToEdit, handleEditTask, setTaskToEdit }) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("baja");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("General");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
  });

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setPriority(taskToEdit.priority);
      setDate(taskToEdit.date);
      setTime(taskToEdit.time);
      setCategory(taskToEdit.category);
      setDescription(taskToEdit.description);
    } else {
      setTitle("");
      setPriority("baja");
      setDate("");
      setTime("");
      setCategory("General");
      setDescription("");
    }
  }, [taskToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "title") {
      const regex = /^[\w\s.,!?¡¿()áéíóúÁÉÍÓÚñÑ-]*$/;

      setTitle(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: !value.trim()
          ? "Por favor, ingresa una tarea."
          : !regex.test(value) //validacion del titulo
          ? "El título contiene caracteres no permitidos."
          : "",
      }));
    } else if (name === "description") {
      //validacion de la descripcion
      if (value.length <= 100) {
        setDescription(value);
        setErrors((prevErrors) => ({
          ...prevErrors,
          description: "",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          description: "Máximo 100 caracteres.",
        }));
      }
    } else if (name === "date") {
      setDate(value);
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    } else if (name === "time") {
      setTime(value);
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    } else {
      if (name === "priority") setPriority(value);
      if (name === "category") setCategory(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let isValid = true;
    const newErrors = { ...errors };

    //validacion del titulo
    if (!title.trim()) {
      newErrors.title = "Ingresa una tarea";
      isValid = false;
    } else {
      const regex = /^[\w\s.,!?¡¿()áéíóúÁÉÍÓÚñÑ-]*$/;
      if (!regex.test(title)) {
        newErrors.title = "El título contiene caracteres no permitidos.";
        isValid = false;
      }
    }

    // validacion de la fecha y la hora
    const now = new Date();

    if (time && !date) {
      newErrors.date = "Se debe ingresar una fecha también";
      newErrors.time = "La hora sin fecha es inválida";
      isValid = false;
    } else if (date && !time) {
      const selectedDate = new Date(`${date}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.date = "La fecha debe ser de hoy en adelante";
        isValid = false;
      } else {
        newErrors.date = "";
        newErrors.time = "";
      }
    } else if (date && time) {
      const selectedDateTime = new Date(`${date}T${time}`);

      if (selectedDateTime <= now) {
        newErrors.date = "La fecha y hora deben ser futuras.";
        newErrors.time = "La fecha y hora deben ser futuras.";
        isValid = false;
      } else {
        newErrors.date = "";
        newErrors.time = "";
      }
    } else {
      newErrors.date = "";
      newErrors.time = "";
    }

    setErrors(newErrors);

    if (!isValid) {
      return;
    }

    const newTask = {
      id: taskToEdit ? taskToEdit.id : Date.now(),
      title: title,
      priority,
      date,
      time,
      category,
      description,
      completed: taskToEdit ? taskToEdit.completed : false,
      subtasks: taskToEdit ? taskToEdit.subtasks : [],
    };

    if (taskToEdit) {
      handleEditTask(newTask);
      setTaskToEdit(null);
    } else {
      addTask(newTask);
    }

    if (!taskToEdit) {
      setTitle("");
      setPriority("baja");
      setDate("");
      setTime("");
      setCategory("General");
      setDescription("");
    }

    if (taskToEdit) {
      setTaskToEdit(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="w-full">
        <input
          type="text"
          name="title"
          value={title}
          onChange={handleInputChange}
          onFocus={(e) => {
            // Previene el cierre automático
            e.preventDefault();
            e.stopPropagation();

            // Enfoca correctamente el input
            setTimeout(() => {
              e.target.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
              });
            }, 300);
          }}
          onClick={(e) => e.stopPropagation()}
          placeholder="Añade una nueva tarea..."
          className={`w-full p-3 rounded-lg border ${
            errors.title ? "border-red-500" : "border-gray-300"
          } focus:ring-2 focus:ring-blue-300 focus:border-blue-300 text-gray-800 text-sm`}
        />
        {errors.title && (
          <p className="text-red-500 text-xs italic">{errors.title}</p>
        )}
      </div>
      <select
        value={priority}
        onChange={handleInputChange}
        name="priority"
        className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 text-gray-800 text-sm"
      >
        <option value="baja">Prioridad Baja</option>
        <option value="media">Prioridad Media</option>
        <option value="alta">Prioridad Alta</option>
      </select>
      <div className="flex space-x-2 w-full">
        <div className="w-1/2">
          <input
            type="date"
            name="date"
            value={date}
            onChange={handleInputChange}
            className={`w-full p-2 rounded-lg border ${
              errors.date ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-blue-300 focus:border-blue-300 text-gray-800 text-sm`}
          />
          {errors.date && (
            <p className="text-red-500 text-xs italic mt-1">{errors.date}</p>
          )}
        </div>
        <div className="w-1/2">
          <input
            type="time"
            name="time"
            value={time}
            onChange={handleInputChange}
            className={`w-full p-2 rounded-lg border ${
              errors.time ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-blue-300 focus:border-blue-300 text-gray-800 text-sm`}
          />
          {errors.time && (
            <p className="text-red-500 text-xs italic mt-1">{errors.time}</p>
          )}
        </div>
      </div>
      <select
        value={category}
        onChange={handleInputChange}
        name="category"
        className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 text-gray-800 text-sm"
      >
        <option value="General">General</option>
        <option value="Trabajo">Trabajo</option>
        <option value="Personal">Personal</option>
        <option value="Hogar">Hogar</option>
        <option value="Otros">Otros</option>
      </select>
      <textarea
        value={description}
        onChange={handleInputChange}
        name="description"
        placeholder="Añade una descripción a la tarea..."
        className="resize-none w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 text-gray-800 text-sm"
        rows="3"
      ></textarea>
      {errors.description && (
        <p className="text-red-500 text-xs italic mt-1">{errors.description}</p>
      )}
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
