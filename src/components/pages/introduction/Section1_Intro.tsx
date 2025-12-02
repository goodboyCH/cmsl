"use client";
import React from 'react';
import { ParticleNetwork } from '@/components/interactive/ParticleNetwork';
import { TechText } from '@/components/ui/TechText';
import { GravityKeywords } from '@/components/interactive/GravityKeywords';
import { motion } from 'framer-motion';

// Props를 명확하게 받습니다.
export function Section1_Intro({ missionKor, missionEng }: { missionKor: string, missionEng: string }) {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden border-b border-white/10 bg-black">
      
      {/* 3D 배경 */}
      <div className="absolute inset-0 z-0">
        <ParticleNetwork />
      </div>

      {/* 텍스트 컨텐츠 */}
      <div className="relative z-10 text-center px-4 max-w-6xl mix-blend-difference pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-tight text-white">
             {/* TechText를 이용해 멋지게 등장 */}
            <TechText text={missionKor} />
          </h1>
          <p className="text-lg md:text-2xl text-cyan-400/80 font-mono tracking-widest uppercase">
            {missionEng}
          </p>
        </motion.div>
      </div>

      {/* 물리 엔진 인터랙티브 존 */}
      <div className="absolute bottom-0 w-full z-20 h-[35vh]">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[10px] md:text-xs text-gray-600 animate-pulse tracking-[0.2em] uppercase">
            Interactive Zone • Drag Elements
         </div>
         <GravityKeywords />
      </div>
    </section>
  );
}