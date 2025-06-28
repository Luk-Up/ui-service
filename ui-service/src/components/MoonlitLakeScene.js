import { MeshReflectorMaterial, Stars, OrbitControls } from "@react-three/drei";
import { useThree, Canvas, useFrame } from "@react-three/fiber";
import { useRef, Suspense } from "react";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { KernelSize } from "postprocessing";

function Moon({ moonPosition }) {
  const moonRadius = 1;

  return (
    <mesh position={moonPosition}>
      <sphereGeometry args={[moonRadius, 64, 64]} />
      <meshStandardMaterial color="#ffffff" emissive="#A080FF" emissiveIntensity={2.5} toneMapped={false} />
    </mesh>
  );
}

function MoonReflection({reflectionPosition}){
  const reflectionRotation = [-Math.PI / 2, 0, 0];
  const reflectionRadius = 1.2;

  return (
    <mesh position={reflectionPosition} rotation={reflectionRotation}>
      <circleGeometry args={[reflectionRadius]} />
      <meshStandardMaterial color="#ffffff" emissive="#A080FF" emissiveIntensity={1.4} toneMapped={false} />
    </mesh>
  )
}

function Lake() {
  const lakePosition = [0, -1, 0];
  const lakeRotation = [-Math.PI / 2, 0, 0]

  return (
    <mesh position={lakePosition} rotation={lakeRotation}>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial
        color="#020610" // A very dark blue, almost black
        transparent={true}
        opacity={0.85}
        roughness={0.2} // A little roughness to catch some light subtly
        metalness={0.1}
      />
    </mesh>
  )
}


function MoonlitLakeScene() {
  const moonPosition = [0, 8, -8];
  const reflectionPosition = [0, -0.99, -8]
  return (
    <div style={{ margin: 0, padding: 0, overflow: "hidden", background: "black", width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 2, 20], fov: 55, near: 0.1, far: 1000 }} >
        <color attach="background" args={["#02040A"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={moonPosition} intensity={3} distance={150} color="#A080FF" />
        {/* <directionalLight position={[0, 10, 10]} intensity={1.5} color="#A080FF" castShadow={false}/> */}
        <Suspense fallback={null}>
          <Moon moonPosition={moonPosition} />
          <Lake /> {/* --- ADDED THE LAKE TO THE SCENE --- */}
          <MoonReflection reflectionPosition={reflectionPosition} />
        </Suspense>
        <Stars radius={100} depth={50} count={1000} factor={0.4} saturation={0} fade speed={1} />
        <EffectComposer>
          <Bloom
            kernelSize={KernelSize.HUGE}
            luminanceThreshold={0.4}
            luminanceSmoothing={0.025}
            intensity={2.0}
            mipmapBlur
          />
        </EffectComposer>
        <OrbitControls enableDamping />
      </Canvas>
    </div>

  );
}

export default MoonlitLakeScene;
