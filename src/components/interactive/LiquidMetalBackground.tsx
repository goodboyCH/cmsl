"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Float, Stars } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      // 마우스 위치에 따라 약간의 회전 추가 (선택 사항)
      // meshRef.current.rotation.x = t * 0.1;
      // meshRef.current.rotation.y = t * 0.15;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={1.5}>
      <Sphere args={[1, 128, 128]} scale={2.4}>
        <MeshDistortMaterial
          color="#1e293b"    // 금속 베이스 컬러 (진한 남색/회색 계열 추천)
          attach="material"
          distort={0.4}      // 왜곡 정도 (0 ~ 1)
          speed={2}          // 물결 속도
          roughness={0.2}    // 거칠기 (0에 가까울수록 매끄러움)
          metalness={0.9}    // 금속성 (1에 가까울수록 금속 같음)
        />
      </Sphere>
    </Float>
  );
}

export function LiquidMetalBackground() {
  return (
    <div className="absolute inset-0 -z-10 w-full h-full bg-gradient-to-b from-gray-900 via-slate-900 to-black overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        {/* 조명 설정: 금속 질감을 살리기 위해 필수 */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} color="#60a5fa" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#38bdf8" />
        
        {/* 배경에 은은한 별 입자 추가 (미래적인 느낌) */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {/* 메인 오브젝트: 액체 금속 구체 */}
        <AnimatedSphere />
      </Canvas>
    </div>
  );
}