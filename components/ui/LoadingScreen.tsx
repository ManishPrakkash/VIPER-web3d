"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState, useRef, useCallback } from "react";
import gsap from "gsap";

export default function LoadingScreen() {
  const { progress, active } = useProgress();
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [hasStartedTransition, setHasStartedTransition] = useState(false);

  const startTransition = useCallback(() => {
    if (hasStartedTransition) return;
    setHasStartedTransition(true);

    const tl = gsap.timeline({
      onComplete: () => setIsVisible(false)
    });

    // Clean Fade-out transition
    tl.to(contentRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.inOut"
    });

    tl.to(containerRef.current, {
      opacity: 0,
      duration: 1.2,
      ease: "power2.inOut"
    }, "-=0.2");

  }, [hasStartedTransition]);

  useEffect(() => {
    if (progress >= 100 && !hasStartedTransition) {
      const timer = setTimeout(startTransition, 800);
      return () => clearTimeout(timer);
    }
  }, [progress, hasStartedTransition, startTransition]);

  if (!isVisible) return null;

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020202] ${
        progress >= 100 ? "cursor-pointer" : ""
      }`}
      onClick={() => progress >= 100 && startTransition()}
    >
      <div ref={contentRef} className="flex flex-col gap-6 w-full max-w-sm px-10 items-center select-none">
        
        {/* Minimalist HUD Tag */}
        <div className="w-full flex justify-between items-end font-mono text-[9px] tracking-[0.3em] text-white/40 uppercase">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red-600 animate-pulse" />
            SYSTEMS STABLE
          </span>
          <span>SR-01-V</span>
        </div>

        {/* Minimalist Bar */}
        <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-white transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* HUD Info */}
        <div className="w-full flex justify-between items-start font-mono text-[10px] tracking-widest text-white uppercase opacity-60">
          <div className="flex flex-col gap-1">
            <span>{progress < 100 ? "Syncing..." : "Ready"}</span>
          </div>
          <span className="text-xl font-bold">{progress.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}
