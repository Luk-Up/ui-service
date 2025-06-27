import { MeshReflectorMaterial, Stars, OrbitControls } from "@react-three/drei";
import { useThree, Canvas, useFrame } from "@react-three/fiber";
import { useRef, Suspense } from "react";
import * as THREE from "three";

function Moon({ moonPosition }) {
  const moonRadius = 1;

  return (
    <mesh position={moonPosition}>
      <sphereGeometry args={[moonRadius, 64, 64]} />
      <meshStandardMaterial color="#ffffff" emissive="#A080FF" emissiveIntensity={1.5} />
    </mesh>
  );
}

function Lake() {
  const lakePosition = [0, 0, 0];
  const lakeRotation = [-Math.PI / 2, 0, 0]

  return (
    <mesh position={lakePosition} rotation={lakeRotation}>
      <planeGeometry args={[200, 200]} />
      <MeshReflectorMaterial
        blur={[400, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={40}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#0b0c10"
        metalness={0.5}
        mirror={1}
      />
    </mesh>
  )
}

function Orbit({ position }) {
  const radius = 0.4;
  const meshRef = useRef();
  const center = [0, 8, -8];
  const speed = 5;

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      const x = center[0] + position[0] * Math.cos(time * speed);
      const y = center[1] + position[1] * Math.sin(time * speed);
      const z = center[2] + position[2] * Math.sin(time * speed) * Math.cos(time * speed);
      meshRef.current.position.set(x, y, z);
    }
  })
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshStandardMaterial color="#87CEEB" emissive="#ffffff" />
    </mesh>
  )
}

function MoonlitLakeScene() {
  const moonPosition = [0, 8, -8];
  return (
    <div style={{ margin: 0, padding: 0, overflow: "hidden", background: "black", width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 4, 15], fov: 50, near: 0.1, far: 1000 }} >
        <color attach="background" args={["#02040A"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={moonPosition} intensity={1} distance={100} color="#A080FF" />
        <Suspense fallback={null}>
          <Moon moonPosition={moonPosition} />
          <Lake /> {/* --- ADDED THE LAKE TO THE SCENE --- */}
        </Suspense>
        <Stars radius={100} depth={50} count={500} factor={4} saturation={0} fade speed={1} />
        <Orbit position={[2, 2, 2]} />
        <Orbit position={[-2, 2, -2]} />
        <Orbit position={[-2, -2, 2]} />
        <Orbit position={[-2, -2, -2]} />
        <OrbitControls enableDamping />
      </Canvas>
    </div>

  );
}

export default MoonlitLakeScene;
