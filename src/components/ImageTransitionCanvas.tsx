import React, { useRef } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { useTexture, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { MotionValue } from 'framer-motion';

// 1. GLSL 셰이더 코드 (변경 없음)
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTexture1;
  uniform sampler2D uTexture2;
  uniform sampler2D uDisp;
  uniform float uProgress; // 0.0 -> 1.0

  void main() {
    vec2 uv = vUv;
    vec4 disp = texture2D(uDisp, uv);
    
    vec2 distortedPosition1 = vec2(uv.x + uProgress * (disp.r - 0.5) * 0.5, uv.y);
    vec2 distortedPosition2 = vec2(uv.x - (1.0 - uProgress) * (disp.r - 0.5) * 0.5, uv.y);

    vec4 texture1 = texture2D(uTexture1, distortedPosition1);
    vec4 texture2 = texture2D(uTexture2, distortedPosition2);

    gl_FragColor = mix(texture1, texture2, uProgress);
  }
`;

// 2. 셰이더를 Material로 변환 (변경 없음)
const ImageMorphMaterial = shaderMaterial(
  {
    uProgress: 0.0,
    uTexture1: new THREE.Texture(),
    uTexture2: new THREE.Texture(),
    uDisp: new THREE.Texture(),
  },
  vertexShader,
  fragmentShader
);

// 3. react-three-fiber에 커스텀 셰이더 등록
extend({ ImageMorphMaterial });

// 4. TypeScript가 'imageMorphMaterial' 태그를 인식하도록 타입 선언
declare global {
  namespace JSX {
    interface IntrinsicElements {
      imageMorphMaterial: any; // any로 처리하여 타입 오류 해결
    }
  }
}

// 5. React 컴포넌트
interface ImagePlaneProps {
  images: THREE.Texture[];
  dispTexture: THREE.Texture;
  scrollProgress: MotionValue<number>;
  scrollStops: number[]; 
}

function ImagePlane({ images, dispTexture, scrollProgress, scrollStops }: ImagePlaneProps) {
  const materialRef = useRef<any>();
  
  images.forEach(tex => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  });
  dispTexture.wrapS = dispTexture.wrapT = THREE.RepeatWrapping;

  useFrame(() => {
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
      <imageMorphMaterial 
        ref={materialRef} 
        uDisp={dispTexture}
        uTexture1={images[0]}
        uTexture2={images[1] || images[0]} 
      />
    </mesh>
  );
}

// 6. 캔버스 설정 컴포넌트
interface ImageTransitionCanvasProps {
  scrollProgress: MotionValue<number>;
  imageUrls: string[];
  scrollStops: number[];
}

export function ImageTransitionCanvas({ scrollProgress, imageUrls, scrollStops }: ImageTransitionCanvasProps) {
  // 텍스처 로드 (변위 맵 경로는 public 폴더 기준)
  const textures = useTexture(imageUrls);
  
  // 7. (중요) 파일 확장자를 .jpg로 수정
 // const dispTexture = useTexture('/textures/displacement-1.jpg');
  const dispTexture = useTexture('/images/logo1.png');
  return (
    <Canvas camera={{ position: [0, 0, 1], fov: 50 }}>
      <ImagePlane 
        images={textures} 
        dispTexture={dispTexture} 
        scrollProgress={scrollProgress}
        scrollStops={scrollStops}
      />
    </Canvas>
  );
}