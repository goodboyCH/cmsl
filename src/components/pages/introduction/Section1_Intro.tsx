"use client";
import React, { Suspense, lazy } from 'react';
import  BlurText  from '@/components/reactbits/BlurText';
import ColorBends from '@/components/reactbits/ColorBends';
  

export function Section1_Intro({ missionKor, missionEng }: { missionKor: string, missionEng: string }) {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black border-b border-white/10">
      
      {/* 1. 배경: ColorBends (유동적 그라데이션) */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="w-full h-full bg-black" />}>
           <ColorBends 
             // 🎨 연구실 테마 컬러 팔레트 (Cyan, Slate, Deep Blue)
             colors={['#06b6d4', '#334155', '#0891b2']}
             speed={0.6}       // 천천히 우아하게 움직임
             rotation={130}      // 대각선 흐름
             scale={1}
             frequency={1}
             mouseInfluence={1}        // 큼직한 패턴
             warpStrength={1} // 적당한 왜곡 (액체 느낌)
             parallax={0.6}
             noise={0.08}
             transparent // 배경을 꽉 채움
           />
        </Suspense>
      </div>

      {/* 오버레이: 글자 가독성을 위해 어둡게 처리 */}
      {/* ColorBends가 너무 밝을 수 있으므로 검정 그라데이션을 씌웁니다 */}
      <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-0 pointer-events-none" />

      {/* 2. 텍스트: BlurText 적용 */}
      <div className="relative z-10 text-center px-6 max-w-7xl">
        {/* 한글 미션 */}
        <div className="mb-8 mix-blend-screen"> {/* 배경과 예쁘게 섞이도록 블렌드 모드 사용 */}
           <BlurText
             text={missionKor}
             delay={50}
             animateBy="words"
             direction="bottom"
             className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-tight"
           />
        </div>
          
        {/* 영문 미션 */}
        <BlurText
          text={missionEng}
          delay={30}
          animateBy="words"
          direction="top"
          className="text-lg md:text-2xl text-cyan-200/80 tracking-wide font-medium max-w-4xl mx-auto"
        />
      </div>

    </section>
  );
}