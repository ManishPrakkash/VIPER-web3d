"use client";

import { useScrollStore } from "@/store/useScrollStore";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Overlay() {
  const progress = useScrollStore((state) => state.progress);
  
  // Real-time specs matching progress
  const [rpm, setRpm] = useState(0);
  const [speed, setSpeed] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const rimRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<HTMLDivElement>(null);
  const aeroRef = useRef<HTMLDivElement>(null);
  const interiorRef = useRef<HTMLDivElement>(null);
  const outroRef = useRef<HTMLDivElement>(null);
  const blurOverlayRef = useRef<HTMLDivElement>(null);

  // 1. Initial GSAP Entrance (Racing HUD Boot-up)
  useEffect(() => {
    const tl = gsap.timeline();
    
    // Hide initially to prevent flash
    gsap.set([hudRef.current, heroRef.current], { opacity: 0 });

    tl.to(hudRef.current, {
      opacity: 1,
      duration: 0.1,
      repeat: 3,
      yoyo: true, // Flicker effect
      delay: 1.5, // Wait for loading screen to start fading
    })
    .to(hudRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out"
    })
    .fromTo(heroRef.current, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      "-=0.2"
    );
  }, []);

  // 2. Sync GSAP timeline logic mapping to the 0-1 progress
  useEffect(() => {
    // Telemetry Animation
    setRpm(Math.floor(Math.min(8400, progress * 15000)));
    setSpeed(Math.floor(Math.min(206, progress * 400)));

    // Visibility Mapping
    if (heroRef.current) heroRef.current.style.opacity = progress < 0.15 ? `${1 - (progress * 7)}` : "0";
    if (rimRef.current) rimRef.current.style.opacity = (progress > 0.15 && progress < 0.32) ? "1" : "0";
    if (engineRef.current) engineRef.current.style.opacity = (progress > 0.32 && progress < 0.48) ? "1" : "0";
    if (aeroRef.current) aeroRef.current.style.opacity = (progress > 0.48 && progress < 0.64) ? "1" : "0";
    if (interiorRef.current) interiorRef.current.style.opacity = (progress > 0.64 && progress < 0.8) ? "1" : "0";
    if (outroRef.current) outroRef.current.style.opacity = progress > 0.85 ? "1" : "0";

    // HUD Visibility (Hide during Outro drive-away)
    if (hudRef.current) hudRef.current.style.opacity = progress > 0.85 ? "0" : "1";

    // Extreme Cinematic Blur at the very end
    if (blurOverlayRef.current) {
      blurOverlayRef.current.style.opacity = progress > 0.88 ? "1" : "0";
    }

  }, [progress]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-10 w-full h-full flex flex-col justify-between overflow-hidden">
      
      {/* Massive Cinematic Ending Blur */}
      <div 
        ref={blurOverlayRef} 
        className="absolute inset-0 z-50 backdrop-blur-[40px] bg-black/40 transition-opacity duration-1000 opacity-0"
      />
      
      {/* 1. HUD: Coordinates & Tech Specs (Fades out Outro) */}
      <div ref={hudRef} className="absolute inset-0 flex flex-col justify-between transition-opacity duration-500">
        <div className="w-full flex justify-between items-start p-4 sm:p-8 hud-text mix-blend-difference text-[7px] sm:text-xs">
          {/* Coordinates - Stacked tighter on mobile */}
          <div className="flex flex-col gap-0 sm:gap-1">
            <span>LAT: 10.82° N</span>
            <span>LNG: 77.06° E</span>
            <span className="text-white mt-1 opacity-80 sm:opacity-100">GARAGE // VIPER</span>
          </div>

          {/* Telemetry - Simplified for mobile to prevent horizontal bleed */}
          <div className="flex flex-col gap-0 sm:gap-1 items-end">
            <div className="flex items-baseline gap-1">
              <span className="text-white text-sm sm:text-2xl font-bold">{rpm}</span>
              <span className="opacity-60 text-[6px] sm:text-xs">RPM</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-white text-xs sm:text-xl font-medium">{speed}</span>
              <span className="opacity-60 text-[6px] sm:text-xs">MPH</span>
            </div>
          </div>
        </div>

        {/* No scroll track as per user request for cleaner experience */}
      </div>

      {/* 2. Scenes Container */}
      <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
        
        {/* Intro */}
        <div ref={heroRef} className="absolute bottom-20 flex flex-col items-center transition-opacity duration-700 opacity-100">
          <p className="hud-text tracking-[0.5em] text-white animate-pulse">
            SCROLL TO IGNITE
          </p>
        </div>

        {/* Profile / Chassis */}
        <div ref={rimRef} className="absolute left-6 md:left-24 transition-opacity duration-700 opacity-0 mix-blend-screen">
          <h2 className="text-3xl sm:text-4xl md:text-6xl text-white font-black uppercase tracking-tighter drop-shadow-lg leading-tight">
            Structural <br /> <span className="text-red-500">Geometry</span>
          </h2>
          <p className="font-mono text-[9px] sm:text-xs md:text-sm mt-4 md:mt-6 max-w-[240px] md:max-w-md text-white/80 leading-relaxed uppercase tracking-widest border-l border-red-500 pl-3 md:pl-4">
            Flawless 50/50 weight distribution.<br /> Magnesium Cowl framework. <br /><br /> Engineered for absolute lateral G-force control.
          </p>
        </div>

        {/* Powertrain / High-Angle */}
        <div ref={engineRef} className="absolute inset-y-0 right-6 md:right-24 flex flex-col justify-center transition-opacity duration-700 opacity-0 mix-blend-difference text-right items-end">
          <h2 className="text-5xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter mix-blend-difference">
            8.4L V10
          </h2>
          <div className="w-10 md:w-16 h-1 bg-red-600 my-2 md:my-4" />
          <p className="font-mono text-[9px] sm:text-xs md:text-sm text-white/80 uppercase tracking-widest md:tracking-[0.2em] leading-loose max-w-[200px] md:max-w-sm">
            Naturally Aspirated Core.<br />
            645 Horsepower.<br />
            600 LB-FT Torque. <br /><br />
            Pure analog combustion.
          </p>
        </div>

        {/* Aero / Roof Sweep */}
        <div ref={aeroRef} className="absolute bottom-24 left-6 md:left-24 transition-opacity duration-700 opacity-0 mix-blend-difference">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white uppercase tracking-tight">
            Maximum <br /> Downforce
          </h2>
          <p className="font-mono text-white/80 mt-4 md:mt-6 tracking-widest md:tracking-[0.3em] uppercase text-[9px] sm:text-xs md:text-sm">
            CARBON FIBER EXTREME AERO WING
          </p>
          <div className="flex gap-4 md:gap-8 mt-4 md:mt-6 font-mono text-red-500 text-[10px] md:text-sm tracking-widest">
            <div>
              <span className="block text-white font-bold text-sm md:text-lg mb-1">1,533 LBS</span>
              <span>DOWNFORCE</span>
            </div>
            <div>
              <span className="block text-white font-bold text-sm md:text-lg mb-1">150 MPH</span>
              <span>VELOCITY</span>
            </div>
          </div>
        </div>

        {/* Interior / Door Sweep */}
        <div ref={interiorRef} className="absolute inset-y-0 right-6 md:right-24 flex items-center transition-opacity duration-700 opacity-0 text-right justify-end">
          <div className="flex flex-col gap-4 md:gap-6 border-r-2 md:border-r-4 border-red-600 pr-4 md:pr-8 mix-blend-difference items-end">
            <h2 className="text-4xl sm:text-5xl md:text-7xl text-white font-black tracking-tight uppercase leading-none">
              Driver <br /> Centric
            </h2>
            <div className="flex flex-col gap-3 md:gap-6 mt-2 md:mt-4 text-white/80 font-mono text-[10px] md:text-sm tracking-widest text-right">
              <div className="flex flex-col gap-0.5 md:gap-1 items-end">
                <span className="text-white font-bold text-xs md:text-sm">TRANSMISSION</span>
                <span>TREMEC MANUAL</span>
              </div>
              <div className="flex flex-col gap-0.5 md:gap-1 items-end">
                <span className="text-white font-bold text-xs md:text-sm">MATERIALS</span>
                <span>CARBON FIBER</span>
              </div>
            </div>
          </div>
        </div>

        <div ref={outroRef} className="absolute inset-0 w-full flex flex-col items-center justify-start pt-[18vh] transition-opacity duration-1000 opacity-0 z-50 pointer-events-none text-center">
          {/* USER Hierarchy: Mallow TOP, then Viper, then Aero Bottom */}
          <span className="text-red-700 font-mono tracking-[0.4em] text-[12px] md:text-base font-bold drop-shadow-[0_0_10px_rgba(185,28,28,0.4)] mb-4">
            MANISHMELLOW
          </span>
          <h1 className="text-white/20 text-5xl sm:text-7xl md:text-9xl font-black tracking-[0.1em] mix-blend-screen drop-shadow-lg whitespace-nowrap">
            ᐯ丨卩 乇 尺
          </h1>
          <span className="text-white/40 font-mono tracking-[0.2em] text-[10px] md:text-xs mt-6">
            AERODYNAMICS PERFECTED
          </span>
        </div>

      </div>
    </div>
  );
}
