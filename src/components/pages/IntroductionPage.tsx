import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ScrollingFocusSection } from '@/components/ScrollingFocusSection'; 
import { Cpu, Atom, TestTube2, BrainCircuit, Car, Film, HeartPulse, Magnet, Building, Users } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient'; 
import merge from 'lodash/merge'; 
// 1. Canvas, useFrame을 fiber에서 직접 import
import { Canvas, useFrame } from '@react-three/fiber'; 
// 2. useTexture를 drei에서 직접 import
import { useTexture } from '@react-three/drei'; 
import * as THREE from 'three';

// 3. 텍스처를 로드하는 디버깅 큐브
function DebugCubeWithTexture() {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  // 4. (핵심) useTexture 훅을 Suspense 내부에서 직접 테스트합니다.
  // 이 훅이 실패하면 흰 화면이 뜹니다.
  const texture = useTexture('/images/logo1.png'); // 100% 존재하는 파일

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      {/* 5. 로드된 텍스처를 큐브의 map으로 적용합니다. */}
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

// (기본값 객체는 변경 없음)
const pageContentDefault: any = {
  mission: { video_url: "/videos/bg1.mp4", korean_mission: "CMSL", english_mission: "Achieving Predictable Materials Design..." },
  capabilities: { title: "Our Core Capabilities", items: [] },
  research: { title: "Major Research Areas", items: [] },
  impact: { title: "Our Impact", items: [], logos: [] }
};

export function IntroductionPage() {
  const [content, setContent] = useState<any>(pageContentDefault);
  const [loading, setLoading] = useState(true);

  // (useEffect는 변경 없음)
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('pages')
        .select('content')
        .eq('page_key', 'introduction')
        .single();
      
      if (error || !data?.content) {
        console.warn('DB에서 소개 페이지 콘텐츠 로딩 실패. 기본값을 사용합니다.', error);
        setContent(pageContentDefault);
      } else {
        const mergedContent = merge({}, pageContentDefault, data.content);
        setContent(mergedContent);
      }
      setLoading(false);
    };
    fetchContent();
  }, []);
  
  const mainContentRef = useRef<HTMLDivElement>(null);
  
  // 6. 모핑 관련 훅들은 잠시 주석 처리 (에러 방지)
  // const { scrollYProgress: contentScrollProgress } = useScroll(...);
  // const imageTransitionUrls = useMemo(...);
  // const scrollStops = useMemo(...);

  // (Hero 비디오 스케일 훅은 그대로 둡니다)
  const { scrollYProgress: missionProgress } = useScroll({ offset: ['start start', 'end start'] });
  const missionBgScale = useTransform(missionProgress, [0, 1], [1, 1.15]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <p>Loading Introduction...</p>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      {/* (Hero 섹션 변경 없음) */}
      <section className="h-screen w-screen flex items-center justify-center relative text-white text-center p-4">
        <motion.div
          className="absolute inset-0 bg-black z-0 overflow-hidden"
          style={{ scale: missionBgScale }}
        >
          <video
            className="w-full h-full object-cover opacity-40"
            src={content?.mission?.video_url} 
            autoPlay loop muted playsInline
          />
        </motion.div>
        <motion.div 
          className="relative z-10 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-shadow-lg">{content?.mission?.korean_mission}</h1>
          <p className="text-lg md:text-2xl text-white/80 font-light text-shadow max-w-xs md:max-w-2xl mx-auto">"{content?.mission?.english_mission}"</p>
        </motion.div>
      </section>

      <div ref={mainContentRef} className="relative"> 
        
        {/* --- ⬇️ 7. 캔버스 래퍼를 DebugCubeWithTexture로 수정 ⬇️ --- */}
        <div className="absolute top-0 left-0 w-full h-screen z-0" style={{ position: 'sticky' }}>
          <Suspense fallback={<div className="w-full h-full bg-muted" />}>
            <Canvas camera={{ position: [0, 0, 2] }}>
              <ambientLight intensity={1.0} /> {/* 텍스처가 보이도록 조명을 밝게 합니다. */}
              <DebugCubeWithTexture />
            </Canvas>
          </Suspense>
        </div>
        {/* --- ⬆️ 수정 완료 ⬆️ --- */}
        
        {/* (스크롤 콘텐츠 변경 없음) */}
        <div className="relative z-10">
          <ScrollingFocusSection 
            sectionTitle={content?.capabilities?.title} 
            items={content?.capabilities?.items || []}
            backgroundColor="bg-transparent"
          />
          <div className="h-96" /> 
          <ScrollingFocusSection 
            sectionTitle={content?.research?.title} 
            items={content?.research?.items || []}
            backgroundColor="bg-transparent"
          />
          <div className="h-96" />
          <ScrollingFocusSection 
            sectionTitle={content?.impact?.title} 
            items={content?.impact?.items || []}
            backgroundColor="bg-transparent"
          />
          <section className="container pb-20 md:pb-32 text-center space-y-8 bg-background">
            <h3 className='text-xl md:text-2xl font-bold text-muted-foreground'>Key Partners</h3>
            <motion.div 
              className="flex justify-center items-center gap-8 md:gap-12 flex-wrap"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ staggerChildren: 0.3 }}
            >
              {(content?.impact?.logos || []).map((logo: any, index: number) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, scale: 0.5 },
                    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }
                  }}
                >
                  <img src={logo.url} alt={logo.name} className="h-10 md:h-16 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
                </motion.div>
              ))}
            </motion.div>
          </section>
        </div>
      </div>
    </div>
  );
}