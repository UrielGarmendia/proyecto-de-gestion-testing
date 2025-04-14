export default function FormularioTarea() {
  return (
    <>
      <form action="">
        <input type="text" placeholder="Ingrese una tarea" />
        <input type="date" name="fecha" id="fecha" />
        <select name="Prioridad" id="">
          <option value="Muy alta">Muy alta</option>
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>
        <button>Agregar</button>
      </form>
    </>
  );
}
