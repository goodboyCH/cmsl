"use client";
import { useScrollytelling } from '@bsmnt/scrollytelling';
import { gsap } from 'gsap';
import React, { useLayoutEffect, useRef } from 'react';

export function Section5_Impact({ content }: { content: any }) {
  const { timeline } = useScrollytelling();
  const sectionRef = useRef<HTMLDivElement>(null);

  // --- ⬇️ '새 악보' (2350%) 적용 ⬇️ ---
  const startTime = 16.5; // (14.5 + 2.0)
  const endTime = 22.5; // (16.5 + 6.0)
  const sectionDuration = endTime - startTime; // 6.0 (600vh)
  const sectionHeight = `${sectionDuration * 100}vh`; // "600vh"
  // --- ⬆️ '새 악보' 적용 ⬆️ ---

  const items = content.items || [];

  useLayoutEffect(() => {
    if (!timeline || !sectionRef.current || items.length === 0) return;
    
    const ctx = gsap.context(() => {
      const title = sectionRef.current?.querySelector('h2');
      const impactCards = gsap.utils.toArray<HTMLElement>('.impact-card', sectionRef.current);
      if (!title || impactCards.length === 0) return;

      // (문제 1 해결) 제목 애니메이션
      timeline.fromTo(title, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.1 }, startTime + 0.1);
      timeline.to(title, { opacity: 0, y: -20, duration: 0.1 }, endTime - 0.2);

      // (문제 2 해결)
      const itemDuration = sectionDuration / items.length; // 2.0 (200vh)
      const animationDuration = itemDuration * 0.5; // 1.0 (100vh) -> "텀"을 50%로 설정

      items.forEach((_, i: number) => {
        const card = impactCards[i];
        const itemStartTime = startTime + (i * itemDuration);

        // 'In' 애니메이션 (100vh 동안 실행)
        timeline.fromTo(card, { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: animationDuration, ease: 'power2.out' }, itemStartTime);
        
        // 'Out' 애니메이션 (마지막 아이템 제외)
        if (i < items.length - 1) {
          const nextItemStartTime = itemStartTime + itemDuration;
          timeline.to(card, { opacity: 0, y: -100, duration: animationDuration * 0.5, ease: 'power2.in' }, nextItemStartTime - (animationDuration * 0.5));
        } else {
          // (마지막 아이템 Out 제거)
        }
      });
    }, sectionRef.current); 
    return () => ctx.revert();
  }, [timeline, items, startTime, sectionDuration, endTime]);

  return (
    // (JSX는 변경 없음)
    <div ref={sectionRef} className="relative" style={{ height: sectionHeight }}>
      <div className="sticky top-0 h-screen flex flex-col justify-center items-center p-8">
        <h2 className="absolute top-16 text-3xl font-bold text-primary z-20 opacity-0">
          {content.title || "Our Impact"}
        </h2>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl">
          {items.map((item: any, index: number) => (
            <div
              key={index}
              className="impact-card bg-card p-6 rounded-lg shadow-lg border border-border opacity-0"
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