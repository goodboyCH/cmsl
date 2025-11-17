"use client";
import { useScrollytelling } from '@bsmnt/scrollytelling';
import { gsap } from 'gsap';
import React, { useLayoutEffect, useRef } from 'react';

export function Section5_Impact({ content }: { content: any }) {
  const { timeline } = useScrollytelling();
  const sectionRef = useRef<HTMLDivElement>(null);

  // --- ⬇️ '새 악보' (1250%) 적용 ⬇️ ---
  const startTime = 8.5; // (7.5 + 1.0)
  const endTime = 11.5; // (8.5 + 3.0)
  const sectionDuration = endTime - startTime; // 3.0 (300vh)
  const sectionHeight = `${sectionDuration * 100}vh`; // 300vh
  // --- ⬆️ '새 악보' 적용 ⬆️ ---

  const items = content.items || [];

  useLayoutEffect(() => {
    if (!timeline || !sectionRef.current || items.length === 0) return;
    
    const ctx = gsap.context(() => {
      // (title, impactCards ... 변수 선언은 동일)
      const title = sectionRef.current?.querySelector('h2');
      const impactCards = gsap.utils.toArray<HTMLElement>('.impact-card', sectionRef.current);
      if (!title || impactCards.length === 0) return;

      // (제목 애니메이션 - duration 0.1로 수정)
      timeline.fromTo(title, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.1 }, startTime);
      timeline.to(title, { opacity: 0, y: -20, duration: 0.1 }, endTime - 0.1);

      // --- ⬇️ (문제 1 해결) GSAP 로직 수정 ⬇️ ---

      // 1. 아이템 1개당 스크롤 시간 (e.g., 3.0 / 3개 = 1.0 (100vh))
      const itemDuration = sectionDuration / items.length;
      // 2. '텀'을 위한 애니메이션 시간 (e.g., 1.0의 70% = 0.7 (70vh))
      const animationDuration = itemDuration * 0.7; 

      items.forEach((_, i: number) => {
        const card = impactCards[i];
        const itemStartTime = startTime + (i * itemDuration);
        const itemEndTime = itemStartTime + itemDuration;

        // 3. 'In' 애니메이션
        timeline.fromTo(card, { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: animationDuration, ease: 'power2.out' }, itemStartTime);
        
        // 4. 'Out' 애니메이션: (마지막 아이템이 *아니라면*)
        if (i < items.length - 1) {
            const nextItemStartTime = itemStartTime + itemDuration;
            const outStartTime = nextItemStartTime - (animationDuration * 0.5); 
            
            timeline.to(card, { opacity: 0, y: -100, duration: animationDuration * 0.5, ease: 'power2.in' }, outStartTime);
          
          // 5. (문제 해결) '마지막' 아이템의 'Out' 애니메이션을 '제거'
          } else {
            // (아무것도 하지 않음)
          }
      });
      // --- ⬆️ GSAP 로직 수정 완료 ⬆️ ---

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