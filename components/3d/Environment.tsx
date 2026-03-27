import { Environment } from "@react-three/drei";

export default function SceneEnvironment() {
  return (
    <Environment
      preset="studio" // 'studio' gives a nice soft box reflection like Apple products
      background={false}
      blur={0.5}
    />
  );
}
