"use client";
import { useScrollytelling } from '@bsmnt/scrollytelling';
import { gsap } from 'gsap';
import React, { useLayoutEffect, useRef } from 'react';

export function Section5_Impact({ content }: { content: any }) {
  const { timeline } = useScrollytelling();
  const sectionRef = useRef<HTMLDivElement>(null);

  // --- ⬇️ '새 악보' (1250%) 적용 ⬇️ ---
  const startTime = 8.5; // 10.5 -> 8.5
  const endTime = 11.5; // 13.5 -> 11.5
  const sectionDuration = endTime - startTime; // 3.0 (300vh)
  const sectionHeight = `${sectionDuration * 100}vh`; // 1000 -> 100
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

      // (아이템 1개당 시간, '애니메이션' 시간 계산은 동일)
      const itemDuration = sectionDuration / items.length; // 1.0 (100vh)
      const animationDuration = itemDuration * 0.7; // 0.7 (70vh)

      items.forEach((_, i: number) => {
        const card = impactCards[i];
        const cardStartTime = startTime + (i * itemDuration);

        // ('In' 애니메이션은 동일)
        timeline.fromTo(card, { opacity: 0, y: 100 }, { opacity: 1, y: 0, duration: animationDuration, ease: 'power2.out' }, cardStartTime);
        
        // --- ⬇️ (문제 1 해결) ⬇️ ---
        // 5. 'Out' 애니메이션: (마지막 아이템이 *아니라면*)
        if (i < items.length - 1) {
          // (이전 코드에서 이 'Out' 로직이 빠져있었습니다)
          const nextItemStartTime = cardStartTime + itemDuration;
          const outStartTime = nextItemStartTime - (animationDuration * 0.5); // 다음 시작 0.35초 전
          
          timeline.to(card, { opacity: 0, y: -100, duration: animationDuration * 0.5, ease: 'power2.in' }, outStartTime);
        
        // 6. (문제 1 해결) '마지막' 아이템의 'Out' 애니메이션을 '제거'
        } else {
          // (아무것도 하지 않음)
        }
        // --- ⬆️ (문제 1 해결) ⬆️ ---
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