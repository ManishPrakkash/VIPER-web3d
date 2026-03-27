import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useScrollStore } from '@/store/useScrollStore';
import { easing } from 'maath';

export default function Lights() {
  const progress = useScrollStore((state) => state.progress);
  
  // High-performance dramatic studio lights
  const mainSpot = useRef<THREE.SpotLight>(null);
  const blueRim = useRef<THREE.DirectionalLight>(null);
  const secondaryWhiteRim = useRef<THREE.SpotLight>(null);

  const lightState = useRef({ intensity: 0 });

  useFrame((state, delta) => {
    // Stage 1: Reveal from dark
    let targetIntensity = progress < 0.1 ? progress * 10 : 1;
    
    // Studio lighting remains persistent through the entire scroll map

    // Smooth transition
    easing.damp(lightState.current, 'intensity', targetIntensity, 0.2, delta);

    const i = lightState.current.intensity;
    // Fade out front-facing rims during the Outro to prevent harsh floor reflections
    const outroFade = progress > 0.85 ? Math.max(0, 1 - (progress - 0.85) * 10) : 1;

    if (mainSpot.current) mainSpot.current.intensity = 600 * i;
    if (blueRim.current) blueRim.current.intensity = 3 * i * outroFade;
    if (secondaryWhiteRim.current) secondaryWhiteRim.current.intensity = 200 * i * outroFade;
  });

  return (
    <>
      <ambientLight intensity={0} />

      {/* Extreme Cinematic Top-Down SpotLight */}
      <spotLight 
        ref={mainSpot}
        position={[0, 15, -5]} 
        angle={0.6} 
        penumbra={0.8} 
        intensity={0}
        color="#ffffff" 
        castShadow
        distance={30}
        decay={2}
      />

      {/* Pure White Rim Light - Carves out the left silhouette */}
      <directionalLight 
        ref={blueRim}
        position={[-10, 5, -10]} 
        intensity={0} 
        color="#ffffff" 
        castShadow
      />

      {/* Cinematic Secondary White Spot - Carves the right-side curves sharply */}
      <spotLight 
        ref={secondaryWhiteRim}
        position={[12, 4, 8]} 
        angle={0.5} 
        penumbra={0.7} 
        intensity={0}
        color="#ffffff" 
        distance={25}
        decay={2}
      />

      {/* Tail light glow - Moved to rear of car */}
      <pointLight 
        position={[0, 0.5, -4]} 
        color="#ff0000"
        distance={8}
        intensity={3}
        decay={2}
      />

    </>
  );
}
