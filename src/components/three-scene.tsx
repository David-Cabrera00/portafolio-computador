"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Float,
  OrbitControls,
  RoundedBox,
} from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

function Computer({
  approaching,
  onSelect,
}: {
  approaching: boolean;
  onSelect: () => void;
}) {
  const screen = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (screen.current)
      screen.current.rotation.y = Math.sin(Date.now() / 2500) * 0.01;
  });
  return (
    <Float
      speed={approaching ? 0 : 1.2}
      rotationIntensity={0.08}
      floatIntensity={approaching ? 0 : 0.12}
    >
      <group position={[0, 0, 0]}>
        <RoundedBox
          args={[3.2, 2.05, 0.18]}
          radius={0.12}
          smoothness={4}
          position={[0, 1.25, 0]}
        >
          <meshStandardMaterial
            color="#1a2232"
            metalness={0.7}
            roughness={0.28}
          />
        </RoundedBox>
        <mesh
          ref={screen}
          position={[0, 1.25, -0.11]}
          onClick={onSelect}
          onPointerOver={(event) => {
            event.stopPropagation();
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "default";
          }}
        >
          <planeGeometry args={[2.85, 1.7]} />
          <meshStandardMaterial
            color="#101a2b"
            emissive="#234a87"
            emissiveIntensity={approaching ? 0.65 : 0.35}
          />
        </mesh>
        <mesh position={[0, -0.05, 0]}>
          <boxGeometry args={[0.35, 2.3, 0.25]} />
          <meshStandardMaterial color="#2b3850" metalness={0.6} />
        </mesh>
        <RoundedBox
          args={[5.1, 0.22, 2.1]}
          radius={0.08}
          position={[0, -1.25, 0]}
        >
          <meshStandardMaterial
            color="#111827"
            metalness={0.55}
            roughness={0.32}
          />
        </RoundedBox>
        <mesh position={[0, -1.08, -0.55]} rotation={[-0.05, 0, 0]}>
          <boxGeometry args={[1.8, 0.08, 0.75]} />
          <meshStandardMaterial color="#26334a" />
        </mesh>
      </group>
    </Float>
  );
}
function CameraApproach({ approaching }: { approaching: boolean }) {
  const { camera } = useThree();
  useFrame(() => {
    const target = approaching
      ? new THREE.Vector3(0, 1.25, 3.2)
      : new THREE.Vector3(4.8, 2.3, 6.2);
    camera.position.lerp(target, approaching ? 0.055 : 0.02);
    camera.lookAt(0, 0.5, 0);
  });
  return null;
}
export function ThreeScene({ onMonitorClick }: { onMonitorClick: () => void }) {
  const [approaching, setApproaching] = useState(false);
  const selectMonitor = () => {
    if (approaching) return;
    setApproaching(true);
    onMonitorClick();
  };
  return (
    <Canvas
      fallback={
        <div className="grid h-full place-items-center rounded-2xl border border-[var(--line)] bg-[#0b101b] p-8 text-center text-sm text-[var(--muted)]">
          La escena 3D no está disponible en este dispositivo.
          <br />
          <a
            className="mt-3 inline-block text-[var(--mint)] underline"
            href="/portfolio"
          >
            Abrir portafolio clásico
          </a>
        </div>
      }
      camera={{ position: [4.8, 2.3, 6.2], fov: 38 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#080b12"]} />
      <ambientLight intensity={0.65} />
      <spotLight
        position={[3, 5, 4]}
        intensity={80}
        angle={0.35}
        penumbra={1}
        color="#78a9ff"
      />
      <pointLight position={[-4, 1, 1]} intensity={18} color="#7ce3c3" />
      <CameraApproach approaching={approaching} />
      <Computer approaching={approaching} onSelect={selectMonitor} />
      <Environment preset="city" />
      <OrbitControls
        enablePan={false}
        minDistance={4}
        maxDistance={9}
        maxPolarAngle={Math.PI / 2.1}
        enabled={!approaching}
      />
    </Canvas>
  );
}
