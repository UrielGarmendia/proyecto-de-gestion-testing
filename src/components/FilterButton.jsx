import Select from "react-select";
// import { useState } from 'react';

const FilterButtons = ({ filters, setFilters, isMobile }) => {
  const allFilters = [
    { value: "baja", label: "Baja" },
    { value: "media", label: "Media" },
    { value: "alta", label: "Alta" },
    { value: "vencidas", label: "Vencidas" },
    { value: "recent", label: "Más reciente" },
  ];

  const toggleFilter = (value) => {
    setFilters((prev) =>
      prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]
    );
  };

  const clearFilters = () => {
    setFilters([]);
  };

  // Estilos personalizados para react-select
  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "white",
      borderColor: "#d1d5db",
      borderRadius: "0.5rem",
      padding: "0.25rem",
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      "&:hover": {
        borderColor: "#d1d5db",
      },
      "&:focus-within": {
        borderColor: "#93c5fd",
        boxShadow: "0 0 0 2px #bfdbfe",
      },
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#3b82f6",
      color: "white",
      borderRadius: "9999px",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "white",
      fontWeight: "600",
      padding: "0.125rem 0.375rem",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "white",
      ":hover": {
        backgroundColor: "#2563eb",
      },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "0.5rem",
      marginTop: "0.25rem",
      boxShadow:
        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    }),
    option: (base, { isSelected }) => ({
      ...base,
      backgroundColor: isSelected ? "#3b82f6" : "white",
      color: isSelected ? "white" : "#1f2937",
      ":hover": {
        backgroundColor: isSelected ? "#2563eb" : "#f3f4f6",
      },
      ":active": {
        backgroundColor: "#3b82f6",
      },
    }),
  };

  return (
    <>
      {isMobile ? (
        <div className="w-full">
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
              className="mt-2 px-4 py-2 w-full rounded-full bg-blue-500 text-white shadow-md hover:bg-blue-600 transition duration-300 ease-in-out text-sm font-semibold"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="mb-4 flex flex-wrap gap-2">
          {allFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => toggleFilter(f.value)}
              className={`px-4 py-2 rounded-full shadow-md transition duration-300 ease-in-out text-sm font-semibold
                ${
                  filters.includes(f.value)
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-gray-200 hover:bg-blue-600 text-gray-700 dark:bg-gray-500 dark:text-white dark:hover:bg-gray-400"
                }
              `}
            >
              {f.label}
            </button>
          ))}
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-full bg-blue-500 text-white shadow-md hover:bg-blue-600 transition duration-300 ease-in-out text-sm font-semibold"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </>
  );
};

export default FilterButtons;
