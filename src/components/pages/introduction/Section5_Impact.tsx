"use client";
import { useScrollytelling } from '@bsmnt/scrollytelling';
import { gsap } from 'gsap';
import React, { useLayoutEffect, useRef } from 'react';

export function Section5_Impact({ content }: { content: any }) {
  const { timeline } = useScrollytelling();
  const sectionRef = useRef<HTMLDivElement>(null);

  // --- ⬇️ '새 악보' (1500%) 적용 ⬇️ ---
  const startTime = 10.5; // 1.80 -> 10.5
  const endTime = 13.5; // 2.40 -> 13.5
  const sectionDuration = endTime - startTime; // 3.0 (300vh)
  const sectionHeight = `${sectionDuration * 100}vh`; // 1000 -> 100
  // --- ⬆️ '새 악보' 적용 ⬆️ ---

  const items = content.items || [];

  useLayoutEffect(() => {
    if (!timeline || !sectionRef.current || items.length === 0) return;
    
    const ctx = gsap.context(() => {
      const title = sectionRef.current?.querySelector('h2');
      const impactCards = gsap.utils.toArray<HTMLElement>('.impact-card', sectionRef.current);
      if (!title || impactCards.length === 0) return;

      // (제목 애니메이션 - duration 0.1로 수정)
      timeline.fromTo(title, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.1 }, startTime);
      timeline.to(title, { opacity: 0, y: -20, duration: 0.1 }, endTime - 0.1);

      // --- ⬇️ (문제 1, 2) GSAP 로직 전면 수정 ⬇️ ---

      // 1. 아이템 1개당 스크롤 시간 (e.g., 3.0 / 3개 = 1.0 (100vh))
      const itemDuration = sectionDuration / items.length;
      // 2. '텀'을 위한 애니메이션 시간 (e.g., 1.0의 70% = 0.7 (70vh))
      const animationDuration = itemDuration * 0.7; 

      items.forEach((_, i: number) => {
        const card = impactCards[i];
        
        // 3. 이 카드가 애니메이션을 시작할 '절대 시점' (10.5, 11.5, 12.5)
        const cardStartTime = startTime + (i * itemDuration);

        // 4. "1번 내용 (텀) 2번 내용 (텀)" 구현
        timeline.fromTo(
          card,
          { opacity: 0, y: 100 }, // from
          { 
            opacity: 1, 
            y: 0, 
            duration: animationDuration, // 0.7 (70vh) 동안만 애니메이션
            ease: 'power2.out'
          },
          cardStartTime // e.g., 10.5
        );
        
        // (마지막 카드가 아니면 '텀' 이후에 사라지는 'Out' 애니메이션 추가)
        if (i < items.length - 1) {
          timeline.to(
            card,
            {
              opacity: 0,
              y: -100,
              duration: animationDuration * 0.5, // 0.35 (35vh) 동안 사라짐
              ease: 'power2.in'
            },
            cardStartTime + itemDuration - (animationDuration * 0.5) // e.g., 11.5 - 0.35 = 11.15
          );
        }
      });
      // --- ⬆️ GSAP 로직 수정 완료 ⬆️ ---

    }, sectionRef.current); 
    return () => ctx.revert();
  }, [timeline, items, startTime, sectionDuration, endTime]);

  return (
    // (JSX는 변경 없음)
    <div ref={sectionRef} className="relative" style={{ height: sectionHeight }}>
      {/* ... */}
    </div>
  );
}