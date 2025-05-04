import { FaSignOutAlt, FaUser } from "react-icons/fa";

const Header = ({ isLoggedIn, toggleLogin }) => {
  return (
    <div className="flex items-center justify-between w-full mb-4">
      <div className="flex items-center">
        <img
          src="Icono Planner.png"
          alt="Logo de Planner"
          className="inline-block w-10 h-10 mr-2"
        />
        <h1 className="text-2xl font-semibold text-gray-800">Planner</h1>{" "}
      </div>
      <button
        onClick={toggleLogin}
        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-1 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition duration-300 ease-in-out dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 text-sm" /* Ajustado el padding y el tamaño de la fuente */
      >
        {isLoggedIn ? (
          <>
            <FaSignOutAlt className="inline mr-2" size={14} />
            Cerrar Sesión
          </>
        ) : (
          <>
            <FaUser className="inline mr-2" size={14} />
            Iniciar Sesión
          </>
        )}
      </button>
    </div>
  );
};

export default Header;
