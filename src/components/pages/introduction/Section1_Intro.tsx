"use client";
import { useScrollytelling } from '@bsmnt/scrollytelling';
import { gsap } from 'gsap';
import React, { useLayoutEffect, useRef } from 'react';

export function Section1_Intro({ content }: { content: any }) {
  const { timeline } = useScrollytelling();
  const sectionRef = useRef<HTMLDivElement>(null);

  // '악보' 시점
  const startTime = 0.0; // 0%
  const endTime = 0.05; // 5%
  const sectionDuration = endTime - startTime; // 5% (0.05)
  // '악보' 5% = 1000%의 5% = 50vh '높이'
  const sectionHeight = `${sectionDuration * 1000}vh`; // "50vh"

  useLayoutEffect(() => {
    if (!timeline || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      const videoElement = sectionRef.current?.querySelector('.section1-video');
      const textElement = sectionRef.current?.querySelector('.section1-text');
      if (!videoElement || !textElement) return;

      // 비디오 패럴랙스
      timeline.fromTo(
        videoElement,
        { yPercent: 0 },
        { yPercent: -20, duration: sectionDuration },
        startTime
      );
      // 텍스트 페이드인
      timeline.fromTo(
        textElement,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: sectionDuration - 0.01 },
        0.01
      );
    }, sectionRef.current);
    return () => ctx.revert();
  }, [timeline, sectionDuration, startTime]);

  return (
    // 1. 'sticky'를 제거하고, '악보'에서 계산된 '높이(height)'를 할당
    <div ref={sectionRef} className="relative" style={{ height: sectionHeight }}>
      {/* 2. '소품'(Visuals)들만 'sticky'를 사용해 화면에 고정 */}
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