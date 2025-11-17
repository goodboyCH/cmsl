"use client";
import { useScrollytelling } from '@bsmnt/scrollytelling';
import { gsap } from 'gsap';
import React, { useLayoutEffect, useRef } from 'react';

export function Section1_Intro({ content }: { content: any }) {
  const { timeline } = useScrollytelling();
  const sectionRef = useRef<HTMLDivElement>(null);

  // --- '새 악보' (2350%) 적용 ---
  const startTime = 0.0; 
  const endTime = 0.5; 
  const sectionDuration = endTime - startTime; // 0.5 (50vh)
  const sectionHeight = `${sectionDuration * 100}vh`; // "50vh"
  // --- '새 악보' 적용 ---

  useLayoutEffect(() => {
    if (!timeline || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      // (변수 선언 동일)
      const videoElement = sectionRef.current?.querySelector('.section1-video');
      const textElement = sectionRef.current?.querySelector('.section1-text');
      if (!videoElement || !textElement) return;

      // 비디오 패럴랙스 (0%~5% 동안 실행)
      timeline.fromTo(videoElement, { yPercent: 0 }, { yPercent: -20, duration: sectionDuration }, startTime);
      
      // 텍스트를 '스크롤 0% 시점'에 즉시 보이게
      timeline.set(textElement, { opacity: 1, y: 0 }, startTime);

      // 텍스트가 5% 지점에서 '사라지도록' 등록
      timeline.to(textElement, { opacity: 0, y: -30, duration: 0.1 }, endTime - 0.1); // 0.4에서 0.5 사이에 사라짐

    }, sectionRef.current);
    return () => ctx.revert();
  }, [timeline, sectionDuration, startTime, endTime]); 

  return (
    <div ref={sectionRef} className="relative" style={{ height: sectionHeight }}>
      <div className="sticky top-0 h-screen">
        <div className="section1-video absolute inset-0 z-0">
          <video
            className="w-full h-full object-cover opacity-40"
            src={content.video_url}
            autoPlay loop muted playsInline
          />
        </div>
        <div className="relative z-10 w-full h-full flex flex-col justify-center items-center text-white text-center">
          <div className="section1-text">
            <h1 className="text-5xl md:text-8xl font-bold">{content.korean_mission}</h1>
            <p className="text-lg md:text-2xl mt-4">"{content.english_mission}"</p>
          </div>
        </div>
      </div>
    </div>
  );
}