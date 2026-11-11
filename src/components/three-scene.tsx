"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Float,
  OrbitControls,
  RoundedBox,
  ContactShadows,
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
  const [hovered, setHovered] = useState(false);
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
        <RoundedBox
          args={[3.04, 1.84, 0.035]}
          radius={0.1}
          smoothness={4}
          position={[0, 1.25, 0.095]}
        >
          <meshStandardMaterial
            color="#0a101b"
            metalness={0.65}
            roughness={0.24}
          />
        </RoundedBox>
        <mesh
          ref={screen}
          position={[0, 1.25, 0.15]}
          scale={hovered && !approaching ? 1.012 : 1}
          onClick={onSelect}
          onPointerOver={(event) => {
            event.stopPropagation();
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = "default";
          }}
        >
          <planeGeometry args={[2.85, 1.7]} />
          <meshBasicMaterial
            color={approaching ? "#173b78" : hovered ? "#15366d" : "#102a59"}
          />
        </mesh>
        <group position={[0, 1.25, 0.165]} onClick={onSelect}>
          <mesh position={[-0.7, 0.58, 0]}>
            <boxGeometry args={[1.25, 0.035, 0.01]} />
            <meshStandardMaterial
              color="#7ce3c3"
              emissive="#7ce3c3"
              emissiveIntensity={0.9}
            />
          </mesh>
          <mesh position={[-0.82, 0.28, 0]}>
            <boxGeometry args={[0.75, 0.04, 0.01]} />
            <meshStandardMaterial
              color="#78a9ff"
              emissive="#78a9ff"
              emissiveIntensity={0.75}
            />
          </mesh>
          <mesh position={[0.22, 0.12, 0]}>
            <boxGeometry args={[0.9, 0.42, 0.01]} />
            <meshStandardMaterial
              color="#18345b"
              emissive="#204c87"
              emissiveIntensity={0.45}
            />
          </mesh>
          <mesh position={[-0.38, -0.45, 0]}>
            <boxGeometry args={[1.65, 0.025, 0.01]} />
            <meshStandardMaterial
              color="#5273ad"
              emissive="#345b9a"
              emissiveIntensity={0.65}
            />
          </mesh>
        </group>
        <mesh position={[0, -0.45, 0]}>
          <boxGeometry args={[0.35, 1.35, 0.25]} />
          <meshStandardMaterial color="#2b3850" metalness={0.6} />
        </mesh>
        <RoundedBox
          args={[1.5, 0.12, 0.78]}
          radius={0.06}
          smoothness={4}
          position={[0, -1.08, 0]}
        >
          <meshStandardMaterial
            color="#202d43"
            metalness={0.55}
            roughness={0.3}
          />
        </RoundedBox>
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
        <RoundedBox
          args={[3.7, 0.025, 1.65]}
          radius={0.05}
          smoothness={3}
          position={[0.45, -1.1, 0.12]}
        >
          <meshStandardMaterial
            color="#0b111d"
            roughness={0.7}
            metalness={0.08}
          />
        </RoundedBox>
        <mesh position={[0, -1.36, -0.98]}>
          <boxGeometry args={[3.9, 0.018, 0.025]} />
          <meshBasicMaterial color="#376fd0" toneMapped={false} />
        </mesh>
        <mesh position={[1.22, 1.04, 0.13]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshBasicMaterial color="#7ce3c3" toneMapped={false} />
        </mesh>
        <group position={[0.15, -1.08, 0.2]} rotation={[-0.05, 0, 0]}>
          <RoundedBox args={[1.85, 0.06, 0.65]} radius={0.04} smoothness={3}>
            <meshStandardMaterial
              color="#202c42"
              metalness={0.35}
              roughness={0.45}
            />
          </RoundedBox>
          <mesh position={[0, 0.035, 0]}>
            <boxGeometry args={[1.55, 0.012, 0.42]} />
            <meshStandardMaterial color="#52627d" roughness={0.65} />
          </mesh>
          <group position={[-0.68, 0.052, -0.14]}>
            {Array.from({ length: 30 }, (_, index) => (
              <mesh
                key={index}
                position={[
                  (index % 10) * 0.145,
                  0,
                  Math.floor(index / 10) * 0.12,
                ]}
              >
                <boxGeometry args={[0.1, 0.018, 0.07]} />
                <meshStandardMaterial color="#9aa8bd" roughness={0.7} />
              </mesh>
            ))}
          </group>
        </group>
        <Float speed={1.5} rotationIntensity={0.08} floatIntensity={0.06}>
          <RoundedBox
            args={[0.38, 0.12, 0.62]}
            radius={0.08}
            smoothness={4}
            position={[1.55, -1.03, 0.18]}
            rotation={[0, -0.12, 0]}
          >
            <meshStandardMaterial
              color="#26344d"
              metalness={0.45}
              roughness={0.34}
            />
          </RoundedBox>
          <mesh position={[1.55, -0.962, 0.18]} rotation={[0, -0.12, 0]}>
            <boxGeometry args={[0.045, 0.018, 0.12]} />
            <meshStandardMaterial color="#9aabc2" roughness={0.5} />
          </mesh>
          <mesh position={[1.55, -0.962, 0.04]} rotation={[0, -0.12, 0]}>
            <boxGeometry args={[0.025, 0.012, 0.16]} />
            <meshStandardMaterial
              color="#5274af"
              emissive="#345b9a"
              emissiveIntensity={0.4}
            />
          </mesh>
        </Float>
      </group>
    </Float>
  );
}
function CameraApproach({ approaching }: { approaching: boolean }) {
  const { camera, size } = useThree();
  useFrame(({ clock }) => {
    if (typeof document !== "undefined" && document.hidden) return;
    const ambient = clock.elapsedTime;
    const mobile = size.width < 640;
    const target = approaching
      ? new THREE.Vector3(0, 1.25, mobile ? 3.7 : 3.2)
      : new THREE.Vector3(
          (mobile ? 3.8 : 4.8) + Math.sin(ambient * 0.22) * 0.12,
          (mobile ? 2.5 : 2.3) + Math.sin(ambient * 0.3) * 0.04,
          (mobile ? 7.3 : 6.2) + Math.cos(ambient * 0.22) * 0.1,
        );
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
      dpr={[1, 1.25]}
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
      <pointLight
        position={[0, 1.25, 0.2]}
        intensity={approaching ? 14 : 4.5}
        distance={4}
        color="#467dff"
      />
      <mesh position={[0, -1.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 12]} />
        <meshStandardMaterial
          color="#070a11"
          roughness={0.82}
          metalness={0.12}
        />
      </mesh>
      <mesh position={[0, 1.2, -1.8]}>
        <planeGeometry args={[14, 6]} />
        <meshStandardMaterial
          color="#0c121d"
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>
      <mesh position={[-3.1, 0, -1.65]}>
        <boxGeometry args={[0.025, 2.8, 0.025]} />
        <meshBasicMaterial color="#3569c7" />
      </mesh>
      <mesh position={[2.7, 0.15, -1.65]}>
        <boxGeometry args={[0.018, 1.35, 0.018]} />
        <meshBasicMaterial color="#3caa91" toneMapped={false} />
      </mesh>
      <ContactShadows
        position={[0, -1.36, 0]}
        opacity={0.5}
        scale={8}
        blur={2.4}
        far={4}
        color="#000000"
      />
      <CameraApproach approaching={approaching} />
      <Computer approaching={approaching} onSelect={selectMonitor} />
      <Environment preset="city" />
      <OrbitControls
        enablePan={false}
        minDistance={4}
        maxDistance={9}
        target={[0, 0.25, 0]}
        minPolarAngle={Math.PI / 3.8}
        maxPolarAngle={Math.PI / 2.1}
        enabled={!approaching}
      />
    </Canvas>
  );
}
