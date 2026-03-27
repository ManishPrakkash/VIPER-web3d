import { create } from 'zustand';
import * as THREE from 'three';

interface ScrollState {
  progress: number;
  cameraTarget: THREE.Vector3;
  setProgress: (progress: number) => void;
  setCameraTarget: (target: THREE.Vector3) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  cameraTarget: new THREE.Vector3(0, 0, 0),
  setProgress: (progress: number) => set({ progress }),
  setCameraTarget: (target: THREE.Vector3) => set({ cameraTarget: target }),
}));
