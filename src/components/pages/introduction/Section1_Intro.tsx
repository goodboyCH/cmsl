"use client";
import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';

// 3D 파티클 배경은 유지 (원하시면 제거 가능)
const ParticleNetwork = lazy(() => import('@/components/interactive/ParticleNetwork').then(module => ({ default: module.ParticleNetwork })));

export function Section1_Intro({ missionKor, missionEng }: { missionKor: string, missionEng: string }) {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden border-b border-white/10 bg-black">
      
      {/* 3D 배경 */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="w-full h-full bg-black" />}>
          <ParticleNetwork />
        </Suspense>
      </div>

      {/* 텍스트 컨텐츠 */}
      {/* z-10으로 배경 위에 배치, font-mono 제거하여 글로벌 폰트 따름 */}
      <div className="relative z-10 text-center px-4 max-w-6xl mix-blend-difference pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1, delay: 0.3 }}
        >
          {/* 한글 미션: 기본 폰트 적용, 두껍고 크게 */}
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-tight text-white">
            {missionKor}
          </h1>
          
          {/* 영문 미션: 기본 폰트 적용, 은은하게 */}
          <p className="text-lg md:text-2xl text-cyan-400/90 tracking-wide font-medium">
            {missionEng}
          </p>
        </motion.div>
      </div>

      {/* 하단 드래그 존(Interactive Zone) 제거됨 */}
      
    </section>
  );
}