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
    <div ref={sectionRef} className="relative" style={{ height: sectionHeight }}>
      {/* Change: bg-background 제거 -> bg-transparent 적용 */}
      <div className="sticky top-0 h-screen flex flex-col justify-center items-center p-8 bg-transparent">
        <div className="logo-container w-full max-w-4xl bg-black/20 backdrop-blur-lg p-10 rounded-2xl border border-white/5">
          <h3 className='text-xl md:text-2xl font-bold text-white/80 text-center mb-12'>
            Key Partners
          </h3>
          <div className="flex justify-center items-center gap-8 md:gap-12 flex-wrap">
            {logos.map((logo: any, index: number) => (
              <div key={index}>
                {/* 로고가 어두운 배경에서도 잘 보이도록 brightness/invert 조절 필요할 수 있음 */}
                <img 
                  src={logo.url} 
                  alt={logo.name} 
                  className="h-10 md:h-16 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 invert" 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}