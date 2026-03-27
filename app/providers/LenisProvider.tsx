"use client";

import { ReactLenis, useLenis } from 'lenis/react';
import { ReactNode } from 'react';
import { useScrollStore } from '@/store/useScrollStore';

function LenisScrollSync() {
  const setProgress = useScrollStore((state) => state.setProgress);
  
  // Use useLenis animation frame callback to continuously update Zustand state
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
