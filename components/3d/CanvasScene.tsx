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
      {/* 1. Top Brand Tag (Red) */}
      <Text
        fontSize={subFontSize}
        color="#b91c1c" // Racing Red
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.6 * mobileScale}
        position={[0, 3.8 * mobileScale, 0]} 
      >
        M A N I S H M E L L O W
      </Text>

      {/* 2. Main Title (Grey) */}
      <Text
        fontSize={mainFontSize}
        color="#2a2a2a" // Space Grey 
        anchorX="center"
        anchorY="middle"
        position={[0, 0.8, 0]}
      >
        ᐯ丨卩 乇 尺
      </Text>
    </group>
  );
}

export default function CanvasScene() {
  const isScrolling = useScrollStore((state) => state.isScrolling);

  return (
    
    <Canvas
      shadows={{ type: THREE.PCFSoftShadowMap }} // High-quality soft shadows
      gl={{ 
        antialias: false, 
        powerPreference: "high-performance",
        alpha: false,
        stencil: false,
        depth: true
      }}
      camera={{ position: [0, 2, 10], fov: 45 }}
      // Dynamic Fidelity: Shift to 1x during motion for 60FPS, snap to 1.5x when stationary for sharp detail
      dpr={isScrolling ? 1 : [1, 1.5]} 
      performance={{ min: 0.5 }} 
    >
      <color attach="background" args={["#020202"]} />
      
      <Suspense fallback={null}>
        
        <Lights />
        <CameraRig />
        <CarModel />

        {/* 3D Typography Behind the Car for Occlusion */}
        <AnimatedText />

        {/* High-Fidelity Reflections: Constant 256px resolution but optimized sampling */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.99, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <MeshReflectorMaterial
            blur={[400, 100]} 
            resolution={256} // Restored to user-preferred high quality
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
