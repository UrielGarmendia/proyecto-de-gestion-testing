import { FaSignOutAlt, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";

const Header = ({ isLoggedIn }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between w-full mb-4 p-4 bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Logo y título con botón hamburguesa */}
      <div className="flex items-center w-full md:w-auto justify-between">
        <div className="flex items-center">
          <img
            src="Icono Planner.png"
            alt="Logo de Planner"
            className="inline-block w-10 h-10 mr-2"
          />
          <h1 className="text-2xl font-semibold text-gray-800">Planner</h1>
        </div>

        <button
          className="md:hidden text-gray-700 text-2xl p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Menú de navegación - Centrado en móvil, derecha en desktop */}
      <nav
        id="mobile-menu"
        className={`
          ${isMenuOpen ? "flex" : "hidden"}
          flex-col items-center w-full md:w-auto md:flex md:flex-row md:items-center
          bg-white rounded-b-xl py-4 px-4 md:py-0 md:px-0 md:shadow-none md:border-none space-y-4 md:space-y-0 md:space-x-8 mt-4 md:mt-0
        `}
      >
        <Link
          to="/"
          className="text-gray-700 font-semibold transition duration-300 w-full text-center md:text-left md:w-auto hover:bg-[#50b9b5] hover:text-white py-2 px-4 rounded-lg"
          onClick={() => setIsMenuOpen(false)}
        >
          Inicio
        </Link>

        <Link
          to="/history"
          className="text-gray-700 font-semibold transition duration-300 w-full text-center md:text-left md:w-auto hover:bg-[#50b9b5] hover:text-white py-2 px-4 rounded-lg"
          onClick={() => setIsMenuOpen(false)}
        >
          Historial
        </Link>
        <Link
          to="/achievements"
          className="text-gray-700 font-semibold transition duration-300 w-full text-center md:text-left md:w-auto hover:bg-[#50b9b5] hover:text-white py-2 px-4 rounded-lg"
          onClick={() => setIsMenuOpen(false)}
        >
          Logros
        </Link>

        <Link
          to="/weekly-summary"
          className="text-gray-700 font-semibold transition duration-300 w-full text-center md:text-left md:w-auto hover:bg-[#50b9b5] hover:text-white py-2 px-4 rounded-lg"
          onClick={() => setIsMenuOpen(false)}
        >
          Mi Semana
        </Link>

        <button className="bg-[#50b9b5] hover:bg-[#51cfc9] text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#51cfc9] transition duration-300 w-full md:w-auto mt-2 md:mt-0 text-center">
          {isLoggedIn ? (
            <span className="flex items-center justify-center md:justify-start">
              <FaSignOutAlt className="mr-2" size={14} />
              Cerrar Sesión
            </span>
          ) : (
            <span className="flex items-center justify-center md:justify-start">
              <FaUser className="mr-2" size={14} />
              Iniciar Sesión
            </span>
          )}
        </button>
      </nav>
    </div>
  );
};

export default Header;
