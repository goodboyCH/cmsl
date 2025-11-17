"use client";
// 1. Level 2에 필요한 훅과 gsap을 임포트합니다. (Animation 제거)
import { useScrollytelling } from '@bsmnt/scrollytelling';
import { gsap } from 'gsap';
import React, { useLayoutEffect, useRef } from 'react';

// Supabase의 'impact' 객체 (logos 배열 포함)를 받음
export function Section6_Partner({ content }: { content: any }) {

  // 2. 'Level 2' 훅과 'Scope' ref를 사용합니다.
  const { timeline } = useScrollytelling();
  const sectionRef = useRef<HTMLDivElement>(null);

  // 3. '악보'에 정의된 이 섹션의 마스터 타임라인 시점
  const startTime = 0.90; // 90%
  const duration = 0.10; // 10% (90% ~ 100%)
  const logos = content.logos || [];

  // 4. GSAP 애니메이션을 'useLayoutEffect' (또는 useEffect)로 등록
  useLayoutEffect(() => {
    if (!timeline || !sectionRef.current) return;

    // 5. 'Scope'를 지정합니다.
    const ctx = gsap.context(() => {
      // 6. 'Scope' 내부에서 GSAP 대상들을 찾음
      const logoContainer = sectionRef.current?.querySelector('.logo-container');
      if (!logoContainer) return;

      // 7. (오류 해결) 로고 컨테이너 애니메이션을 '등록'
      timeline.fromTo(
        logoContainer,
        { opacity: 0, y: 50 }, // from 상태
        { // to 상태
          opacity: 1, 
          y: 0,
          duration: duration // 10% (0.1) 동안 지속
        },
        startTime // '악보'대로 90% 시점에 시작
      );

    }, sectionRef.current); // <-- 'Scope' 적용

    return () => ctx.revert();
  }, [timeline, duration, startTime]); // <-- 의존성 배열

  return (
    // 8. 핀(pin) 효과 및 'Scope' ref 연결
    <div ref={sectionRef} className="h-screen sticky top-0 flex flex-col justify-center items-center p-8 bg-background">
      
      {/* 9. <Animation> 컴포넌트 제거 */}
      <div className="logo-container w-full max-w-4xl"> {/* GSAP이 제어할 래퍼 */}
        <h3 className='text-xl md:text-2xl font-bold text-muted-foreground text-center mb-12'>
          Key Partners
        </h3>
        
        {/* 파트너 로고 그리드 (Supabase 데이터 기반) */}
        <div className="flex justify-center items-center gap-8 md:gap-12 flex-wrap">
          {logos.map((logo: any, index: number) => (
            <div key={index}>
              <img 
                src={logo.url} 
                alt={logo.name} 
                className="h-10 md:h-16 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300" 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}