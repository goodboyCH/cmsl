"use client";
import React, { Suspense } from 'react';
import  BlurText  from '@/components/reactbits/BlurText';
import ColorBends from '@/components/reactbits/ColorBends';
  

export function Section1_Intro({ missionKor, missionEng }: { missionKor: string, missionEng: string }) {
  
  // 줄바꿈 문자(\n) 기준으로 텍스트 분리
  const korLines = missionKor.split('\n');

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black border-b border-white/10">
      
      {/* 1. 배경: ColorBends */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="w-full h-full bg-black" />}>
           <ColorBends 
             colors={['#06b6d4', '#0f172a', '#334155', '#000000', '#0891b2']}
             speed={0.6}
             rotation={30}
             scale={1}
             frequency={1}
             mouseInfluence={1}
             warpStrength={1}
             parallax={0.6}
             noise={0.08}
             transparent
           />
        </Suspense>
      </div>

      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-0 pointer-events-none" />

      {/* 2. 텍스트 영역 */}
      {/* ✅ 수정 1: text-center 제거 -> text-left 추가 / w-full 추가하여 왼쪽 정렬 기준 확보 */}
      <div className="relative z-10 px-6 max-w-7xl w-full text-left">
        
        {/* 한글 미션 */}
        {/* ✅ 수정 2: items-center 제거 -> items-start 추가 (왼쪽 정렬) */}
        <div className="mb-8 mix-blend-screen flex flex-col items-start gap-2 md:gap-4"> 
           {korLines.map((line, index) => (
             <BlurText
               key={index}
               text={line}
               delay={50 + (index * 150)}
               animateBy="words"
               direction="bottom"
               className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-tight"
             />
           ))}
        </div>
          
        {/* 영문 미션 */}
        {/* ✅ 수정 3: mx-auto 제거 (왼쪽 정렬 유지) */}
        <BlurText
          text={missionEng}
          delay={30}
          animateBy="words"
          direction="top"
          className="text-lg md:text-2xl text-cyan-200/80 tracking-wide font-medium max-w-4xl block mt-4"
        />
      </div>

    </section>
  );
}