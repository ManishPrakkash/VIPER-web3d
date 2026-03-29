"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { MeshReflectorMaterial, Text } from "@react-three/drei";
import * as THREE from "three";
import Lights from "./Lights";
import CarModel from "./CarModel";
import CameraRig from "./CameraRig";
import EffectsSetup from "./Effects";
import { useScrollStore } from '@/store/useScrollStore';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { easing } from 'maath';

function AnimatedText() {
  const textGroupRef = useRef<THREE.Group>(null);
  const progress = useScrollStore((state) => state.progress);
  const { viewport } = useThree();

  // Responsive Scaling: Adjust font size based on screen width
  const mobileScale = Math.min(viewport.width / 4, 1);
  const mainFontSize = 4 * mobileScale;
  const subFontSize = 0.35 * mobileScale;

  useFrame((state, delta) => {
    if (textGroupRef.current) {
      // Sink text completely out of frame into the floor during the Outro (progress > 0.85)
      const targetY = progress > 0.85 ? -10 : 1.5;
      easing.damp(textGroupRef.current.position, 'y', targetY, 0.2, delta);
    }
  });

  return (
    <group ref={textGroupRef} position={[0, 1.5, -8]}>
      <Text
        fontSize={mainFontSize}
        color="#2a2a2a" // Dark grey so it reveals softly 
        anchorX="center"
        anchorY="middle"
        position={[0, 0.8, 0]}
      >
        ᐯ丨卩 乇 尺
      </Text>
      <Text
        fontSize={subFontSize}
        color="#ffffff" // Changed to white as requested (only Manishmellow red)
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.5 * mobileScale}
        position={[0, 3.6 * mobileScale, 0]} 
      >
        A E R O D Y N A M I C S  P E R F E C T E D
      </Text>
    </group>
  );
}

export default function CanvasScene() {

  return (
    
    <Canvas
      shadows={{ type: THREE.PCFShadowMap }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 2, 10], fov: 45 }}
      dpr={[1, 1.5]} // Performance: Optimized for Retina/4K
      performance={{ min: 0.5 }} // Performance: Allow auto-scaling
    >
      <color attach="background" args={["#020202"]} />
      
      <Suspense fallback={null}>
        
        <Lights />
        <CameraRig />
        <CarModel />

        {/* 3D Typography Behind the Car for Occlusion */}
        <AnimatedText />

        {/* Digital Noir Reflections Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.99, 0]}>
          <planeGeometry args={[100, 100]} />
          <MeshReflectorMaterial
            blur={[300, 100]} // Performance: Heavier blur to mask lower resolution
            resolution={256} // Performance: Lowered from 512 for better FPS
            mixBlur={1}
            mixStrength={40}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#050505"
            metalness={0.8}
            mirror={1}
          />
        </mesh>

        <EffectsSetup />
      </Suspense>
    </Canvas>
  );
}
