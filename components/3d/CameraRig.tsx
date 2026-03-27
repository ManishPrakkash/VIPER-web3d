import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useScrollStore } from '@/store/useScrollStore';
import { easing } from 'maath';

export default function CameraRig() {
  const { camera } = useThree();
  const progress = useScrollStore((state) => state.progress);
  const setCameraTarget = useScrollStore((state) => state.setCameraTarget);
  
  const tl = useRef<gsap.core.Timeline>(null);
  
  // Dummy targets for GSAP to animate natively without jitter
  const camPos = useMemo(() => new THREE.Vector3(0, 0.5, 4), []);
  const lookAtPos = useMemo(() => new THREE.Vector3(0, 0.5, 0), []);

  useEffect(() => {
    // Total duration is 1 arbitrarily, we scrub 0->1
    const timeline = gsap.timeline({ paused: true });

    // Initial State: Smooth, wide tracking from further back
    camPos.set(0, 1.5, 12);
    lookAtPos.set(0, 0.5, 0);

    // 1. Intro -> Front 3/4 Sweeping (Progress 0 -> 0.16)
    timeline.to(camPos, { x: -6, y: 1.8, z: 8, ease: 'power2.inOut', duration: 1 }, 0);
    timeline.to(lookAtPos, { x: 0, y: 0.8, z: 0, ease: 'power2.inOut', duration: 1 }, 0);

    // 2. Ultra-Wide Profile Sweep (Progress 0.16 -> 0.33)
    timeline.to(camPos, { x: -10, y: 1.2, z: 0, ease: 'power2.inOut', duration: 1 }, 1);
    timeline.to(lookAtPos, { x: 0, y: 0.5, z: 0, ease: 'power2.inOut', duration: 1 }, 1);

    // 3. High-Angle Hood & Powertrain (Progress 0.33 -> 0.5)
    timeline.to(camPos, { x: -5, y: 6, z: 6, ease: 'power2.inOut', duration: 1 }, 2);
    timeline.to(lookAtPos, { x: 0, y: 1, z: 1, ease: 'power2.inOut', duration: 1 }, 2);

    // 4. Sweeping over the roof to the Rear Wing (Progress 0.5 -> 0.66)
    timeline.to(camPos, { x: 6, y: 4, z: -6, ease: 'power2.inOut', duration: 1 }, 3);
    timeline.to(lookAtPos, { x: 0, y: 1.5, z: -1, ease: 'power2.inOut', duration: 1 }, 3);

    // 5. Low Ground Cinematic Tracking (Progress 0.66 -> 0.83)
    timeline.to(camPos, { x: 8, y: 0.5, z: 3, ease: 'power2.inOut', duration: 1 }, 4);
    timeline.to(lookAtPos, { x: 0, y: 1.0, z: 0, ease: 'power2.inOut', duration: 1 }, 4);

    // 6. Cinematic Rear Bumper Outro (Progress 0.83 -> 1.0)
    timeline.to(camPos, { x: 0, y: 2.2, z: -8.5, ease: 'power2.inOut', duration: 1 }, 5);
    timeline.to(lookAtPos, { x: 0, y: 0.6, z: 0, ease: 'power2.inOut', duration: 1 }, 5);

    tl.current = timeline;

    return () => {
      timeline.kill();
    };
  }, [camPos, lookAtPos]);

  useFrame((state, delta) => {
    if (tl.current) {
      // 1. Apply GSAP timeline to dummy objects
      tl.current.progress(progress);

      // 2. Dampen actual camera position to dummy targets (Creates cinematic inertia)
      easing.damp3(camera.position, camPos, 0.4, delta);
      
      // Dampen a local lookAt vector and apply to camera
      // Also sync it to Zustand so Effects.tsx (DOF) focuses accurately!
      const currentLookAt = new THREE.Vector3();
      camera.getWorldDirection(currentLookAt); 
      // Instead of getting world dir, let's keep a stateful Vector for lookAt
      // We will read from the global state, dampen it, write back, and apply.
      const targetVec = state.camera.clone().position.add(lookAtPos.clone().sub(state.camera.position));
      
      // Wait, simpler: damp a local ref vector toward lookAtPos, then camera.lookAt it
    }
  });

  const actualLookAt = useRef(new THREE.Vector3(0, 0.5, 0));

  useFrame((state, delta) => {
    // Dampen local LookAt towards GSAP target
    easing.damp3(actualLookAt.current, lookAtPos, 0.4, delta);
    
    // Apply camera
    camera.lookAt(actualLookAt.current);

    // Sync focal point to Zustand for DepthOfField
    setCameraTarget(actualLookAt.current.clone());
  });

  return null;
}
