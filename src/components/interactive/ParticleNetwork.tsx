"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

function Stars(props: any) {
  const ref = useRef<any>();
  
  // 📉 [최적화 1] 파티클 개수: 5000개 -> 1200개 (충분히 밀도감 있음)
  const sphere = useMemo(() => random.inSphere(new Float32Array(1200), { radius: 1.5 }), []);

  useFrame((state, delta) => {
    // 📉 [최적화 2] 델타값 제한: 렉 걸려서 delta가 튈 때 회전이 확 돌아가는 것 방지
    if (delta < 0.1 && ref.current) {
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#a1a1aa"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8} // 투명도 추가로 겹칠 때 부하 감소
        />
      </Points>
    </group>
  );
}

export function ParticleNetwork() {
  return (
    <div className="absolute inset-0 z-0 bg-black pointer-events-none">
      {/* 📉 [최적화 3] dpr=[1, 1.5]: 고해상도 모니터에서도 최대 1.5배까지만 렌더링 */}
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 1.5]} gl={{ antialias: false }}>
        <Stars />
      </Canvas>
    </div>
  );
}