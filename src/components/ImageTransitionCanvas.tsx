import React, { useRef } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { useTexture, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { MotionValue } from 'framer-motion';

// 1. GLSL 셰이더 코드 (Vertex 셰이더는 변경 없음)
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// --- ⬇️ 2. Fragment 셰이더를 '단순 페이드'로 변경 ⬇️ ---
const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTexture1;
  uniform sampler2D uTexture2;
  uniform float uProgress; // 0.0 -> 1.0

  void main() {
    vec4 texture1 = texture2D(uTexture1, vUv);
    vec4 texture2 = texture2D(uTexture2, vUv);
    
    // 모핑(displacement) 로직을 제거하고, mix() 함수로 단순 교차 페이드
    gl_FragColor = mix(texture1, texture2, uProgress);
  }
`;
// --- ⬆️ 수정 완료 ⬆️ ---

// --- ⬇️ 3. Material에서 uDisp (변위 맵) 제거 ⬇️ ---
const ImageFadeMaterial = shaderMaterial(
  {
    uProgress: 0.0,
    uTexture1: new THREE.Texture(),
    uTexture2: new THREE.Texture(),
    // uDisp: new THREE.Texture(), // 변위 맵 제거
  },
  vertexShader,
  fragmentShader
);
// --- ⬆️ 수정 완료 ⬆️ ---

// 4. react-three-fiber에 새 셰이더 등록
extend({ ImageFadeMaterial });

// 5. TypeScript가 새 태그를 인식하도록 타입 선언
declare global {
  namespace JSX {
    interface IntrinsicElements {
      imageFadeMaterial: any; // 새 이름으로 변경
    }
  }
}

// 6. React 컴포넌트
interface ImagePlaneProps {
  images: THREE.Texture[];
  // dispTexture 제거
  scrollProgress: MotionValue<number>;
  scrollStops: number[]; 
}

function ImagePlane({ images, scrollProgress, scrollStops }: ImagePlaneProps) {
  const materialRef = useRef<any>();
  
  images.forEach(tex => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  });
  // dispTexture.wrapS 제거

  useFrame(() => {
    // (useFrame 내부 로직은 변경 없음)
    const totalProgress = scrollProgress.get();
    let currentStopIndex = scrollStops.findIndex(stop => totalProgress <= stop);
    if (currentStopIndex === -1) currentStopIndex = scrollStops.length - 1; 
    const prevStop = currentStopIndex === 0 ? 0 : scrollStops[currentStopIndex - 1];
    const currentStop = scrollStops[currentStopIndex];
    const localProgress = (totalProgress - prevStop) / (currentStop - prevStop);
    const textureIndex1 = currentStopIndex % images.length;
    const textureIndex2 = (currentStopIndex + 1) % images.length;

    if (materialRef.current) {
      materialRef.current.uniforms.uTexture1.value = images[textureIndex1];
      materialRef.current.uniforms.uTexture2.value = images[textureIndex2];
      materialRef.current.uniforms.uProgress.value = localProgress;
    }
  });

  return (
    <mesh>
      <planeGeometry args={[1, 1, 32, 32]} />
      {/* --- ⬇️ 7. 태그 이름을 imageFadeMaterial로 변경 ⬇️ --- */}
      <imageFadeMaterial 
        ref={materialRef} 
        // uDisp 제거
        uTexture1={images[0]}
        uTexture2={images[1] || images[0]} 
      />
    </mesh>
  );
}

// 8. 캔버스 설정 컴포넌트
interface ImageTransitionCanvasProps {
  scrollProgress: MotionValue<number>;
  imageUrls: string[];
  scrollStops: number[];
}

export function ImageTransitionCanvas({ scrollProgress, imageUrls, scrollStops }: ImageTransitionCanvasProps) {
  const textures = useTexture(imageUrls);
  
  // --- ⬇️ 9. 변위 맵(displacement-1.jpg) 로드 제거 ⬇️ ---
  // const dispTexture = useTexture('/textures/displacement-1.jpg');
  // --- ⬆️ 수정 완료 ⬆️ ---

  return (
    <Canvas camera={{ position: [0, 0, 1], fov: 50 }}>
      <ImagePlane 
        images={textures} 
        // dispTexture 제거
        scrollProgress={scrollProgress}
        scrollStops={scrollStops}
      />
    </Canvas>
  );
}