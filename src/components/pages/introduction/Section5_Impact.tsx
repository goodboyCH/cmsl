"use client";
import { useScrollytelling } from '@bsmnt/scrollytelling';
import { gsap } from 'gsap';
import React, { useLayoutEffect, useRef } from 'react';

export function Section5_Impact({ content }: { content: any }) {
  const { timeline } = useScrollytelling();
  const sectionRef = useRef<HTMLDivElement>(null);

  const startTime = 0.70;
  const endTime = 0.90;
  const sectionDuration = endTime - startTime;
  const sectionHeight = `${sectionDuration * 1000}vh`;

  const items = content.items || [];

  useLayoutEffect(() => {
    if (!timeline || !sectionRef.current || items.length === 0) return;
    
    const ctx = gsap.context(() => {
      const title = sectionRef.current?.querySelector('h2');
      const impactCards = gsap.utils.toArray<HTMLElement>('.impact-card', sectionRef.current);
      
      if (!title || impactCards.length === 0) return;

      // (제목 애니메이션 추가)
      timeline.fromTo(title, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.01 }, startTime);
      timeline.to(title, { opacity: 0, y: -20, duration: 0.01 }, endTime - 0.01);

      // --- ⬇️ (문제 4 해결) ⬇️ ---
      const itemsTL = gsap.timeline();

      // 'stagger' 값을 '초'가 아닌 '진행도'에 비례하도록 수정
      const staggerDuration = sectionDuration / items.length; // 20% / 3개 = 6.6%

      itemsTL.fromTo(
        impactCards, 
        { opacity: 0, y: 100 }, 
        { 
          opacity: 1, 
          y: 0, 
          stagger: staggerDuration * 0.5, // 0.2초 대신 진행도에 비례 (0.5는 예시)
          ease: 'power2.out' 
        }
      );

      // 3개 인수를 2개 인수로 수정
      timeline.add(itemsTL, startTime);
      // --- ⬆️ (문제 4 해결) ⬆️ ---

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