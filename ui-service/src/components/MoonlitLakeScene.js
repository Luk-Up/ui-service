// src/components/MoonlitLakeScene.js
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, MeshReflectorMaterial, Html } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { gsap } from 'gsap';

// --- Constants ---
const MOON_POSITION = new THREE.Vector3(0, 40, -90);
const WATER_Y_POSITION = -0.5;
const INITIAL_CAMERA_POSITION = new THREE.Vector3(0, 8, 50);
const REFLECTION_FOCUS_CAMERA_POSITION = new THREE.Vector3(MOON_POSITION.x, 5, MOON_POSITION.z + 20);
const REFLECTION_TARGET_POINT = new THREE.Vector3(MOON_POSITION.x, WATER_Y_POSITION, MOON_POSITION.z);

// Component for Stylized Landscape Silhouettes
function LandscapeSilhouettes() {
    const hillMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#081020',
        roughness: 0.2,
        metalness: 0.1
    }), []);

    return (
        <group>
            {/* Distant Layer 1 */}
            <mesh material={hillMaterial} position={[0, 2, -150]} scale={[300, 20, 1]}><boxGeometry /></mesh>
            <mesh material={hillMaterial} position={[-60, 5, -140]} scale={[80, 30, 1]}><boxGeometry /></mesh>
            <mesh material={hillMaterial} position={[70, 3, -135]} scale={[90, 25, 1]}><boxGeometry /></mesh>

            {/* Distant Layer 2 */}
            <mesh material={hillMaterial} position={[0, 1, -100]} scale={[250, 15, 1]}><boxGeometry /></mesh>
            <mesh material={hillMaterial} position={[-40, 3, -95]} scale={[70, 20, 1]}><boxGeometry /></mesh>
            <mesh material={hillMaterial} position={[50, 2, -90]} scale={[60, 18, 1]}><boxGeometry /></mesh>
        </group>
    );
}

// Ripple Effect Component
function RippleEffect({ id, origin, onComplete }) {
    const meshRef = useRef();
    const startTime = useMemo(() => Date.now(), []); // CORRECTED: Removed the extra 'K'

    useFrame(() => {
        if (meshRef.current) {
            const elapsedTime = (Date.now() - startTime) / 1000; // in seconds
            const duration = 2; // Ripple duration in seconds
            if (elapsedTime < duration) {
                const progress = elapsedTime / duration;
                const scale = progress * 30; // Max ripple size
                const opacity = 1 - progress;
                meshRef.current.scale.set(scale, scale, 1);
                meshRef.current.material.opacity = opacity;
            } else {
                meshRef.current.visible = false; // Hide when done
                if (onComplete) onComplete(id); // Notify parent
            }
        }
    });

    if (!origin) return null;

    return (
        <mesh
            ref={meshRef}
            position={[origin.x, WATER_Y_POSITION + 0.01, origin.z]} // Slightly above water
            rotation={[-Math.PI / 2, 0, 0]}
        >
            <ringGeometry args={[0.1, 0.2, 32]} />
            <meshBasicMaterial color="#58c2f0" transparent opacity={1} />
        </mesh>
    );
}


function SceneContent({ onWaterClick, ripples, onRippleComplete, isReflectionFocused }) {
    const lightSourceRef = useRef();
    const waterMeshRef = useRef();
    const controlsRef = useRef(); // Ref for OrbitControls
    // useThree can be used here because SceneContent is INSIDE Canvas
    // const { camera, scene } = useThree(); 

    useEffect(() => {
        // Update OrbitControls target when focus changes
        if (controlsRef.current) {
            if (isReflectionFocused) {
                gsap.to(controlsRef.current.target, {
                    x: REFLECTION_TARGET_POINT.x,
                    y: REFLECTION_TARGET_POINT.y,
                    z: REFLECTION_TARGET_POINT.z,
                    duration: 1.5,
                    ease: "power2.inOut"
                });
            } else {
                 gsap.to(controlsRef.current.target, {
                    x: 0,
                    y: 2,
                    z: 0,
                    duration: 1.5,
                    ease: "power2.inOut"
                });
            }
            controlsRef.current.update();
        }
    }, [isReflectionFocused]);


    const handleWaterPlaneClick = (event) => {
        event.stopPropagation();
        onWaterClick(event.point);
    };

    return (
        <>
            <ambientLight intensity={0.1} color="#304070" />
            <directionalLight
                ref={lightSourceRef}
                color="#e0e8ff"
                intensity={1.2}
                position={MOON_POSITION}
                target-position={[0,0,0]}
                castShadow
            />

            <mesh position={MOON_POSITION} name="moon">
                <sphereGeometry args={[5, 48, 48]} />
                <meshBasicMaterial color={0xfffee5} toneMapped={false} />
            </mesh>

            <mesh
                ref={waterMeshRef}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, WATER_Y_POSITION, 0]}
                onClick={handleWaterPlaneClick}
                name="waterPlane"
            >
                <planeGeometry args={[500, 500]} />
                <MeshReflectorMaterial
                    blur={[300, 100]}
                    resolution={1024}
                    mixBlur={0.8}
                    mixStrength={isReflectionFocused ? 25 : 15}
                    roughness={0.3}
                    depthScale={1}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    color="#00030a"
                    metalness={0.7}
                    mirror={1}
                />
            </mesh>

            {ripples.map(ripple => (
                <RippleEffect
                    key={ripple.id}
                    id={ripple.id}
                    origin={ripple.origin}
                    onComplete={onRippleComplete}
                />
            ))}

            <LandscapeSilhouettes />
            <Stars radius={300} depth={80} count={3000} factor={5} saturation={0} fade speed={0.5} />

            <OrbitControls
                ref={controlsRef}
                enableDamping
                dampingFactor={0.05}
                minDistance={5}
                maxDistance={150}
                minAzimuthAngle={-Math.PI / 2.5}
                maxAzimuthAngle={Math.PI / 2.5}
                minPolarAngle={Math.PI / 3}
                maxPolarAngle={Math.PI / 1.8}
                target={[0, 2, 0]}
                enabled={true}
            />
        </>
    );
}

function MoonlitLakeScene() {
    // const { camera } = useThree(); // <<--- REMOVED THIS: Cannot use R3F hooks outside Canvas
    const [ripples, setRipples] = useState([]);
    const [isReflectionFocused, setIsReflectionFocused] = useState(false);
    const cameraRef = useRef(); // This will hold the camera instance

    useEffect(() => {
        const uploadButton = document.getElementById('file-upload-button');
        const fileInput = document.getElementById('actual-file-input');

        if (!fileInput && document.querySelector('button[id="file-upload-button"]')) {
             console.warn("File input #actual-file-input not found in the DOM.");
        }

        const handleUploadButtonClick = () => {
            if(fileInput) fileInput.click();
        };

        const handleFileChange = (event) => {
            if (event.target.files && event.target.files.length > 0) {
                const file = event.target.files[0];
                console.log("File selected: ", file.name);
            }
        };

        if(uploadButton && fileInput){
            uploadButton.addEventListener('click', handleUploadButtonClick);
            fileInput.addEventListener('change', handleFileChange);
        }

        return () => {
            if(uploadButton && fileInput){
                uploadButton.removeEventListener('click', handleUploadButtonClick);
                fileInput.removeEventListener('change', handleFileChange);
            }
        };
    }, []);


    const addRipple = (originPoint) => {
        const newRipple = {
            id: Date.now() + Math.random(),
            origin: { x: originPoint.x, z: originPoint.z },
        };
        setRipples(prevRipples => [...prevRipples, newRipple]);
    };

    const handleRippleComplete = (rippleId) => {
        setRipples(prevRipples => prevRipples.filter(r => r.id !== rippleId));
    };

    const handleWheel = (event) => {
        if (!cameraRef.current) return;

        const scrollDelta = event.deltaY;

        if (scrollDelta > 0 && !isReflectionFocused) {
            setIsReflectionFocused(true);
            gsap.to(cameraRef.current.position, {
                x: REFLECTION_FOCUS_CAMERA_POSITION.x,
                y: REFLECTION_FOCUS_CAMERA_POSITION.y,
                z: REFLECTION_FOCUS_CAMERA_POSITION.z,
                duration: 2,
                ease: "power2.inOut",
            });
        } else if (scrollDelta < 0 && isReflectionFocused) {
            setIsReflectionFocused(false);
            gsap.to(cameraRef.current.position, {
                x: INITIAL_CAMERA_POSITION.x,
                y: INITIAL_CAMERA_POSITION.y,
                z: INITIAL_CAMERA_POSITION.z,
                duration: 2,
                ease: "power2.inOut",
            });
        }
    };


    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                background: 'linear-gradient(to bottom, #06091f 0%, #0b1028 30%, #10183a 70%, #182044 100%)',
                position: "relative",
                cursor: isReflectionFocused ? 'pointer' : 'grab'
            }}
            onWheel={handleWheel}
        >
            <Canvas
                onCreated={({ camera }) => { cameraRef.current = camera; }}
                camera={{
                    position: INITIAL_CAMERA_POSITION,
                    fov: 50,
                    near: 0.1,
                    far: 1000
                }}
                gl={{ antialias: true, physicallyCorrectLights: true }}
                shadows
            >
                <Suspense fallback={null}>
                    <SceneContent
                        onWaterClick={addRipple}
                        ripples={ripples}
                        onRippleComplete={handleRippleComplete}
                        isReflectionFocused={isReflectionFocused}
                    />
                </Suspense>
                <EffectComposer>
                    <Bloom
                        luminanceThreshold={0.3}
                        luminanceSmoothing={0.025}
                        intensity={1.5}
                        mipmapBlur
                        kernelSize={3}
                    />
                </EffectComposer>
            </Canvas>

            <div style={{
                position: "absolute",
                top: isReflectionFocused ? '15%' : '75%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                zIndex: 10,
                transition: 'top 0.5s ease-in-out'
            }}>
                <h1 style={{ color: '#e0e8ff', textShadow: '0 0 10px #6080ff', fontSize: '2.5em', margin: 0 }}>LOOKUP</h1>
                <input type="file" id="actual-file-input" style={{ display: 'none' }} accept="image/*" />
            </div>
        </div>
    );
}

export default MoonlitLakeScene;