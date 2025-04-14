import "./App.css";
import FormularioTarea from "./components/FormularioTarea";

export default function App() {
  return (
    <>
      <div>
        <h1 bg-green-500 text-white p-4>
          Mis tareas
        </h1>
        <FormularioTarea />
      </div>
    </>
  );
}
