import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

function GhostMesh() {
  const ref = useRef<THREE.Mesh>(null!);

  const geo = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(1, 4);
    const pos = g.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.set(pos.getX(i), pos.getY(i), pos.getZ(i));
      const n = v.clone().normalize();
      let r = 1.0;
      r += Math.sin(n.x * 5.1 + n.y * 3.7) * Math.cos(n.z * 4.3) * 0.04;
      r += Math.sin(n.y * 7.3 + n.z * 5.9) * Math.cos(n.x * 6.1) * 0.03;
      r += Math.sin(n.z * 9.7 + n.x * 8.3) * Math.cos(n.y * 7.7) * 0.02;
      let sx = 1.15, sy = 0.84, sz = 1.08;
      if (n.y < -0.3) sy -= ((-0.3 - n.y) / 0.7) * 0.22;
      const px = n.x * r * sx;
      let py = n.y * r * sy;
      const pz = n.z * r * sz;
      if (n.y > 0.05) {
        py -= Math.exp(-n.x * n.x * 55) * Math.max(0, Math.min(1, (n.y - 0.05) / 0.5)) * 0.11;
      }
      pos.setXYZ(i, px, py, pz);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  useFrame(() => {
    ref.current.rotation.y += 0.002;
  });

  return (
    <mesh ref={ref} geometry={geo}>
      <meshStandardMaterial
        color="#c8c8c8"
        roughness={0.8}
        metalness={0.1}
        flatShading
      />
    </mesh>
  );
}

export default function GhostBrain() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.07 }}
    >
      <Canvas
        camera={{ position: [0, 0.4, 5.5], fov: 28 }}
        gl={{ antialias: false, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 3, 4]} intensity={1.2} />
        <Suspense fallback={null}>
          <GhostMesh />
        </Suspense>
      </Canvas>
    </div>
  );
}
