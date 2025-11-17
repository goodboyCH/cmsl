"use client";
import { useScrollytelling } from '@bsmnt/scrollytelling';
import { gsap } from 'gsap';
import React, { useLayoutEffect, useRef } from 'react';

export function Section5_Impact({ content }: { content: any }) {
  const { timeline } = useScrollytelling();
  const sectionRef = useRef<HTMLDivElement>(null);

  const startTime = 0.90; // 70% -> 90%
  const endTime = 1.10; // 90% -> 110%
  const sectionDuration = endTime - startTime; // 20% (동일)
  const sectionHeight = `${sectionDuration * 1000}vh`; // "200vh"

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

      // 1. 아이템 1개에 할당된 '진행도' (스크롤 시간)
      const itemDuration = sectionDuration / items.length; // 20% / 3개 = 6.6%

      // 2. 'stagger' 대신 'forEach' 루프로 각 카드를 개별 등록
      items.forEach((_, i: number) => {
        const card = impactCards[i];
        
        // 3. 이 카드가 애니메이션을 시작할 '절대 시점'
        const cardStartTime = startTime + (i * itemDuration);

        // 4. "1번 내용 (텀) 2번 내용 (텀)" 구현:
        //    (itemDuration * 0.7) 동안 애니메이션하고 (itemDuration * 0.3) 동안 멈춥니다.
        const animationDuration = itemDuration * 0.7; 

        // 5. 마스터 타임라인에 'cardStartTime'에 맞춰 개별 등록
        timeline.fromTo(
          card,
          { opacity: 0, y: 100 }, // from
          { 
            opacity: 1, 
            y: 0, 
            duration: animationDuration, // 70% 스크롤 동안만 애니메이션
            ease: 'power2.out'
          },
          cardStartTime // 이 카드의 시작 시간
        );
      });
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