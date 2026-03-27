# ᐯ丨卩 乇 尺 - Digital Noir Garage

An ultra-luxury, high-performance scroll-driven cinematic 3D sports car portfolio built with **Next.js 15+ (App Router)**, **React Three Fiber (R3F)**, **Custom GLSL Shaders**, and **Lenis**.

This project delivers a triple-A gaming aesthetic where the scroll wheel governs a 1200vh cinematic timeline of wide orbital camera sweeps, aggressive lighting transitions, and hardware-accelerated reflections.

---

## 🌟 High-End Features

### 1. Cinematic Engine & Navigation
- **Ultra-Smooth Scroll Dynamics**: Powered by `Lenis` with a heavy `0.035` lerp level for majestic, weighted momentum.
- **Wide Orbital Camera Rig**: A global `GSAP` timeline orchestrates majestic, radius-10 orbital sweeps, eliminating tight camera collisions for a more grand, cinematic feel.
- **1200vh Active Timeline**: Provides the slow, breathing pacing required for high-end automotive showcases.

### 2. Custom Shader Engineering
- **"Demon Eye" Headlight Mask**: A custom GLSL fragment shader injected into the `glass_light` material. 
- **Native Sweep Animation**: The red neon headlight drawing effect is mathematically mapped to initial scroll progress, physically "drawing" the light onto the mesh.
- **Sinister Breathing Idle**: Headlight emissive intensity features a sine-wave pulse logic to simulate a living, idling engine.

### 3. Lighting & Performance
- **Digital Noir Studio Rig**: High-contrast unilateral lighting consisting of a sharp top-down spotlight and directional white rim lights. 
- **Outro Reflection Culling**: Dynamically fades out front-facing studio highlights during the rear-orbit outro to keep the floor reflections pitch-black and clean.
- **60FPS Real-Time Reflections**: `MeshReflectorMaterial` tuned for high-performance GPUs with a 512px down-sampled resolution.

### 4. Interactive Typography
- **Subtle Signature Overlay**: A deep red `MANISHMELLOW` 3D signature hovering above the main VIPER logo in the initial reveal.
- **Advanced HUD Layouts**: Premium `text-6xl+` headers paired with `mix-blend-difference` monospaced telemetry data tracking `RPM` and `MPH` in real-time.
- **Cinematic Fade Outro**: A translucent `ᐯ丨卩 乇 尺` title (text-white/20) hovers in the upper third during the final rear shot, preserving the car's silhouette.

---

## 🛠️ Project Architecture

```text
/
├── app/
│   ├── layout.tsx         # Injects Lenis & Global SEO
│   ├── page.tsx           # 1200vh Scroll Master Container
│   └── providers/
│       └── LenisProvider.tsx # Scroll Physics Configuration
├── components/
│   ├── 3d/
│   │   ├── CanvasScene.tsx # Fixed Background <Canvas> & Reflections
│   │   ├── CarModel.tsx    # GLTF GLSL Masking & Drive Logic
│   │   ├── CameraRig.tsx   # Master GSAP Progress Mapping
│   │   ├── Lights.tsx      # Cinematic Local Illumination Controls
│   │   └── Effects.tsx     # UnrealBloomPass & Depth of Field
│   └── ui/
│       └── Overlay.tsx     # Final Cinematic Typography HUD
└── store/
    └── useScrollStore.ts   # Zustand Global Progress Synchronization
```

---

## 🚀 Getting Started

1. **Clone the repo**:
   ```bash
   git clone [your-repo-link]
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the production audit**:
   ```bash
   npx tsc --noEmit && npm run build
   ```

4. **Start development**:
   ```bash
   npm run dev
   ```

---

## 🏁 Author
**MANISHMELLOW** - *Digital Noir Garage Engineering*
