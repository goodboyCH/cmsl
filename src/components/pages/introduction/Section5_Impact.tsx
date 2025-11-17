"use client";
import { useScrollytelling } from '@bsmnt/scrollytelling';
import { gsap } from 'gsap';
import React, { useLayoutEffect, useRef } from 'react';

export function Section5_Impact({ content }: { content: any }) {
  const { timeline } = useScrollytelling();
  const sectionRef = useRef<HTMLDivElement>(null);

  // '악보' 시점
  const startTime = 0.70; // 70%
  const endTime = 0.90; // 90%
  const sectionDuration = endTime - startTime; // 20% (0.20)
  // '악보' 20% = 1000%의 20% = 200vh '높이'
  const sectionHeight = `${sectionDuration * 1000}vh`; // "200vh"

  const items = content.items || [];

  useLayoutEffect(() => {
    // (GSAP 로직은 동일하게 유지됩니다. 수정 필요 없음)
    if (!timeline || !sectionRef.current || items.length === 0) return;
    const ctx = gsap.context(() => {
      const impactCards = gsap.utils.toArray<HTMLElement>('.impact-card', sectionRef.current);
      if (impactCards.length === 0) return;
      
      timeline.fromTo(impactCards, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, stagger: 0.1 }, startTime);
      items.forEach((_, i: number) => {
        const itemHighlightTime = startTime + (i * (sectionDuration / items.length));
        const tl = gsap.timeline();
        tl.to(impactCards, { opacity: 0.3, scale: 0.95, ease: 'power2.inOut' }, 0).to(impactCards[i], { opacity: 1, scale: 1.05, ease: 'power2.inOut' }, 0);
        timeline.add(tl, itemHighlightTime);
      });
      timeline.to(impactCards, { opacity: 1, scale: 1, ease: 'power2.out' }, endTime - (sectionDuration / items.length));
    }, sectionRef.current);
    return () => ctx.revert();
  }, [timeline, items, startTime, sectionDuration, endTime]); // endTime 추가

  return (
    // 1. 'sticky'를 제거하고, '악보'에서 계산된 '높이(height)'를 할당
    <div ref={sectionRef} className="relative" style={{ height: sectionHeight }}>
      {/* 2. '소품'(Visuals)들만 'sticky'를 사용해 화면에 고정 */}
      <div className="sticky top-0 h-screen flex flex-col justify-center items-center p-8">
        <h2 className="absolute top-16 text-3xl font-bold text-primary z-20">
          {content.title || "Our Impact"}
        </h2>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
          {items.map((item: any, index: number) => (
            <div
              key={index}
              className="impact-card bg-card p-6 rounded-lg shadow-lg border border-border"
            >
              <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover rounded-md mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}