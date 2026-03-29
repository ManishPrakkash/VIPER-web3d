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
    // 0. Cinematic Launch Sequence (Racing Theme)
    // Synchronized with LoadingScreen exit
    const cameraAsAny = camera as any;
    if (cameraAsAny.isPerspectiveCamera) {
      cameraAsAny.fov = 65; 
      cameraAsAny.updateProjectionMatrix();

      gsap.to(cameraAsAny, {
        fov: 45, // "Zoom" into the car
        duration: 2.5,
        delay: 1.5,
        ease: "expo.out",
        onUpdate: () => cameraAsAny.updateProjectionMatrix()
      });
    }

    // Total duration is 1 arbitrarily, we scrub 0->1
    const timeline = gsap.timeline({ paused: true });

    // Initial State: Smooth, wide tracking from further back
    camPos.set(0, 1.5, 14); // Slightly further back for the launch zoom
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
  }, [camera, camPos, lookAtPos]);

  useFrame((state, delta) => {
    if (tl.current) {
      tl.current.progress(progress);
      easing.damp3(camera.position, camPos, 0.4, delta);
    }
  });

  const actualLookAt = useRef(new THREE.Vector3(0, 0.5, 0));

  useFrame((state, delta) => {
    easing.damp3(actualLookAt.current, lookAtPos, 0.4, delta);
    camera.lookAt(actualLookAt.current);
    setCameraTarget(actualLookAt.current.clone());
  });

  return null;
}
