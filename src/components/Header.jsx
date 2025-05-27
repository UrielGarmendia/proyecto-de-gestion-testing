import { FaSignOutAlt, FaUser, FaBars, FaTimes } from "react-icons/fa"; // Importamos FaBars y FaTimes
import { Link } from "react-router-dom";
import { useState } from "react"; // Necesitamos useState para el estado del menú

const Header = ({ isLoggedIn }) => {
  // const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para controlar la visibilidad del menú móvil

  // Función para manejar el clic en el botón de autenticación
  // const handleAuthClick = () => {
  //   if (isLoggedIn) {
  //     Si el usuario está logueado, simula el cierre de sesión
  //     toggleLogin(); // Función comentada, no cambia el estado de login por ahora
  //     navigate("/"); // Función comentada, no navega a la página principal por ahora
  //       } else {
  //         // Si el usuario no está logueado, navega a la página de login
  //         navigate("/login");
  //       }
  //       setIsMenuOpen(false); // Cerrar el menú al hacer clic en el botón de autenticación
  //     };

  return (
    <div className="relative flex flex-col md:flex-row items-center md:justify-between w-full mb-4 p-4 bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Grupo del Logo y Título */}
      <div className="flex items-center">
        {/* Nota: La ruta de la imagen 'Icono Planner.png' debe ser válida en tu proyecto */}
        <img
          src="Icono Planner.png"
          alt="Logo de Planner"
          className="inline-block w-10 h-10 mr-2"
        />
        <h1 className="text-2xl font-semibold text-gray-800">Planner</h1>
      </div>

      {/* Botón de menú hamburguesa para móviles (posicionado absolutamente para no interferir con el layout en desktop) */}
      <button
        className="md:hidden absolute top-4 right-4 text-gray-700 text-2xl p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
      >
        {isMenuOpen ? <FaTimes /> : <FaBars />}{" "}
        {/* Cambia el icono según el estado del menú */}
      </button>

      {/* Barra de navegación */}
      <nav
        id="mobile-menu"
        className={`
          ${isMenuOpen ? "flex" : "hidden"} {/* Muestra/oculta el menú */}
          flex-col items-center space-y-4
          absolute top-full left-0 w-full bg-white rounded-b-xl shadow-lg border border-gray-200 py-4 z-10
          md:relative md:flex md:flex-row md:items-center md:space-y-0 md:space-x-8 md:mt-0 md:p-0 md:bg-transparent md:shadow-none md:border-none
        `}
      >
        {/* Enlace a la página principal (lista y formulario) */}
        <Link
          to="/"
          className="text-gray-700 hover:text-[#51cfc9] hover:underline font-semibold transition duration-300 ease-in-out dark:text-gray-200 dark:hover:text-[#51cfc9] py-2 md:py-0"
          onClick={() => setIsMenuOpen(false)} // Cerrar el menú al hacer clic en un enlace
        >
          Inicio
        </Link>
        {/* Enlace al historial de tareas completadas */}
        <Link
          to="/history"
          className="text-gray-700 hover:text-[#51cfc9] hover:underline font-semibold transition duration-300 ease-in-out dark:text-gray-200 dark:hover:text-[#51cfc9] py-2 md:py-0"
          onClick={() => setIsMenuOpen(false)} // Cerrar el menú al hacer clic en un enlace
        >
          Historial
        </Link>
        {/* Botón de Iniciar Sesión / Cerrar Sesión */}
        <button className="bg-[#50b9b5] hover:bg-[#51cfc9] text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#51cfc9] focus:ring-opacity-50 transition duration-300 ease-in-out shadow-md mt-4 md:mt-0">
          {isLoggedIn ? (
            <span key="logout" className="capitalize flex items-center">
              <FaSignOutAlt className="inline mr-2" size={14} />
              Cerrar Sesión
            </span>
          ) : (
            <span key="login" className="capitalize flex items-center">
              <FaUser className="inline mr-2" size={14} />
              Iniciar Sesión
            </span>
          )}
        </button>
      </nav>
    </div>
  );
};

export default Header;
