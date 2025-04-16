import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { useState } from "react";

export default function FormularioTarea() {
  const [date, setDate] = useState(null);
  const [opcion, setOpcion] = useState("");

  return (
    <>
      <form class="max-w-sm mx-auto text-center ">
        <h2 class="text-3xl font-bold text-white mb-4">Mis Tareas</h2>
        <div class="task-title">
          <label
            for="text"
            class="block mb-2 text-sm font-medium text-white text-left"
          >
            Titulo de la tarea
          </label>
          <input
            type="text"
            id="text"
            autoComplete="off"
            class="rounded-[20px] bg-[#7f7a7a] [box-shadow:-20px_20px_60px_#6c6868,_20px_-20px_60px_#928c8c] border-[none] p-[15px] pr-[30px] m-[6px] text-white placeholder-gray-400 shadow-inner focus:outline-none focus:ring-2 focus:gray-400 transition text-sm block w-full"
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
            class="rounded-[20px] bg-[#7f7a7a] [box-shadow:-20px_20px_60px_#6c6868,_20px_-20px_60px_#928c8c] border-[none] p-[15px] pr-[30px] m-[6px] text-white placeholder-gray-400 shadow-inner focus:outline-none focus:ring-2 focus:gray-400 transition text-sm focus:border-slate-500 block w-full"
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
            class="rounded-[20px] bg-[#7f7a7a] [box-shadow:-20px_20px_60px_#6c6868,_20px_-20px_60px_#928c8c] border-[none] p-[15px] pr-[30px] m-[6px] text-white placeholder-gray-400  shadow-inner focus:outline-none focus:ring-2 focus:gray-400 transition text-sm block w-full  focus:border-blue-500"
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
            class="rounded-[20px] bg-[#7f7a7a] [box-shadow:-20px_20px_60px_#6c6868,_20px_-20px_60px_#928c8c] border-[none] p-[15px] pr-[30px] m-[6px] text-white placeholder-gray-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-400 transition resize-none block w-full text-sm focus:border-gray-400"
            placeholder="Ej: Llamar al cliente para confirmar la reunión del jueves a las 10:00."
          ></textarea>
        </div>
        <div class="submit-task mt-2">
          <button
            type="submit"
            class="rounded-[20px] bg-[#7f7a7a] [box-shadow:-20px_20px_60px_#6c6868,_20px_-20px_60px_#928c8c] border-[none] p-[15px] pr-[30px] m-[6px] text-white focus:outline-none focus:ring-4 font-medium  text-sm px-5 py-2.5 me-2 mt-2 hover:bg-[#5f5f5f] focus:ring-gray-400"
          >
            Agregar tarea
          </button>
        </div>
      </form>
    </>
  );
}
