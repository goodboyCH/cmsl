"use client";
import { useScrollytelling } from '@bsmnt/scrollytelling';
import { gsap } from 'gsap';
import React, { useLayoutEffect, useRef } from 'react';
import { ScrollyText_UI } from '../../ui/ScrollyText_UI';

export function Section3_ResearchAreas({ content }: { content: any }) {
  const { timeline } = useScrollytelling();
  const sectionRef = useRef<HTMLDivElement>(null);

  // --- ⬇️ '새 악보' (2600%) 적용 ⬇️ ---
  const startTime = 0.95; // 95%
  const endTime = 1.55; // 155% (95% + 60%)
  const sectionDuration = endTime - startTime; // 60% (0.60)
  const sectionHeight = `${sectionDuration * 1000}vh`; // "600vh"
  // --- ⬆️ '새 악보' 적용 ⬆️ ---

  const items = content.items || [];
  const imageList = items.map((item: any) => item.imageUrl);

  useLayoutEffect(() => {
    if (!timeline || !sectionRef.current || items.length === 0) return;

    const ctx = gsap.context(() => {
      const title = sectionRef.current?.querySelector('h2');
      const textSections = gsap.utils.toArray<HTMLElement>('.research-text', sectionRef.current);
      const images = gsap.utils.toArray<HTMLImageElement>('.research-image', sectionRef.current);
      
      if (!title || textSections.length === 0 || images.length === 0) return;

      // (제목 애니메이션은 동일)
      timeline.fromTo(title, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.01 }, startTime);
      timeline.to(title, { opacity: 0, y: -20, duration: 0.01 }, endTime - 0.01);

      // --- ⬇️ (문제 1, 2, 3) GSAP 로직 전면 수정 ⬇️ ---

      // 1. 아이템 1개당 스크롤 시간 (e.g., 60% / 3개 = 20%)
      const itemDuration = sectionDuration / items.length;
      // 2. '전환'에 사용할 스크롤 시간 (e.g., 20%의 25% = 5%)
      const transitionDuration = itemDuration * 0.25;

      items.forEach((_, i: number) => {
        // 3. 이 아이템이 시작되는 '절대 시점'
        const itemStartTime = startTime + (i * itemDuration);

        // 4. 'In' 애니메이션: '전환 시간'(5%) 동안 실행
        timeline.fromTo(textSections[i], 
          { opacity: 0, scale: 0.95, y: 30 }, 
          { opacity: 1, scale: 1, y: 0, duration: transitionDuration },
          itemStartTime
        );
        timeline.fromTo(images[i], // (교차 페이드)
          { opacity: 0, scale: 1.05 },
          { opacity: 1, scale: 1, duration: transitionDuration },
          itemStartTime
        );
        
        // 5. 'Out' 애니메이션: (마지막 아이템이 아니라면) 
        if (i < items.length - 1) {
          const nextItemStartTime = itemStartTime + itemDuration;
          
          timeline.to(textSections[i], 
            { opacity: 0, scale: 0.95, y: -30, duration: transitionDuration },
            nextItemStartTime - transitionDuration
          );
          timeline.to(images[i], // (교차 페이드)
            { opacity: 0, scale: 0.95, duration: transitionDuration },
            nextItemStartTime - transitionDuration
          );
        }
      });
      // --- ⬆️ GSAP 로직 수정 완료 ⬆️ ---

    }, sectionRef.current); 
    return () => ctx.revert();
  }, [timeline, items, startTime, sectionDuration, endTime]);

  return (
    // (JSX는 변경 없음, 'Sectoin2'에서 복사해옴)
    <div ref={sectionRef} className="relative" style={{ height: sectionHeight }}>
      <div className="sticky top-0 h-screen">
        <h2 className="absolute top-16 left-1/2 -translate-x-1/2 text-3xl font-bold text-primary z-20 opacity-0">
          {content.title}
        </h2>
        <div className="absolute inset-0 z-0">
          {imageList.map((url, index) => (
            <img
              key={url}
              src={url}
              alt={items[index]?.title || 'Research Image'}
              className="research-image w-full h-full object-cover absolute inset-0"
              style={{ opacity: 0 }}
            />
          ))}
        </div>
        <div className="absolute inset-0 z-10">
          {items.map((item: any, index: number) => (
            <ScrollyText_UI
              key={index}
              item={item}
              className={`research-text`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}