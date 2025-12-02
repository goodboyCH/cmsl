"use client";
import React, { Suspense, lazy } from 'react'; // React 표준 lazy load 사용
import { TechText } from '@/components/ui/TechText';
import { motion } from 'framer-motion';

// React.lazy를 사용하여 동적 임포트 (next/dynamic 대체)
const ParticleNetwork = lazy(() => import('@/components/interactive/ParticleNetwork').then(module => ({ default: module.ParticleNetwork })));
const GravityKeywords = lazy(() => import('@/components/interactive/GravityKeywords').then(module => ({ default: module.GravityKeywords })));

export function Section1_Intro({ missionKor, missionEng }: { missionKor: string, missionEng: string }) {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden border-b border-white/10 bg-black">
      
      {/* 3D 배경: Suspense로 로딩 처리 */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="w-full h-full bg-black" />}>
          <ParticleNetwork />
        </Suspense>
      </div>

      {/* 텍스트 컨텐츠 */}
      <div className="relative z-10 text-center px-4 max-w-6xl mix-blend-difference pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-tight text-white">
            <TechText text={missionKor} />
          </h1>
          <p className="text-lg md:text-2xl text-cyan-400/80 font-mono tracking-widest uppercase">
            {missionEng}
          </p>
        </motion.div>
      </div>

      {/* 물리 엔진 인터랙티브 존 */}
      <div className="absolute bottom-0 w-full z-20 h-[35vh]">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[10px] md:text-xs text-gray-600 animate-pulse tracking-[0.2em] uppercase pointer-events-none">
            Interactive Zone • Drag Elements
         </div>
         <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white/10">Loading Physics...</div>}>
            <GravityKeywords />
         </Suspense>
      </div>
    </section>
  );
}