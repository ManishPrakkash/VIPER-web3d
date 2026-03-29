import { create } from 'zustand';
import * as THREE from 'three';

interface ScrollState {
  progress: number;
  isScrolling: boolean;
  cameraTarget: THREE.Vector3;
  setProgress: (progress: number) => void;
  setIsScrolling: (isScrolling: boolean) => void;
  setCameraTarget: (target: THREE.Vector3) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  isScrolling: false,
  cameraTarget: new THREE.Vector3(0, 0, 0),
  setProgress: (progress: number) => set({ progress }),
  setIsScrolling: (isScrolling: boolean) => set({ isScrolling }),
  setCameraTarget: (target: THREE.Vector3) => set({ cameraTarget: target }),
}));
