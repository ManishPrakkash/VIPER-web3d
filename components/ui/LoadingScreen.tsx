"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState, useRef, useCallback } from "react";
import gsap from "gsap";

export default function LoadingScreen() {
  const { progress } = useProgress();
  const [visualProgress, setVisualProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [hasStartedTransition, setHasStartedTransition] = useState(false);

  // Sync visual progress with Drei's progress using GSAP for buttery smooth updates
  useEffect(() => {
    gsap.to({ val: visualProgress }, {
      val: progress,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: function() {
        setVisualProgress(this.targets()[0].val);
      }
    });
  }, [progress]);

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
    // Only transition when VISUAL progress is actually 100
    if (visualProgress >= 100 && !hasStartedTransition) {
      const timer = setTimeout(startTransition, 800);
      return () => clearTimeout(timer);
    }
  }, [visualProgress, hasStartedTransition, startTransition]);

  if (!isVisible) return null;

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020202] ${
        visualProgress >= 100 ? "cursor-pointer" : ""
      }`}
      onClick={() => visualProgress >= 100 && startTransition()}
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
            className="absolute left-0 top-0 h-full bg-white"
            style={{ width: `${visualProgress}%` }}
          />
        </div>

        {/* HUD Info */}
        <div className="w-full flex justify-between items-start font-mono text-[10px] tracking-widest text-white uppercase opacity-60">
          <div className="flex flex-col gap-1">
            <span>{visualProgress < 100 ? "Syncing..." : "Ready"}</span>
          </div>
          <span className="text-xl font-bold">{visualProgress.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}
