import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { useState } from "react";

export default function FormularioTarea() {
  const [date, setDate] = useState(null);
  const [opcion, setOpcion] = useState("");

  return (
    <>
      <form class="max-w-sm mx-auto text-center bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_8px_16px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition">
        <div class="task-title">
          <label
            for="email"
            class="block mb-2 text-sm font-medium text-white text-left"
          >
            Titulo de la tarea
          </label>
          <input
            type="email"
            id="email"
            autoComplete="off"
            class="bg-zinc-800 text-white placeholder-gray-400 rounded-lg p-3 shadow-inner focus:outline-none focus:ring-2 focus:gray-400 transition text-sm block w-full border-gray-600"
            placeholder="Ej: Llamar cliente"
          />
        </div>
        <div class="task-date-limit max-w-sm mt-2">
          <label
            htmlFor="datepicker"
            class="block mb-2 text-sm font-medium text-white text-left"
          >
            Seleccionar fecha límite
          </label>
          <Flatpickr
            id="datepicker"
            options={{
              dateFormat: "d/m/Y",
            }}
            class="bg-zinc-800 text-white placeholder-gray-400 rounded-lg p-3 shadow-inner focus:outline-none focus:ring-2 focus:gray-400 transition border-gray-600 text-sm focus:border-blue-500 block w-full"
            value={date}
            onChange={([selectedDate]) => setDate(selectedDate)}
          />
          {console.log(date)}
        </div>
        <div class="task-priority mt-2">
          <label
            for="priority"
            class="block mb-2 text-sm font-medium text-white text-left"
          >
            Seleccioná la prioridad
          </label>
          <select
            id="priority"
            class="bg-zinc-800 text-white placeholder-gray-400 rounded-lg p-3 shadow-inner focus:outline-none focus:ring-2 focus:gray-400 transition text-sm block w-full border-gray-600 focus:border-blue-500"
            value={opcion}
            onChange={(e) => setOpcion(e.target.value)}
          >
            <option value="" disabled hidden></option>
            <option>Muy alta</option>
            <option>Alta</option>
            <option>Media</option>
            <option>Baja</option>
          </select>
        </div>
        <div class="task-description mt-2">
          <label
            for="description"
            class="block mb-2 text-sm font-medium text-white text-left"
          >
            Descrpción de la tarea
          </label>
          <textarea
            id="description"
            rows="5"
            class="bg-zinc-800 text-white placeholder-gray-400 rounded-lg p-3 shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-400 transition resize-none block w-full text-sm border-gray-600 focus:border-gray-400"
            placeholder="Ej: Llamar al cliente para confirmar la reunión del jueves a las 10:00."
          ></textarea>
        </div>
        <div class="submit-task mt-2">
          <button
            type="submit"
            class="text-white focus:outline-none focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mt-2 bg-zinc-800 hover:bg-gray-700 focus:ring-gray-400 border-gray-700"
          >
            Agregar tarea
          </button>
        </div>
      </form>
    </>
  );
}
