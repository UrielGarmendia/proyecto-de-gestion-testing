import { useEffect, useRef, useState } from "react";

// Íconos SVG como componentes
const PlayIcon = ({ className = "" }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const PauseIcon = ({ className = "" }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="6" y="4" width="4" height="16"></rect>
    <rect x="14" y="4" width="4" height="16"></rect>
  </svg>
);

const Volume2Icon = ({ className = "" }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
  </svg>
);

const VolumeXIcon = ({ className = "" }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <line x1="23" y1="9" x2="17" y2="15"></line>
    <line x1="17" y1="9" x2="23" y2="15"></line>
  </svg>
);

const RotateCcwIcon = ({ className = "" }) => (
  <svg
    className={className}
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="1 4 1 10 7 10"></polyline>
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
  </svg>
);

const MateIcon = ({ className = "" }) => (
  <img
    className={className}
    src="https://img.icons8.com/plasticine/100/mate.png"
    alt="mate"
  />
);

export default function MateMode() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioReady, setAudioReady] = useState(false);

  // Estados para estadísticas del mate
  const [mateCount, setMateCount] = useState(0);
  const [termosCount, setTermosCount] = useState(0);
  const [mateTimer, setMateTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Timer del mate
  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        setMateTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  // Configurar eventos del audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Configurar la fuente del audio
    audio.src = "/audio/cancion-1.mp3";

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setAudioReady(true);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      audio.currentTime = 0;
      setIsPlaying(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, []);

  // Actualizar volumen cuando cambia
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.error("Error al reproducir:", e));
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    const seekTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatMateTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleMateClick = () => {
    setMateCount((prev) => prev + 1);
    if (!timerActive) {
      setTimerActive(true);
      setMateTimer(0);
    }
  };

  const finishTermo = () => {
    setTermosCount((prev) => prev + 1);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setMateTimer(0);
  };

  const resetMateCount = () => {
    setMateCount(0);
  };

  const resetTermosCount = () => {
    setTermosCount(0);
  };

  const resetAllStats = () => {
    setMateCount(0);
    setTermosCount(0);
    setTimerActive(false);
    setMateTimer(0);
  };

  return (
    <div className="w-full p-1">
      {/* Reproductor de audio oculto */}
      <audio ref={audioRef} preload="auto" />

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-6 p-2">
          {/* Sección del mate y estadísticas */}
          <div className="flex-1">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                <MateIcon className="w-6 h-6 ml-1 text-[#8B5A2B]" />
                <span className="flex items-center">Modo Matecito</span>
              </h2>
              <p className="text-gray-600 text-sm">Musiquita y mates</p>
            </div>

            {/* imagen del carpincho*/}
            <div className="text-center mb-6">
              <div
                className="relative inline-block cursor-pointer"
                onClick={handleMateClick}
              >
                <div className="relative w-38 h-38 mx-auto">
                  <img
                    src="/carpincho.png"
                    alt="Mate"
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Click para tomar un mate
                </p>
              </div>
            </div>

            {/* Estadísticas del mate */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#50b9b5]/10 rounded-lg p-4 text-center relative group">
                <div className="text-2xl font-bold text-[#50b9b5]">
                  {mateCount}
                </div>
                <div className="text-sm text-gray-600">Mates tomados</div>
                <button
                  onClick={resetMateCount}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded-full"
                  title="Reiniciar mates"
                >
                  <RotateCcwIcon className="text-red-500" />
                </button>
              </div>

              <div className="bg-[#50b9b5]/10 rounded-lg p-4 text-center relative group">
                <div className="text-2xl font-bold text-[#50b9b5]">
                  {termosCount}
                </div>
                <div className="text-sm text-gray-600">Termos terminados</div>
                <button
                  onClick={resetTermosCount}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded-full"
                  title="Reiniciar termos"
                >
                  <RotateCcwIcon className="text-red-500" />
                </button>
              </div>

              <div className="bg-[#50b9b5]/10 rounded-lg p-4 text-center col-span-2 lg:col-span-1">
                <div className="text-2xl font-bold text-[#50b9b5]">
                  {formatMateTimer(mateTimer)}
                </div>
                <div className="text-sm text-gray-600">Tiempo mateando</div>
              </div>
            </div>

            {/* Controles del timer */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <button
                onClick={() => setTimerActive(!timerActive)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timerActive
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-[#50b9b5] hover:bg-[#51cfc9] text-white"
                }`}
              >
                {timerActive ? "Pausar contador" : "Iniciar contador"}
              </button>

              <button
                onClick={resetTimer}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Resetear tiempo
              </button>

              <button
                onClick={finishTermo}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Terminar Termo
              </button>

              <button
                onClick={resetAllStats}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center"
              >
                <RotateCcwIcon className="w-4 h-4 mr-1" />
                Resetear Todo
              </button>
            </div>
          </div>

          {/* Sección del reproductor - Centrada verticalmente */}
          <div className="flex-1 flex flex-col justify-center">
            {/* Información de la canción actual */}
            <div className="text-center mb-4 bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-1">
                Reproduciendo:
              </h3>
              <p className="text-gray-700 truncate">Enganchadito de cumbia</p>
              <div className="text-sm text-gray-500 mt-2">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            {/* Barra de progreso */}
            <div className="mb-4">
              <input
                type="range"
                min="0"
                max="100"
                value={duration ? (currentTime / duration) * 100 : 0}
                onChange={handleSeek}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#50b9b5]"
              />
            </div>

            {/* Controles principales */}
            <div className="flex justify-center items-center mb-4">
              <button
                onClick={togglePlay}
                className="bg-[#50b9b5] hover:bg-[#51cfc9] text-white p-4 rounded-full transition-all shadow-lg hover:scale-105"
              >
                {isPlaying ? (
                  <PauseIcon className="w-6 h-6" />
                ) : (
                  <PlayIcon className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Control de volumen */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
              <button
                onClick={toggleMute}
                className="text-gray-700 hover:text-[#50b9b5] transition-colors"
              >
                {isMuted ? <VolumeXIcon /> : <Volume2Icon />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#50b9b5]"
              />
              <span className="text-sm text-gray-700 w-8 text-right">
                {isMuted ? 0 : volume}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
