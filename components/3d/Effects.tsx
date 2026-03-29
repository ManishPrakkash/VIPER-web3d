"use client";

import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

export default function EffectsSetup() {
  return (
    <EffectComposer>
      <Bloom 
        luminanceThreshold={0.5} 
        luminanceSmoothing={0.9} 
        intensity={1.2} 
        mipmapBlur 
      />
      
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  );
}
