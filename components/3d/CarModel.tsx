import React from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useScrollStore } from '@/store/useScrollStore'
import { easing } from 'maath'

function CarModel(props: any) {
  const { nodes, materials } = useGLTF('/2016_dodge_viper_acr.glb') as any
  const progress = useScrollStore((state) => state.progress)
  
  const outerGroup = useRef<THREE.Group>(null)
  const chassisGroup = useRef<THREE.Group>(null)

  // Inject Custom GLSL Shader to Mask the Headlight Lower Half
  useEffect(() => {
    const headlightMesh = nodes.car_dodge_viper_acrglass_glass_LOD2_UV1_Untitled_067_Default_glass_light_0;
    if (materials.glass_light && headlightMesh) {
      headlightMesh.geometry.computeBoundingBox();
      const minY = headlightMesh.geometry.boundingBox.min.y;
      const maxY = headlightMesh.geometry.boundingBox.max.y;
      const targetThreshold = minY + (maxY - minY) * 0.15; 

      materials.glass_light.onBeforeCompile = (shader: any) => {
        materials.glass_light.userData.shader = shader; 
        shader.uniforms.uGlowThreshold = { value: targetThreshold };

        shader.vertexShader = shader.vertexShader.replace(
          `#include <common>`,
          `#include <common>
           varying vec3 vLocalPosition;`
        ).replace(
          `#include <begin_vertex>`,
          `#include <begin_vertex>
           vLocalPosition = position;`
        );

        shader.fragmentShader = shader.fragmentShader.replace(
          `#include <common>`,
          `#include <common>
           uniform float uGlowThreshold;
           varying vec3 vLocalPosition;`
        ).replace(
          `#include <emissivemap_fragment>`,
          `#include <emissivemap_fragment>
           if (vLocalPosition.y < uGlowThreshold) {
               totalEmissiveRadiance = vec3(0.0);
           }`
        );
      };
      materials.glass_light.needsUpdate = true;
    }
  }, [materials, nodes]);

  useFrame((state, delta) => {
    if (outerGroup.current) {
      easing.damp(outerGroup.current.position, 'z', 0, 0.2, delta);
    }

    if (materials.glass_light) {
      materials.glass_light.emissive = new THREE.Color("#ff0000"); 
      materials.glass_light.toneMapped = false;
      
      if (materials.glass_light.userData.shader && nodes.car_dodge_viper_acrglass_glass_LOD2_UV1_Untitled_067_Default_glass_light_0) {
        const headlightMesh = nodes.car_dodge_viper_acrglass_glass_LOD2_UV1_Untitled_067_Default_glass_light_0;
        const minY = headlightMesh.geometry.boundingBox.min.y;
        const maxY = headlightMesh.geometry.boundingBox.max.y;
        const finalThreshold = minY + (maxY - minY) * 0.15; 
        
        let sweepProgress = Math.min(1, progress / 0.05); 
        const animatedThreshold = maxY - (maxY - finalThreshold) * sweepProgress;
        materials.glass_light.userData.shader.uniforms.uGlowThreshold.value = animatedThreshold;
      }
      
      let targetGlow = 0;
      if (progress < 0.9) {
        targetGlow = 15 + Math.sin(state.clock.elapsedTime * 3) * 4;
      }
      
      easing.damp(materials.glass_light, 'emissiveIntensity', targetGlow, 0.1, delta);
    }
  });

  return (
    <group ref={outerGroup} position={[0, 0, 0]}>
      <group ref={chassisGroup} {...props} dispose={null} position={[0, -1, 0]}>
      <group rotation={[-Math.PI / 2, 0, -Math.PI]}>
        <group rotation={[Math.PI / 2, 0, 0]} scale={2}>
          <group rotation={[-0.039, 0, 0]}>
            <group position={[-0.002, 0.007, -0.001]} rotation={[0.047, 0, 0]}>
              <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrdetach_door_L_50_details_LOD2_UV1_Untitled_024_Default_car_dodge_viper_acrDefault1_0.geometry} material={materials.car_dodge_viper_acrDefault1} />
              <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrdetach_door_L_50_details_LOD2_UV1_Untitled_024_Default_interior_0.geometry} material={materials.interior} />
            </group>
            <group position={[0, 1.801, 4.262]} rotation={[Math.PI, 0, 0]}>
              <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrdetach_wing_25_details_black_stripe_LOD2_UV1_Untitled_169_Default_carbon_0.geometry} material={materials.carbon} />
              <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrdetach_wing_25_details_black_stripe_LOD2_UV1_Untitled_169_Default_car_dodge_viper_acrDefault1_0.geometry} material={materials.car_dodge_viper_acrDefault1} />
            </group>
            <group position={[0, 0.022, 0.02]}>
              <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrdetach_door_R_50_details_LOD2_UV1_Untitled_025_Default_car_dodge_viper_acrDefault1_0.geometry} material={materials.car_dodge_viper_acrDefault1} />
              <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrdetach_door_R_50_details_LOD2_UV1_Untitled_025_Default_interior_0.geometry} material={materials.interior} />
            </group>
            <group position={[0, 0.022, 0.02]}>
              <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrdetach_door_R_50_carpaint_LOD2_UV1_Untitled_033_Default_CarPaint_AO_1_0.geometry} material={materials.CarPaint_AO_1} />
              <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrdetach_door_R_50_carpaint_LOD2_UV1_Untitled_033_Default_CarPaint_Black_AO_0.geometry} material={materials.CarPaint_Black_AO} />
            </group>
            <group position={[0, 0.022, 0.02]}>
              <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrglass_detachable_glass_LOD2_UV1_Untitled_068_Default_glass_0.geometry} material={materials.glass} />
              <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrglass_detachable_glass_LOD2_UV1_Untitled_068_Default_glass_light_0.geometry} material={materials.glass_light} />
            </group>
            <group position={[-0.002, 0.007, -0.001]} rotation={[0.047, 0, 0]}>
              <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrdetach_door_L_50_carpaint_LOD2_UV1_Untitled_160_Default_CarPaint_AO_1_0.geometry} material={materials.CarPaint_AO_1} />
              <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrdetach_door_L_50_carpaint_LOD2_UV1_Untitled_160_Default_CarPaint_Black_AO_0.geometry} material={materials.CarPaint_Black_AO} />
            </group>
            <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrdetach_diffuser_5_tiled_carbon_LOD2_UV1_Untitled_015_Default_carbon_0.geometry} material={materials.carbon} position={[0, 0.336, 3.336]} rotation={[Math.PI, 0, 0]} />
            <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrdetach_diffuser_5_details_normal_LOD2_UV2_Untitled_047_Default_car_dodge_viper_acrDefault1_0.geometry} material={materials.car_dodge_viper_acrDefault1} position={[0, 0.336, 3.336]} rotation={[Math.PI, 0, 0]} />
            <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrdetach_diffuser_5_details_LOD2_UV1_Untitled_023_Default_car_dodge_viper_acrDefault1_0.geometry} material={materials.car_dodge_viper_acrDefault1} position={[0, 0.336, 3.336]} rotation={[Math.PI, 0, 0]} />
            <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrsteering_wheel_details_LOD2_UV1_Untitled_182_Default_interior_0.geometry} material={materials.interior} position={[0, -1.361, -0.391]} />
            <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrdetach_hood_80_details_normal_LOD2_UV2_Untitled_026_Default_car_dodge_viper_acrDefault1_0.geometry} material={materials.car_dodge_viper_acrDefault1} position={[-1.474, 1.628, 0.074]} rotation={[0.024, 0.023, -3.141]} />
            <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrdetach_hood_80_carpaint_red_stripe_LOD2_UV1_Untitled_038_Default_Car_Paint_Red_AO_0.geometry} material={materials.Car_Paint_Red_AO} position={[-1.474, 1.628, 0.074]} rotation={[0.024, 0.023, -3.141]} />
            <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrdetach_lip_5_details_normal_LOD2_UV2_Untitled_027_Default_car_dodge_viper_acrDefault1_0.geometry} material={materials.car_dodge_viper_acrDefault1} position={[0, 0.399, -3.245]} rotation={[Math.PI, 0, 0]} />
            <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrdetach_hood_80_carpaint_black_stripe_LOD2_UV1_Untitled_117_Default_CarPaint_Black_AO_0.geometry} material={materials.CarPaint_Black_AO} position={[-1.474, 1.628, 0.074]} rotation={[0.024, 0.023, -3.141]} />
            <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrdetach_hood_80_carpaint_LOD2_UV1_Untitled_034_Default_CarPaint_AO_1_0.geometry} material={materials.CarPaint_AO_1} position={[-1.474, 1.628, 0.074]} rotation={[0.024, 0.023, -3.141]} />
            <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrdetach_wing_25_details_red_stripe_LOD2_UV1_Untitled_170_Default_red_stripe_0.geometry} material={materials.red_stripe} position={[0, 1.801, 4.262]} rotation={[Math.PI, 0, 0]} />
            <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrdetach_wing_25_details_LOD2_UV1_Untitled_016_Default_car_dodge_viper_acrDefault1_0.geometry} material={materials.car_dodge_viper_acrDefault1} position={[0, 1.801, 4.262]} rotation={[Math.PI, 0, 0]} />
            <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrdetach_wing_25_carpaint_custom03_LOD2_UV1_Untitled_065_Default_carbon_0.geometry} material={materials.carbon} position={[0, 1.801, 4.262]} rotation={[Math.PI, 0, 0]} />
            <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrdetach_hood_80_carpaint_custom01_LOD2_UV1_Untitled_166_Default_CarPaint_AO_1_0.geometry} material={materials.CarPaint_AO_1} position={[-1.474, 1.628, 0.074]} rotation={[0.024, 0.023, -3.141]} />
            <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrdetach_hood_80_details_LOD2_UV1_Untitled_013_Default_car_dodge_viper_acrDefault1_0.geometry} material={materials.car_dodge_viper_acrDefault1} position={[-1.474, 1.628, 0.074]} rotation={[0.024, 0.023, -3.141]} />
            <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrdetach_lip_5_details_LOD2_UV1_Untitled_014_Default_car_dodge_viper_acrDefault1_0.geometry} material={materials.car_dodge_viper_acrDefault1} position={[0, 0.399, -3.245]} rotation={[Math.PI, 0, 0]} />
            <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrdetach_hood_80_tiled_grid_LOD2_UV1_Untitled_185_Default_grulle_0.geometry} material={materials.grulle} position={[-1.474, 1.628, 0.074]} rotation={[0.024, 0.023, -3.141]} />
            
            <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrchassis_carpaint_red_stripe_LOD2_UV1_Untitled_037_Default_Car_Paint_Red_AO_0.geometry} material={materials.Car_Paint_Red_AO} />
            <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrglass_glass_LOD2_UV1_Untitled_067_Default_glass_0.geometry} material={materials.glass} />
            <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrglass_glass_LOD2_UV1_Untitled_067_Default_glass_light_0.geometry} material={materials.glass_light} />
            <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrchassis_underside_LOD2_UV1_Untitled_035_Default_phong12under_0.geometry} material={materials.phong12under} />
            <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrchassis_emissive_ID_thirdlight_LOD2_UV2_Untitled_039_Default_emiss_0.geometry} material={materials.emiss} />
            <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrchassis_licenseplate_LOD2_UV1_Untitled_187_Default_plate_0.geometry} material={materials.plate} />
            <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrchassis_carpaint_black_stripe_LOD2_UV1_Untitled_061_Default_CarPaint_Black_AO_0.geometry} material={materials.CarPaint_Black_AO} />
            <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrchassis_emissive_ID_rear_LOD2_UV2_Untitled_Default_car_dodge_viper_acrDefault1_0.geometry} material={materials.car_dodge_viper_acrDefault1} />
            <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrchassis_emissive_ID_rear_LOD2_UV2_Untitled_Default_emiss_0.geometry} material={materials.emiss} />
            <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrchassis_carpaint_LOD2_UV1_Untitled_032_Default_CarPaint_AO_1_0.geometry} material={materials.CarPaint_AO_1} />
            <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrchassis_tiled_grid_LOD2_UV1_Untitled_031_Default_grulle_0.geometry} material={materials.grulle} />
            <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrchassis_details_normal_LOD2_UV2_Untitled_018_Default_car_dodge_viper_acrDefault1_0.geometry} material={materials.car_dodge_viper_acrDefault1} />
            <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrchassis_details_LOD2_UV1_Untitled_010_Default_car_dodge_viper_acrDefault1_0.geometry} material={materials.car_dodge_viper_acrDefault1} />
            <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrchassis_details_LOD2_UV1_Untitled_010_Default_interior_0.geometry} material={materials.interior} />
            <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrchassis_details_LOD2_UV1_Untitled_010_Default_carbon_0.geometry} material={materials.carbon} />
            <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrchassis_tiled_carbon_LOD2_UV1_Untitled_009_Default_carbon_0.geometry} material={materials.carbon} />
          </group>
          {/* Wheels */}
          <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrwheelFR_caliper_calipers_LOD6_UV1_Untitled_074_Default_Calipers_AO_0.geometry} material={materials.Calipers_AO} />
          <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrwheelFR_tire_tires_LOD2_UV1_Untitled_020_Default_tire_0.geometry} material={materials.tire} />
          <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrwheelFR_rims_LOD2_UV1_Untitled_084_Default_rims_AO_0.geometry} material={materials.rims_AO} />
          <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrwheelFR_details_normal_LOD2_UV2_Untitled_131_Default_car_dodge_viper_acrDefault1_0.geometry} material={materials.car_dodge_viper_acrDefault1} />
          <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrwheelFL_caliper_calipers_LOD6_UV1_Untitled_073_Default_Calipers_AO_0.geometry} material={materials.Calipers_AO} />
          <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrwheelFL_tire_tires_LOD2_UV1_Untitled_113_Default_tire_0.geometry} material={materials.tire} />
          <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrwheelFL_rims_LOD2_UV1_Untitled_082_Default_rims_AO_0.geometry} material={materials.rims_AO} />
          <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrwheelFL_details_normal_LOD2_UV2_Untitled_126_Default_car_dodge_viper_acrDefault1_0.geometry} material={materials.car_dodge_viper_acrDefault1} />
          <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrwheelBR_caliper_calipers_LOD6_UV1_Untitled_177_Default_Calipers_AO_0.geometry} material={materials.Calipers_AO} />
          <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrwheelBR_tire_tires_LOD2_UV1_Untitled_019_Default_tire_0.geometry} material={materials.tire} />
          <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrwheelBR_rims_LOD2_UV1_Untitled_080_Default_rims_AO_0.geometry} material={materials.rims_AO} />
          <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrwheelBR_details_normal_LOD2_UV2_Untitled_121_Default_car_dodge_viper_acrDefault1_0.geometry} material={materials.car_dodge_viper_acrDefault1} />
          <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrwheelBL_tire_tires_LOD2_UV1_Untitled_112_Default_tire_0.geometry} material={materials.tire} />
          <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrwheelBL_rims_LOD2_UV1_Untitled_078_Default_rims_AO_0.geometry} material={materials.rims_AO} />
          <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrwheelBL_details_normal_LOD2_UV2_Untitled_028_Default_car_dodge_viper_acrDefault1_0.geometry} material={materials.car_dodge_viper_acrDefault1} />
          <mesh castShadow receiveShadow geometry={nodes.car_dodge_viper_acrwheelBL_caliper_calipers_LOD6_UV1_Untitled_072_Default_Calipers_AO_0.geometry} material={materials.Calipers_AO} />
        </group>
      </group>
    </group>
    </group>
  );
}

export default React.memo(CarModel);

useGLTF.preload('/2016_dodge_viper_acr.glb');
