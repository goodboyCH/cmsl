"use client";
import React, { Suspense } from 'react';
import  BlurText  from '@/components/reactbits/BlurText';
import ColorBends from '@/components/reactbits/ColorBends';
// ✅ 언어 감지를 위해 import
import { useLanguage } from '@/components/LanguageProvider';

export function Section1_Intro({ missionKor, missionEng }: { missionKor: string, missionEng: string }) {

  // 1. 현재 언어 상태 가져오기
  const { language } = useLanguage();

  // 2. 언어에 따라 메인(위, 큼)과 서브(아래, 작음) 텍스트 결정
  const isKo = language === 'ko';

  const mainText = isKo ? missionKor : missionEng; // 한국어면 한글이 메인, 아니면 영어가 메인
  const subText = isKo ? missionEng : missionKor;  // 한국어면 영어가 서브, 아니면 한글이 서브

  // 3. 메인 텍스트 줄바꿈 처리
  const mainLines = mainText.split('\n');

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black border-b border-white/10">

      {/* 배경: ColorBends (변경 없음) */}
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

      {/* 오버레이 (변경 없음) */}
      <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-0 pointer-events-none" />

      {/* 텍스트 영역 (좌측 정렬 유지) */}
      <div className="relative z-10 px-6 max-w-7xl w-full text-left">

        {/* --- 1. 메인 텍스트 (상단, 큼, 흰색) --- */}
        {/* 언어가 바뀌면 key가 바뀌어 애니메이션이 다시 실행되도록 설정 */}
        <div key={language} className="mb-8 mix-blend-screen flex flex-col items-start gap-2 md:gap-4">
           {mainLines.map((line, index) => (
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

        {/* --- 2. 서브 텍스트 (하단, 작음, Cyan) --- */}
        <BlurText
          key={`sub-${language}`} // 서브 텍스트도 언어 변경 시 애니메이션 리셋
          text={subText}
          delay={30}
          animateBy="words"
          direction="top"
          className="text-lg md:text-2xl text-cyan-200/80 tracking-wide font-medium max-w-4xl block mt-4"
        />
      </div>

    </section>
  );
}
