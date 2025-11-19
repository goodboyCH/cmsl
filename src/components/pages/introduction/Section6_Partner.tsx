"use client";
import { useScrollytelling } from '@bsmnt/scrollytelling';
import { gsap } from 'gsap';
import React, { useLayoutEffect, useRef } from 'react';

export function Section6_Partner({ content }: { content: any }) {
  const { timeline } = useScrollytelling();
  const sectionRef = useRef<HTMLDivElement>(null);

  // '악보' 시점
  const startTime = 20.5; // 25.5 -> 26.5
  const duration = 0.5; // 1.0 (100vh) (동일)
  const sectionHeight = `${duration * 100}vh`; // "100vh"

  const logos = content.logos || [];

  useLayoutEffect(() => {
    // (GSAP 로직은 동일하게 유지됩니다. 수정 필요 없음)
    if (!timeline || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      const logoContainer = sectionRef.current?.querySelector('.logo-container');
      if (!logoContainer) return;
      timeline.fromTo(
        logoContainer,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: duration },
        startTime
      );
    }, sectionRef.current);
    return () => ctx.revert();
  }, [timeline, duration, startTime]);

  return (
    // 1. 'sticky'를 제거하고, '악보'에서 계산된 '높이(height)'를 할당
    <div ref={sectionRef} className="relative" style={{ height: sectionHeight }}>
      {/* 2. '소품'(Visuals)들만 'sticky'를 사용해 화면에 고정 */}
      <div className="sticky top-0 h-screen flex flex-col justify-center items-center p-8 bg-background">
        <div className="logo-container w-full max-w-4xl">
          <h3 className='text-xl md:text-2xl font-bold text-muted-foreground text-center mb-12'>
            Key Partners
          </h3>
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
    </div>
  );
}