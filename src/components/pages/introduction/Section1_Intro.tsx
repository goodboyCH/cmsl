"use client";
import React from 'react';
import { ParticleNetwork } from '@/components/interactive/ParticleNetwork';
import { TechText } from '@/components/ui/TechText';
import { GravityKeywords } from '@/components/interactive/GravityKeywords';
import { motion } from 'framer-motion';

export function Section1_Intro({ content }: { content: any }) {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden border-b border-white/10">
      
      {/* 1. 배경: 3D 파티클 네트워크 */}
      <div className="absolute inset-0 z-0">
        <ParticleNetwork />
      </div>

      {/* 2. 메인 텍스트: 디코딩 효과 */}
      <div className="relative z-10 text-center px-4 max-w-6xl mix-blend-difference pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-tight">
            <TechText text={content.korean_mission} />
          </h1>
          <p className="text-lg md:text-2xl text-cyan-400/80 font-mono tracking-widest uppercase">
            {content.english_mission}
          </p>
        </motion.div>
      </div>

      {/* 3. 하단 인터랙티브 존: 물리 엔진 키워드 */}
      {/* 사용자가 직접 던지고 놀 수 있는 영역 */}
      <div className="absolute bottom-0 w-full z-20 h-[35vh]">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 text-xs text-gray-600 animate-pulse">
            INTERACTIVE ZONE
         </div>
         <GravityKeywords />
      </div>
    </section>
  );
}