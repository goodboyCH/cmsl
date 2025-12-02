"use client";
import { useScrollytelling } from '@bsmnt/scrollytelling';
import { gsap } from 'gsap';
import React, { useLayoutEffect, useRef } from 'react';

export function Section1_Intro({ content }: { content: any }) {
  const { timeline } = useScrollytelling();
  const sectionRef = useRef<HTMLDivElement>(null);

  // (악보 설정 동일)
  const startTime = 0.0; 
  const endTime = 0.5; 
  const sectionDuration = endTime - startTime; 
  const sectionHeight = `${sectionDuration * 100}vh`; 

  useLayoutEffect(() => {
    if (!timeline || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      // videoElement 관련 코드는 제거하거나 주석 처리
      const textElement = sectionRef.current?.querySelector('.section1-text');
      if (!textElement) return;

      // 텍스트 애니메이션 (동일)
      timeline.set(textElement, { opacity: 1, y: 0 }, startTime);
      timeline.to(textElement, { opacity: 0, y: -30, duration: 0.1 }, endTime - 0.1);

    }, sectionRef.current);
    return () => ctx.revert();
  }, [timeline, sectionDuration, startTime, endTime]); 

  return (
    <div ref={sectionRef} className="relative" style={{ height: sectionHeight }}>
      {/* Change: bg-transparent 적용 
         배경 비디오 div는 제거하거나 주석 처리하여 
         뒤쪽의 3D Liquid Metal이 보이게 합니다.
      */}
      <div className="sticky top-0 h-screen bg-transparent flex flex-col justify-center items-center text-white text-center">
        
        {/* 기존 Video 배경 제거 (혹은 주석 처리) */}
        {/* <div className="section1-video absolute inset-0 z-0">
          <video ... />
        </div> 
        */}

        <div className="section1-text z-10 p-8 rounded-2xl backdrop-blur-sm bg-black/10 border border-white/10 shadow-2xl">
          <h1 className="text-5xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-gray-400">
            {content.korean_mission}
          </h1>
          <p className="text-lg md:text-2xl mt-4 text-slate-200">
            "{content.english_mission}"
          </p>
        </div>
      </div>
    </div>
  );
}