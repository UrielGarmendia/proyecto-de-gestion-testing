// src/components/AchievementsList.jsx
import { achievementsConfig } from "../utils/achievementsUtils";

const AchievementsList = ({ unlockedAchievements, onResetAchievements }) => {
  const completionPercentage = Math.round(
    (unlockedAchievements.length / achievementsConfig.length) * 100
  );
  return (
    <div className="min-h-screen bg-[#edebe6] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            🏆Logros
          </h1>

          {/* boton de reseteo */}
          {unlockedAchievements.length > 0 && (
            <button
              onClick={onResetAchievements}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Resetear logros
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievementsConfig.map((achievement) => {
            const isUnlocked = unlockedAchievements.includes(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`bg-white rounded-lg shadow-md p-6 border-2 transition-all duration-300 ${
                  isUnlocked
                    ? "border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 transform hover:scale-105"
                    : "border-gray-200 opacity-60 hover:opacity-80"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`text-3xl flex-shrink-0 ${
                      isUnlocked ? "animate-pulse" : ""
                    }`}
                  >
                    {isUnlocked ? "🏆" : "🔒"}
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`font-bold text-lg mb-2 ${
                        isUnlocked ? "text-yellow-800" : "text-gray-500"
                      }`}
                    >
                      {achievement.title}
                    </h3>
                    <p
                      className={`text-sm mb-3 ${
                        isUnlocked ? "text-gray-700" : "text-gray-400"
                      }`}
                    >
                      {achievement.description}
                    </p>
                    {isUnlocked && (
                      <div className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                        <svg
                          className="h-3 w-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        ¡Desbloqueado!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* estadisticas de progreso */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            📊 Progreso
          </h2>
          <div className="grid grid-cols-4 gap-4 items-center">
            <div className="col-span-3">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Logros desbloqueados</span>
                <span>
                  {unlockedAchievements.length} / {achievementsConfig.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${completionPercentage}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-semibold text-yellow-600">
                {completionPercentage}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsList;
