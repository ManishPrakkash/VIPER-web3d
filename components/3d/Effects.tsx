import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useScrollStore } from '@/store/useScrollStore';
import * as THREE from 'three';

export default function EffectsSetup() {
  const cameraTarget = useScrollStore((state) => state.cameraTarget);

  return (
    <EffectComposer>
      <Bloom 
        luminanceThreshold={0.5} // Lower threshold to make AP Lab Tubes and Headlights glow aggressively
        luminanceSmoothing={0.9} 
        intensity={1.2} 
        mipmapBlur 
      />
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  );
}
