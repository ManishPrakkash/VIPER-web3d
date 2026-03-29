"use client";

import { ReactLenis, useLenis } from 'lenis/react';
import { ReactNode, useEffect } from 'react';
import { useScrollStore } from '@/store/useScrollStore';

function LenisScrollSync() {
  const setProgress = useScrollStore((state) => state.setProgress);
  const setIsScrolling = useScrollStore((state) => state.setIsScrolling);
  
  // 1. Force the experience to start at '0%' on page refresh
  useEffect(() => {
    // Disable browser's native scroll restoration
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    
    // Jump to top immediately and reset our global progress state
    window.scrollTo(0, 0);
    setProgress(0);
    setIsScrolling(false);
  }, [setProgress, setIsScrolling]);

  // 2. Use useLenis for granular scroll events
  useLenis((e: any) => {
    setProgress(e.progress);
  });
  
  // 3. Track scroll state to toggle Dynamic Fidelity
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    
    const handleScroll = (e: any) => {
      // Threshold velocity to determine when to snap back to High-Quality
      if (Math.abs(e.velocity) < 0.1) setIsScrolling(false);
      else setIsScrolling(true);
    };

    lenis.on('scroll', handleScroll);

    return () => {
      lenis.off('scroll', handleScroll);
    };
  }, [lenis, setIsScrolling]);

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
