'use client'
import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { Pause, Play, Volume1, Volume2, VolumeX } from "lucide-react";

export default function Home() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPaused, setIsPaused] = useState(true); // Inicializar como true para começar pausado
  const [volume, setVolume] = useState(1); // Estado para o volume

  useEffect(() => {
    const savedPlayState = localStorage.getItem("isPaused");
    if (savedPlayState === "true" && audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.play().then(() => {
        setIsPaused(false);
      }).catch(err => {
        console.warn("Autoplay bloqueado:", err);
        setIsPaused(true);
      });
    }
  }, []); // apenas ao carregar
  
  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPaused(false);
        localStorage.setItem("isPaused", "true");
      } else {
        audioRef.current.pause();
        setIsPaused(true);
        localStorage.setItem("isPaused", "false");
      }
    }
  };
  

  // Função para ajustar o volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Função para escolher o ícone de volume
  const volumeIcon = volume === 0
    ? <VolumeX className="w-6 h-6" />
    : volume < 0.5
    ? <Volume1 className="w-6 h-6" />
    : <Volume2 className="w-6 h-6" />;

  return (
    <div className="relative w-full min-h-screen scroll-smooth flex flex-col">
    {/* Imagem do fundo com logo */}
    <div className="absolute inset-0">
      <Image src="/pocradio.jpeg" alt="fundo" fill className="object-cover" aria-hidden />
    </div>
  
    {/* Sobreposição para escurecer a imagem */}
    <div className="absolute inset-0 bg-black/40 z-0" />
  
    {/* Logo do player fixo no topo */}
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] w-[80px] h-[80px] flex items-center justify-center cursor-pointer transition-transform duration-500 ${
        !isPaused ? "animate-spin" : ""
      }`}
    >
      <Image
        src="/poclogo.png"
        alt="logo"
        width={80}
        height={80}
        onClick={() => toggleAudio()}
        className="object-contain hover:scale-110 transition-transform duration-300"
        aria-hidden
      />
    </div>
  
    {/* Player fixo */}
    <div className="fixed top-20 mt-5 left-1/2 transform -translate-x-1/2 w-[90%] sm:w-[60%] backdrop-blur-lg bg-white/10 border border-white/20 p-4 rounded-2xl flex items-center justify-between gap-4 shadow-2xl z-[10000] transition-all duration-300">
      <audio ref={audioRef} loop>
        <source src="https://listen.radioking.com/radio/734252/stream/800552" type="audio/mpeg" />
        Seu navegador não suporta o elemento áudio.
      </audio>
  
      {/* Botão Play/Pause */}
      <button
        className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors duration-200"
        onClick={toggleAudio}
      >
        {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
      </button>
  
      {/* Centralização do texto */}
      <div className="flex flex-col items-center justify-center flex-1 text-center">
        <p className="text-sm text-white/80">{isPaused ? "Aperte no play para sintonizar" : "Você está sintonizado na rádio"}</p>
      </div>
  
      {/* Controles de Volume */}
      <div className="flex items-center gap-2">
        <button className="p-2">{volumeIcon}</button>
        <input
          type="range"
          className="w-24 h-2 bg-white/30 rounded-lg appearance-none cursor-pointer accent-pink-500"
          onChange={handleVolumeChange}
          value={volume}
          min="0"
          max="1"
          step="0.01"
        />
      </div>
    </div>
  
    <main className="relative z-10 flex-grow flex flex-col items-center justify-center text-white text-center px-4">
      <h1 className="text-5xl font-extrabold drop-shadow-md mb-4">
        Bem-vindo à Rádio das POCS 🎙️
      </h1>
      <h2 className="text-xl max-w-xl drop-shadow-sm mb-6">
        Alô, alô, mona! Você sintonizou na Rádio das Pocs — onde o glitter é frequente e o deboche é lei.
      </h2>
    </main>
  
    <footer className="relative z-10 w-full py-6 flex flex-col md:flex-row items-center justify-center gap-16 text-white">
      <div className="flex flex-col items-center w-48 text-center">
        <p className="text-lg">Nossa Comunidade</p>
        <Link href="https://discord.gg/J3zznmm9Yd" target="_blank">
          <Image src="/discordlogo.png" alt="Discord" width={200} height={100} className="object-contain hover:scale-110 transition-transform duration-300" />
        </Link>
      </div>
  
      <div className="flex flex-col items-center w-48 text-center">
        <p className="text-lg">Jogue Conosco</p>
        <Link href="https://www.habblet.city/" target="_blank">
          <Image src="/habbletlogo.png" alt="Habblet" width={400} height={150} className="object-contain hover:scale-110 transition-transform duration-300" />
        </Link>
      </div>
    </footer>
  </div>
  
  );
}
