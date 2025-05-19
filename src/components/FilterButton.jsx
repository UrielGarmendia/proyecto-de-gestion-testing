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

  return (
    <>
      {isMobile ? (
        <select
          value={filters}
          onChange={(e) =>
            setFilters(Array.from(e.target.selectedOptions, (opt) => opt.value))
          }
          className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 text-gray-800 text-sm"
        >
          {allFilters.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
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
