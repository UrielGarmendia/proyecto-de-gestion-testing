import Select from "react-select";
import {
  FaArrowUp,
  FaClock,
  FaTrashAlt,
  FaCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const FilterButtons = ({ filters, setFilters, isMobile }) => {
  const allFilters = [
    {
      value: "baja",
      label: "Baja",
      color: "bg-green-100 text-green-800 hover:bg-green-200",
      icon: <FaCircle className="h-4 w-4" />,
    },
    {
      value: "media",
      label: "Media",
      color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      icon: <FaExclamationCircle className="h-4 w-4" />,
    },
    {
      value: "alta",
      label: "Alta",
      color: "bg-red-100 text-red-800 hover:bg-red-200",
      icon: <FaExclamationTriangle className="h-4 w-4" />,
    },
    {
      value: "vencidas",
      label: "Vencidas",
      color: "bg-purple-100 text-purple-800 hover:bg-purple-200",
      icon: <FaClock className="h-4 w-4" />,
    },
    {
      value: "recent",
      label: "Más reciente",
      color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      icon: <FaArrowUp className="h-4 w-4" />,
    },
  ];

  const toggleFilter = (value) => {
    setFilters((prev) =>
      prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]
    );
  };

  const clearFilters = () => {
    setFilters([]);
  };

  // Estilos personalizados para el select
  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "white",
      borderColor: "#e5e7eb",
      borderRadius: "0.75rem",
      padding: "0.375rem",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      minHeight: "44px",
      "&:hover": {
        borderColor: "#d1d5db",
      },
      "&:focus-within": {
        borderColor: "#93c5fd",
        boxShadow: "0 0 0 3px rgba(147, 197, 253, 0.5)",
      },
    }),
    multiValue: (base, { data }) => ({
      ...base,
      backgroundColor: data.color.split(" ")[0],
      color: data.color.split(" ")[1],
      borderRadius: "9999px",
      padding: "0.125rem 0.5rem",
    }),
    multiValueLabel: (base, { data }) => ({
      ...base,
      color: data.color.split(" ")[1],
      fontWeight: "500",
      fontSize: "0.875rem",
    }),
    multiValueRemove: (base, { data }) => ({
      ...base,
      color: data.color.split(" ")[1],
      ":hover": {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
      },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "0.75rem",
      marginTop: "0.5rem",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 50,
    }),
    option: (base, { isSelected, isFocused, data }) => ({
      ...base,
      backgroundColor: isSelected
        ? data.color.split(" ")[0]
        : isFocused
        ? `${data.color.split(" ")[0]}50`
        : "white",
      color: isSelected ? data.color.split(" ")[1] : data.color.split(" ")[1],
      ":active": {
        backgroundColor: data.color.split(" ")[0],
      },
      fontSize: "0.875rem",
      borderRadius: "0.5rem",
      margin: "0.25rem",
      width: "calc(100% - 0.5rem)",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9ca3af",
      fontSize: "0.875rem",
    }),
  };

  return (
    <>
      {isMobile ? (
        <div className="w-full space-y-3 ">
          <Select
            isMulti
            options={allFilters}
            value={allFilters.filter((f) => filters.includes(f.value))}
            onChange={(selected) =>
              setFilters(selected.map((option) => option.value))
            }
            styles={customStyles}
            className="text-sm"
            placeholder="Seleccionar filtros..."
            noOptionsMessage={() => "No hay más opciones"}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
            }}
            classNamePrefix="select"
          />
          {filters.length > 0 && (
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200 text-sm font-medium flex items-center justify-center gap-2"
            >
              <FaTrashAlt className="h-4 w-4" />
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          {allFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => toggleFilter(f.value)}
              className={`px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium flex items-center gap-2
                ${
                  filters.includes(f.value)
                    ? `${f.color.replace(
                        "hover:",
                        ""
                      )} shadow-inner border border-current`
                    : `${f.color} hover:shadow-md border border-transparent`
                }
              `}
            >
              <span
                className={`${
                  filters.includes(f.value) ? "opacity-100" : "opacity-70"
                }`}
              >
                {f.icon}
              </span>
              {f.label}
            </button>
          ))}
          {filters.length > 0 && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200 text-sm font-medium flex items-center gap-2"
            >
              <FaTrashAlt className="h-4 w-4" />
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default FilterButtons;
