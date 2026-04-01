import { useRef, useEffect, useMemo, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

/* ── Region data ── */
export const REGION_NAMES = [
  "Visual Cortex",
  "Prefrontal Cortex",
  "Amygdala",
  "Language Network",
  "Fusiform Face Area",
];

const REGION_NORM: Record<string, [number, number, number]> = {
  "Visual Cortex": [0, 0.1, -0.92],
  "Prefrontal Cortex": [0, 0.32, 0.88],
  Amygdala: [0.52, -0.28, 0.12],
  "Language Network": [-0.58, 0.12, -0.12],
  "Fusiform Face Area": [0.42, -0.48, -0.32],
};

export interface RegionScreenData {
  name: string;
  x: number;
  y: number;
  visibility: number;
}

/* ── Procedural brain geometry ── */
function smoothstep(a: number, b: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function createBrainGeometry(): THREE.BufferGeometry {
  const geo = new THREE.IcosahedronGeometry(1, 5);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.set(pos.getX(i), pos.getY(i), pos.getZ(i));
    const n = v.clone().normalize();
    let r = 1.0;
    r += Math.sin(n.x * 5.1 + n.y * 3.7) * Math.cos(n.z * 4.3) * 0.04;
    r += Math.sin(n.y * 7.3 + n.z * 5.9) * Math.cos(n.x * 6.1) * 0.03;
    r += Math.sin(n.z * 9.7 + n.x * 8.3) * Math.cos(n.y * 7.7) * 0.02;
    r += Math.sin(n.x * 14.1 + n.y * 12.3 + n.z * 11.7) * 0.012;
    r += Math.sin(n.x * 21.0 + n.z * 18.0) * Math.cos(n.y * 16.0) * 0.008;
    let sx = 1.15, sy = 0.84, sz = 1.08;
    if (n.y < -0.3) sy -= ((-0.3 - n.y) / 0.7) * 0.22;
    if (n.y < -0.05 && n.z < -0.25)
      r += Math.max(0, (-n.z - 0.25) / 0.75) * Math.max(0, (-n.y - 0.05) / 0.95) * 0.09;
    let px = n.x * r * sx;
    let py = n.y * r * sy;
    const pz = n.z * r * sz;
    if (n.y > 0.05)
      py -= Math.exp(-n.x * n.x * 55) * smoothstep(0.05, 0.55, n.y) * 0.11;
    if (Math.abs(n.x) > 0.5 && n.y < 0.1)
      px += Math.sign(n.x) * ((Math.abs(n.x) - 0.5) / 0.5) * 0.04;
    pos.setXYZ(i, px, py, pz);
  }
  geo.computeVertexNormals();
  return geo;
}

/* ── GLSL ── */
const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPosition = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uActivations[5];
  uniform vec3  uRegionCenters[5];
  uniform float uRegionSigns[5];
  uniform float uColorScheme;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  vec3 warmRamp(float t) {
    t = clamp(t, 0.0, 1.0);
    if (t < 0.30) return mix(vec3(0.0), vec3(0.545, 0.0, 0.0), t / 0.30);
    if (t < 0.60) return mix(vec3(0.545, 0.0, 0.0), vec3(1.0, 0.27, 0.0), (t - 0.30) / 0.30);
    if (t < 0.85) return mix(vec3(1.0, 0.27, 0.0), vec3(1.0, 0.667, 0.0), (t - 0.60) / 0.25);
    return mix(vec3(1.0, 0.667, 0.0), vec3(1.0, 0.96, 0.75), (t - 0.85) / 0.15);
  }
  vec3 coolRamp(float t) {
    t = clamp(t, 0.0, 1.0);
    if (t < 0.30) return mix(vec3(0.0), vec3(0.0, 0.22, 0.38), t / 0.30);
    if (t < 0.60) return mix(vec3(0.0, 0.22, 0.38), vec3(0.0, 0.6, 0.67), (t - 0.30) / 0.30);
    return mix(vec3(0.0, 0.6, 0.67), vec3(0.27, 1.0, 0.87), (t - 0.60) / 0.40);
  }

  void main() {
    vec3 base = vec3(0.831, 0.816, 0.80);
    float ao = 0.60 + 0.40 * (dot(vNormal, vec3(0.0, 1.0, 0.0)) * 0.5 + 0.5);
    float diff = max(dot(vNormal, normalize(vec3(1.0, 1.5, 1.0))), 0.0);
    float fill = max(dot(vNormal, normalize(vec3(-0.5, -0.3, 0.8))), 0.0) * 0.15;
    base *= ao * (0.35 + 0.55 * diff + fill);
    vec3 vd = normalize(cameraPosition - vWorldPosition);
    base += vec3(0.04, 0.06, 0.09) * pow(1.0 - max(dot(vNormal, vd), 0.0), 3.0);

    float peakI = 0.0;
    vec3 peakC = vec3(0.0);
    for (int i = 0; i < 5; i++) {
      float d = distance(vWorldPosition, uRegionCenters[i]);
      float falloff = smoothstep(0.55, 0.044, d);
      float pulse = 1.0 + 0.15 * sin(uTime * 2.0 + float(i) * 1.257);
      float intensity = clamp(uActivations[i] * pulse, 0.0, 1.0) * falloff;
      if (intensity > peakI) {
        peakI = intensity;
        if (uColorScheme > 1.5) {
          peakC = uRegionSigns[i] >= 0.0 ? warmRamp(intensity) : coolRamp(intensity);
        } else if (uColorScheme > 0.5) {
          peakC = coolRamp(intensity);
        } else {
          peakC = warmRamp(intensity);
        }
      }
    }
    gl_FragColor = vec4(base + peakC * smoothstep(0.0, 0.04, peakI), 1.0);
  }
`;

/* ── Inner scene ── */
function BrainScene({
  activationData,
  colorScheme,
  hoveredRegion,
  onRegionUpdate,
}: {
  activationData: Record<string, number>;
  colorScheme: "warm" | "cool" | "delta";
  hoveredRegion: string | null;
  onRegionUpdate?: (r: RegionScreenData[]) => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const onUpdateRef = useRef(onRegionUpdate);
  onUpdateRef.current = onRegionUpdate;

  // Keep latest props in refs so useFrame always reads fresh values
  const activationDataRef = useRef(activationData);
  activationDataRef.current = activationData;
  const hoveredRegionRef = useRef(hoveredRegion);
  hoveredRegionRef.current = hoveredRegion;

  // Per-region smooth boost (0 → 0.3 when hovered, back to 0 when not)
  const smoothBoost = useRef(new Array(5).fill(0));

  const { brainMesh, shaderMat, regionCenters } = useMemo(() => {
    const geo = createBrainGeometry();
    const tmp = new THREE.Mesh(geo);
    const box = new THREE.Box3().setFromObject(tmp);
    const center = box.getCenter(new THREE.Vector3());
    const half = box.getSize(new THREE.Vector3()).multiplyScalar(0.5);
    const rc = REGION_NAMES.map((name) => {
      const [nx, ny, nz] = REGION_NORM[name];
      return new THREE.Vector3(center.x + nx * half.x, center.y + ny * half.y, center.z + nz * half.z);
    });
    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uActivations: { value: new Array(5).fill(0) },
        uRegionCenters: { value: rc },
        uRegionSigns: { value: new Array(5).fill(1) },
        uColorScheme: { value: 0 },
      },
    });
    return { brainMesh: new THREE.Mesh(geo, mat), shaderMat: mat, regionCenters: rc };
  }, []);

  // Update signs and color scheme when props change
  useEffect(() => {
    const u = shaderMat.uniforms;
    u.uRegionSigns.value = REGION_NAMES.map((n) => (activationData[n] ?? 0) >= 0 ? 1.0 : -1.0);
    u.uColorScheme.value = colorScheme === "warm" ? 0 : colorScheme === "cool" ? 1 : 2;
  }, [activationData, colorScheme, shaderMat]);

  useFrame(({ camera, clock }, delta) => {
    const u = shaderMat.uniforms;
    u.uTime.value = clock.elapsedTime;

    if (groupRef.current)
      groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.5) * 0.012;

    // Lerp boost toward target — delta * 5 gives ~200ms rise time
    const lerpFactor = Math.min(1, delta * 5);
    REGION_NAMES.forEach((name, i) => {
      const target = hoveredRegionRef.current === name ? 0.3 : 0;
      smoothBoost.current[i] += (target - smoothBoost.current[i]) * lerpFactor;
    });

    // Effective activations: base + smooth boost, clamped at 1.0
    u.uActivations.value = REGION_NAMES.map((n, i) =>
      Math.min(1, Math.abs(activationDataRef.current[n] ?? 0) + smoothBoost.current[i])
    );

    // Project region positions to screen for floating labels
    if (onUpdateRef.current) {
      const regions = regionCenters.map((pos, i) => {
        const wp = pos.clone();
        if (groupRef.current) wp.y += groupRef.current.position.y;
        const toCamera = camera.position.clone().sub(wp).normalize();
        const normal = wp.clone().normalize();
        const dot = toCamera.dot(normal);
        const visibility = Math.max(0, Math.min(1, (dot + 0.05) / 0.55));
        const proj = wp.clone().project(camera);
        return {
          name: REGION_NAMES[i],
          x: (proj.x + 1) / 2,
          y: (1 - proj.y) / 2,
          visibility,
        };
      });
      onUpdateRef.current(regions);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, -0.08, -0.3]} scale={[0.88, 1.12, 0.92]}>
        <sphereGeometry args={[1, 28, 28]} />
        <meshBasicMaterial color="#0a0a0a" transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#000" metalness={0.92} roughness={0.28} transparent opacity={0.25} />
      </mesh>
      <primitive object={brainMesh} />
    </group>
  );
}

/* ── Props ── */
export interface Brain3DProps {
  activationData: Record<string, number>;
  colorScheme: "warm" | "cool" | "delta";
  hoveredRegion: string | null;
  onRegionUpdate?: (r: RegionScreenData[]) => void;
}

export default function Brain3D({ activationData, colorScheme, hoveredRegion, onRegionUpdate }: Brain3DProps) {
  return (
    <div className="w-full h-full" style={{ background: "#000", touchAction: "none" }}>
      <Canvas
        camera={{ position: [0, 0.1, 2.7], fov: 36, near: 0.1, far: 100 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.5} color="#404050" />
        <pointLight position={[3, 5, 4]} intensity={1.8} color="#eef0f8" />
        <directionalLight position={[-3, 1, -2]} intensity={0.3} color="#5566aa" />
        <Suspense fallback={null}>
          <BrainScene
            activationData={activationData}
            colorScheme={colorScheme}
            hoveredRegion={hoveredRegion}
            onRegionUpdate={onRegionUpdate}
          />
        </Suspense>
        <OrbitControls
          enableDamping dampingFactor={0.05}
          enableZoom={false} enablePan={false}
          autoRotate autoRotateSpeed={0.35}
          minPolarAngle={Math.PI * 0.2} maxPolarAngle={Math.PI * 0.8}
        />
      </Canvas>
    </div>
  );
}
