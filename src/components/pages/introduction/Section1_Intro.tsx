"use client";
// 1. Level 2에 필요한 훅과 gsap을 임포트합니다.
import { useScrollytelling } from '@bsmnt/scrollytelling';
import { gsap } from 'gsap';
import React, { useLayoutEffect, useRef } from 'react';

// Supabase의 'mission' 객체를 받음
export function Section1_Intro({ content }: { content: any }) {
  // 2. 'Level 2' 훅과 'Scope' ref를 사용합니다.
  const { timeline } = useScrollytelling();
  const sectionRef = useRef<HTMLDivElement>(null);

  // 3. '악보'에 정의된 이 섹션의 마스터 타임라인 시점
  const startTime = 0.0; // 0%
  const endTime = 0.05; // 5%
  const sectionDuration = endTime - startTime; // 5% (0.05)

  // 4. GSAP 애니메이션을 'useLayoutEffect' (또는 useEffect)로 등록
  useLayoutEffect(() => {
    if (!timeline || !sectionRef.current) return;

    // 5. 'Scope'를 지정합니다.
    const ctx = gsap.context(() => {
      // 6. 'Scope' 내부에서 GSAP 대상들을 찾음
      const videoElement = sectionRef.current?.querySelector('.section1-video');
      const textElement = sectionRef.current?.querySelector('.section1-text');

      if (!videoElement || !textElement) return;

      // 7. 비디오 패럴랙스 애니메이션 수정
      timeline.fromTo(
        videoElement,
        { yPercent: 0 }, // from 상태
        { // to 상태
          yPercent: -20, // 5% 지점에 도달할 목표
          duration: sectionDuration // 5% (0.05) 동안 지속
        },
        startTime // 0% 시점에 시작
      );
      
      timeline.fromTo(
        textElement,
        { opacity: 0, y: 30 }, // from 상태
        { // to 상태
          opacity: 1, 
          y: 0,
          duration: sectionDuration - 0.01 // 4% 동안 지속
        },
        0.01 // '악보'대로 1% 시점에 시작
        // (잘못된 5번째 인수를 제거했습니다)
      );

    }, sectionRef.current); // <-- 'Scope' 적용

    return () => ctx.revert();
  }, [timeline, sectionDuration]); // <-- 의존성 배열

  return (
    // '악보' 0% ~ 5% (0.05) 동안 핀(sticky)
    // 9. 'Scope'를 위한 ref를 div에 연결
    <div ref={sectionRef} className="h-screen sticky top-0">
      
      {/* 10. <Animation> 컴포넌트 제거 (배경 비디오) */}
      <div className="section1-video absolute inset-0 z-0">
        <video
          className="w-full h-full object-cover opacity-40"
          src={content.video_url}
          autoPlay loop muted playsInline
        />
      </div>

      {/* 11. <Animation> 컴포넌트 제거 (텍스트) */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center items-center text-white text-center">
        <div className="section1-text"> {/* GSAP이 제어할 래퍼 */}
          <h1 className="text-5xl md:text-8xl font-bold">{content.korean_mission}</h1>
          <p className="text-lg md:text-2xl mt-4">"{content.english_mission}"</p>
        </div>
      </div>
    </div>
  );
}