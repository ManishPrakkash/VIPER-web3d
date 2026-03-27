"use client";

import Overlay from "@/components/ui/Overlay";
import dynamic from "next/dynamic";

// Dynamically import 3D canvas so we don't block SSR
const CanvasScene = dynamic(() => import("@/components/3d/CanvasScene"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative w-full bg-black block">
      {/* 3D Canvas Fixed Background - Pitch Black */}
      <div className="fixed inset-0 z-0">
        <CanvasScene />
      </div>

      {/* 1200vh Scrollable Container tying GSAP timeline to DOM (maximum cinematic smoothness) */}
      <div className="relative z-10 w-full h-[1200vh]">
        <Overlay />
      </div>
    </main>
  );
}
