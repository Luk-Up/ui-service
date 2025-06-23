import { Canvas, useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import React, { useRef, useState } from "react";
import { OrbitControls, MeshReflectorMaterial, Stars } from "@react-three/drei";
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

function MoonReflection(){
  const moonSize = 1.5;
  const moonPosition = [0, -0.9, -7];
  return (
    <mesh position={moonPosition} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[moonSize]}/>
      <meshStandardMaterial color="#FFFFFF" emissive="#E0E8FF" emissiveIntensity={4} toneMapped={false} />
    </mesh>
  )
}

function Lake() {
  const waterYPosition = -1
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
        minDepthThreshold={0.4} // Adjusted for proper depth
        maxDepthThreshold={1.4} // Adjusted for proper depth
        depthScale={1.0}        // Much smaller depth scale to keep reflection at surface
        depthToBlurRatioBias={0.9}
      />
    </mesh>
  )
}

function RippleEffect({ initialPosition, onComplete }){
  const meshRef = useRef();
  const startTime = useRef(Date.now());
  const maxDuration = 1.5;
  const maxScale = 15;

  useFrame(() => {
    if(!meshRef.current) return;
    const elapsedTime = (Date.now() - startTime.current) / 1000;
    if(elapsedTime < maxDuration){
      const progress = elapsedTime / maxDuration;
      const currentScale = progress * maxScale;
      const currentOpacity = Math.max(0, 0.707 * (1 - progress * progress));
      meshRef.current.scale.set(currentScale, currentScale, 1);
      meshRef.current.material.opactiy = currentOpacity;
    } else{
      meshRef.current.visible = false;
      if(onComplete){
        onComplete();
      }
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -0.99, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.1, 0.3, 32]}/>
      <meshBasicMaterial
        color="#87CEFA" // Light sky blue, neon-ish
        transparent
        opacity={0.7}    // Initial opacity
        side={THREE.DoubleSide}
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
        <MoonReflection />
        <Stars radius={500} count={500} depth={50} factor={4} fade speed={0.5} saturation={0}/> 
        <EffectComposer>
          <Bloom kernelSize={KernelSize.HUGE} luminanceThreshold={0.4} luminanceSmoothing={0.025} intensity={2.0} mipmapBlur />
        </EffectComposer>
        <OrbitControls enableDamping dampingFactor={0.05} />
      </Canvas>
    </div>
  );
}

export default MoonlitLakeScene;
