"use client";

import { ReactLenis, useLenis } from 'lenis/react';
import { ReactNode, useEffect } from 'react';
import { useScrollStore } from '@/store/useScrollStore';

function LenisScrollSync() {
  const setProgress = useScrollStore((state) => state.setProgress);
  
  // 1. Force the experience to start at '0%' on page refresh
  useEffect(() => {
    // Disable browser's native scroll restoration
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    
    // Jump to top immediately and reset our global progress state
    window.scrollTo(0, 0);
    setProgress(0);
  }, [setProgress]);

  // 2. Use useLenis animation frame callback to continuously update Zustand state
  useLenis((e: any) => {
    setProgress(e.progress);
  });
  
  return null;
}

export function LenisProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.035, // Extremely heavy, silky smooth cinematic inertia
        wheelMultiplier: 0.8, // Slightly slows down native wheel speed for prestige feel
        smoothWheel: true,
      }}
    >
      <LenisScrollSync />
      {/* Overriding Typescript check for React 18/19 mismatch */}
      {children as any}
    </ReactLenis>
  );
}
