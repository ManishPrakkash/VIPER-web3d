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
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { easing } from 'maath';

function AnimatedText() {
  const textGroupRef = useRef<THREE.Group>(null);
  const progress = useScrollStore((state) => state.progress);

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
        fontSize={4}
        color="#2a2a2a" // Dark grey so it reveals softly 
        anchorX="center"
        anchorY="middle"
        position={[0, 0.8, 0]}
      >
        ᐯ丨卩 乇 尺
      </Text>
      <Text
        fontSize={0.35}
        color="#6a0000" // Very dark, muted cinematic red (not flashy)
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.6}
        position={[0, 3.6, 0]} // Pushed higher to create more negative space
      >
        M A N I S H M E L L O W
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
      dpr={[1, 2]}
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
            blur={[50, 50]}
            resolution={512}
            mixBlur={0.5}
            mixStrength={40}
            roughness={0.2}
            depthScale={1}
            minDepthThreshold={0.5}
            maxDepthThreshold={1.5}
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
