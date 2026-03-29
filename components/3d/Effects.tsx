"use client";

import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

export default function EffectsSetup() {
  return (
    <EffectComposer>
      <Bloom 
        luminanceThreshold={0.5} 
        luminanceSmoothing={1} // Performance: Smoother glow at lower intensity
        intensity={0.8} // Performance: Reduced for better GPU stability
        mipmapBlur 
      />
      
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  );
}
