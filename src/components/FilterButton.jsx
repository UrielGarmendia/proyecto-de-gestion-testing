const FilterButtons = ({ filter, setFilter }) => {
  const filters = [
    { value: "all", label: "Todas" },
    { value: "baja", label: "Baja" },
    { value: "media", label: "Media" },
    { value: "alta", label: "Alta" },
  ];

  return (
    <div className="mb-4">
      <div className="flex space-x-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`filter-btn font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition duration-300 ease-in-out ${
              filter === f.value
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-500 dark:text-white dark:hover:bg-gray-400"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterButtons;
