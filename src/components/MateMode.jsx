import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Coffee,
  RotateCcw,
} from "lucide-react";

// Playlist de YouTube (versión acortada para el ejemplo)
const playlist = [
  { id: "vlGwm4fXyIA", title: "Soy Sabalero" },
  { id: "gg5QWSWNBpY", title: "Uriel Lozano - Mi Suegra Dice" },
  { id: "Wukp17nvb_E", title: "No Voy a Mentirte" },
  { id: "scLgt3NWY_I", title: "Con El No Soportas" },
  { id: "MnpqKCx_7D8", title: "La Suavecita" },
  { id: "gNuNdIKDzVw", title: "La Culpa La Tiene El Ron" },
  { id: "Pqp-PHOxaZc", title: "Tú Me Obligaste" },
  { id: "q3AlrIsy3Cg", title: "Maravillosa Esta Noche" },
  { id: "piEk_kFOinQ", title: "Le Pido A Dios" },
  { id: "Ia29pBuwZA8", title: "Olvídala (Single)" },
  { id: "kMWE9pwfcak", title: "Hasta Allá en el Cielo" },
  { id: "65_vmpxcoIA", title: "Donde Estas Corazón" },
  { id: "0F6NLXovbj4", title: "Me las Vas a Pagar" },
  { id: "lhM_aMimHN8", title: "Tramposa Y Mentirosa" },
  { id: "nuBC59BovL4", title: "Mi Cumbia Santafesina" },
  { id: "AiljVWz9398", title: "Blindado" },
  { id: "4HcnsXL181I", title: "El Amor de Mi Vida" },
  { id: "K0P8EhAHiUc", title: "Llorarás Más De Diez Veces" },
  { id: "JfLdcDZCWwY", title: "Antes" },
  { id: "vpGo0G-d--Q", title: "Qué Quiere La Chola" },
  { id: "QD6_xEuSK_c", title: "Aunque Sea En Otra Vida" },
  { id: "48z-glP9JCU", title: "Mientes" },
  { id: "Ac1FOTSTtcs", title: "Como Fui a Enamorarme de Ti" },
  { id: "TOqrtlMYYR8", title: "El Kun Agüero" },
  { id: "6JzGEqg-S40", title: "Después De Ti" },
  { id: "SqUmU6AGJs4", title: "Recuerdos de Mi" },
  { id: "v3sVSnyvam0", title: "Por Siempre" },
  { id: "u3ho6cPlKNs", title: "Iluminará" },
  { id: "-qdjY_tTxXE", title: "Marinero" },
  { id: "Ww7ctiM3lko", title: "Ultima Vez" },
  { id: "Eol89G32fww", title: "Y Vete Ya" },
  { id: "yh6zhK0k-Jo", title: "Me Es Imposible" },
  { id: "VpqTcMjv1kw", title: "La Revancha - El Campanero" },
  { id: "AC53FG9e1DA", title: "Amaneciendo en Ti" },
  { id: "N8SOzx6qWJU", title: "No Te Preocupes por Mi" },
  { id: "q-cZxRWd4Ao", title: "Un Velero Llamado Libertad" },
  { id: "tWHxyc6Pr6s", title: "Como Has Hecho" },
  { id: "OLvtp1BuC1w", title: "Llamala" },
  { id: "L5PLvamkBOM", title: "Vete (En Vivo)" },
];

export default function MateMode() {
  const playerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);

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

  // Guardar estadísticas en localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mateCount", mateCount.toString());
      localStorage.setItem("termosCount", termosCount.toString());
    }
  }, [mateCount, termosCount]);

  // Cargar YouTube IFrame API
  useEffect(() => {
    if (typeof window !== "undefined" && !window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        playerRef.current = new window.YT.Player("youtube-player", {
          height: "0",
          width: "0",
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
          },
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            rel: 0,
            showinfo: 0,
            modestbranding: 1,
          },
        });
      };
    } else if (window.YT) {
      // Si la API ya está cargada, crear el reproductor inmediatamente
      playerRef.current = new window.YT.Player("youtube-player", {
        height: "0",
        width: "0",
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          showinfo: 0,
          modestbranding: 1,
        },
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  // Cargar nueva canción cuando cambia el índice
  useEffect(() => {
    if (playerReady && playlist[currentIndex]) {
      playerRef.current.loadVideoById(playlist[currentIndex].id);
      if (isPlaying) {
        playerRef.current.playVideo();
      }
    }
  }, [currentIndex, playerReady]);

  // Actualizar volumen cuando cambia
  useEffect(() => {
    if (playerReady) {
      playerRef.current.setVolume(isMuted ? 0 : volume);
    }
  }, [volume, isMuted, playerReady]);

  // Actualizar tiempo actual para la barra de progreso
  useEffect(() => {
    let interval;
    if (isPlaying && playerReady) {
      interval = setInterval(() => {
        setCurrentTime(playerRef.current.getCurrentTime());
        setDuration(playerRef.current.getDuration());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playerReady]);

  const onPlayerReady = (event) => {
    setPlayerReady(true);
    event.target.setVolume(volume);
    setDuration(event.target.getDuration());
  };

  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.ENDED) {
      skipNext();
    } else if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
    } else if (event.data === window.YT.PlayerState.PAUSED) {
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (!playerReady) return;

    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const skipNext = () => {
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
  };

  const skipPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    setIsMuted(false);
    if (playerReady) {
      playerRef.current.setVolume(newVolume);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (playerReady) {
      playerRef.current.setVolume(!isMuted ? 0 : volume);
    }
  };

  const handleSeek = (e) => {
    if (!playerReady) return;
    const seekTime = (e.target.value / 100) * duration;
    playerRef.current.seekTo(seekTime, true);
    setCurrentTime(seekTime);
  };

  const formatTime = (time) => {
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
      {/* Player de YouTube (oculto) */}
      <div id="youtube-player" style={{ display: "none" }}></div>

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-6 p-2">
          {/* Sección del mate y estadísticas */}
          <div className="flex-1">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                <Coffee className="w-6 h-6 text-[#50b9b5]" />
                Modo Matecito 🧉
              </h2>
              <p className="text-gray-600 text-sm">Musiquita y mates</p>
            </div>

            {/* Mate con imagen */}
            <div className="text-center mb-6">
              <div
                className="relative inline-block cursor-pointer"
                onClick={handleMateClick}
              >
                <div className="relative w-38 h-38 mx-auto">
                  <img
                    src="/mate.png"
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
                  <RotateCcw size={12} className="text-red-500" />
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
                  <RotateCcw size={12} className="text-red-500" />
                </button>
              </div>

              <div className="bg-[#50b9b5]/10 rounded-lg p-4 text-center col-span-2 lg:col-span-1">
                <div className="text-2xl font-bold text-[#50b9b5]">
                  {formatMateTimer(mateTimer)}
                </div>
                <div className="text-sm text-gray-600">Tiempo matear</div>
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
                {timerActive ? "Pausar Timer" : "Iniciar Timer"}
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
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <RotateCcw className="w-4 h-4 inline mr-1" />
                Resetear Todo
              </button>
            </div>
          </div>

          {/* Sección del reproductor */}
          <div className="flex-1">
            {/* Información de la canción actual */}
            <div className="text-center mb-2 bg-gray-50 rounded-lg p-2">
              <h3 className="font-semibold text-gray-800 mb-1">
                Reproduciendo:
              </h3>
              <p className="text-gray-700 truncate">
                {playlist[currentIndex]?.title || "Sin título"}
              </p>
              <div className="text-sm text-gray-500 mt-2">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            {/* Barra de progreso */}
            <div className="mb-2">
              <input
                type="range"
                min="0"
                max="100"
                value={duration ? (currentTime / duration) * 100 : 0}
                onChange={handleSeek}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Controles principales */}
            <div className="flex justify-center items-center gap-4 mb-3">
              <button
                onClick={skipPrev}
                className="bg-[#50b9b5] hover:bg-[#51cfc9] text-white p-2 rounded-full transition-colors shadow-md"
              >
                <SkipBack size={20} />
              </button>

              <button
                onClick={togglePlay}
                className="bg-[#50b9b5] hover:bg-[#51cfc9] text-white p-3 rounded-full transition-all shadow-lg transform hover:scale-105"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>

              <button
                onClick={skipNext}
                className="bg-[#50b9b5] hover:bg-[#51cfc9] text-white p-2 rounded-full transition-colors shadow-md"
              >
                <SkipForward size={20} />
              </button>
            </div>

            {/* Control de volumen */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2 mb-2">
              <button
                onClick={toggleMute}
                className="text-gray-700 hover:text-[#50b9b5] transition-colors"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-700 w-8 text-right">
                {isMuted ? 0 : volume}%
              </span>
            </div>

            {/* Lista de canciones con scroll interno */}
            <div className="bg-gray-50 rounded-lg p-2">
              <h4 className="font-semibold text-gray-800 mb-1 text-center text-sm">
                Playlist de YouTube
              </h4>
              <div className="max-h-50 overflow-y-auto scrollbar-thin scrollbar-thumb-[#50b9b5] scrollbar-track-gray-200">
                {playlist.map((song, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-full text-left p-2 rounded-md transition-colors text-xs ${
                      index === currentIndex
                        ? "bg-[#50b9b5] text-white font-medium"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <span className="truncate block">
                      {index + 1}. {song.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #50b9b5;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #50b9b5;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
