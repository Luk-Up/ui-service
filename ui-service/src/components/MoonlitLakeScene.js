import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import React, { useRef } from "react";
import { OrbitControls, MeshReflectorMaterial, useTexture } from "@react-three/drei";
import { EffectComposer, Bloom, SelectiveBloom } from '@react-three/postprocessing';
import { KernelSize, Resolution } from 'postprocessing';

function Moon() {
  const moonSize = 1;
  const moonPosition = [0, 10, -7];
  const moonRef = useRef();
  return (
    <mesh position={moonPosition} ref={moonRef}>
      <sphereGeometry args={[moonSize, 64, 64]} />
      <meshStandardMaterial color="#FFFFFF" emissive="#E0E8FF" emissiveIntensity={1} toneMapped={false} />
    </mesh>
  );
}

function Lake() {
  const waterYPosition = -1
  const [distortionMap] = useTexture(["/textures/water_distortion.jpg"]);
  if(distortionMap){
    distortionMap.wrapS = distortionMap.wrapT = THREE.RepeatWrapping;
    distortionMap.repeat.set(4, 4);
  }
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, waterYPosition, 0]}>
      <planeGeometry args={[1000, 1000]} />
      <MeshReflectorMaterial
        resolution={512}        // Lower resolution for testing
        mixBlur={0.16}           // No blur initially
        mixStrength={100}        // Very high strength
        roughness={0.05}         // Perfectly smooth
        color="#020610"         // Slightly lighter dark blue for base, just in case
        metalness={0.8}
        mirror={1}      
        distortionMap={distortionMap}  
        distortion={0.05}
        minDepthThreshold={0.4} // Adjusted for proper depth
        maxDepthThreshold={1.4} // Adjusted for proper depth
        depthScale={0.0}        // Much smaller depth scale to keep reflection at surface
        depthToBlurRatioBias={0.9}
      />
    </mesh>
  )
}

function MoonlitLakeScene() {
  const selectiveBloomMoonRef = useRef();
  return (
    <div style={{ width: "100vw", height: "100vh", background: "black" }}>
      <Canvas className="threejs" camera={{ position: [0, 3, 20], fov: 55, near: 0.1, far: 1000 }}>
        <color attach="background" args={["#02040A"]} />
        <ambientLight intensity={0.2} color="#6070A0" />
        <Moon />
        <Lake />
        <EffectComposer>
          <Bloom kernelSize={KernelSize.HUGE} luminanceThreshold={0.4} luminanceSmoothing={0.025} intensity={2.0} mipmapBlur />
        </EffectComposer>
        <OrbitControls enableDamping dampingFactor={0.05} />
      </Canvas>
    </div>
  );
}

export default MoonlitLakeScene;
