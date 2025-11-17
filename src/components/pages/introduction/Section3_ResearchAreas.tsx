"use client";
import { useScrollytelling } from '@bsmnt/scrollytelling';
import { gsap } from 'gsap';
import React, { useLayoutEffect, useRef } from 'react';
import { ScrollyText_UI } from '../../ui/ScrollyText_UI';

export function Section3_ResearchAreas({ content }: { content: any }) {
  const { timeline } = useScrollytelling();
  const sectionRef = useRef<HTMLDivElement>(null);

  // --- ⬇️ '새 악보' (1250%) 적용 ⬇️ ---
  const startTime = 4.5; // (0.5 + 4.0)
  const endTime = 7.5; // (4.5 + 3.0)
  const sectionDuration = endTime - startTime; // 3.0 (300vh)
  const sectionHeight = `${sectionDuration * 100}vh`; // 300vh
  // --- ⬆️ '새 악보' 적용 ⬆️ ---

  const items = content.items || [];
  const imageList = items.map((item: any) => item.imageUrl);

  useLayoutEffect(() => {
    if (!timeline || !sectionRef.current || items.length === 0) return;

    const ctx = gsap.context(() => {
      // (title, textSections, images ... 변수 선언은 동일)
      const title = sectionRef.current?.querySelector('h2');
      const textSections = gsap.utils.toArray<HTMLElement>('.research-text', sectionRef.current);
      const images = gsap.utils.toArray<HTMLImageElement>('.research-image', sectionRef.current);
      if (!title || textSections.length === 0 || images.length === 0) return;

      // (제목 애니메이션 - duration 0.1로 수정)
      timeline.fromTo(title, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.1 }, startTime);
      timeline.to(title, { opacity: 0, y: -20, duration: 0.1 }, endTime - 0.1);

      // --- ⬇️ (문제 1 해결) GSAP 로직 수정 ⬇️ ---

      // (아이템 1개당 시간, '전환' 시간 계산은 동일)
      const itemDuration = sectionDuration / items.length; // 1.0 (100vh)
      const transitionDuration = itemDuration * 0.25; // 0.25 (25vh)

      items.forEach((_, i: number) => {
        // ( 'In' 애니메이션은 동일)
        const itemStartTime = startTime + (i * itemDuration);
        const itemEndTime = itemStartTime + itemDuration;

        timeline.fromTo(textSections[i], { opacity: 0, scale: 0.95, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: transitionDuration }, itemStartTime);
        timeline.fromTo(images[i], { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: transitionDuration }, itemStartTime);
        
        // 5. 'Out' 애니메이션: (마지막 아이템이 *아니라면*)
        if (i < items.length - 1) {
            const nextItemStartTime = itemStartTime + itemDuration;
            timeline.to(textSections[i], { opacity: 0, scale: 0.95, y: -30, duration: transitionDuration }, nextItemStartTime - transitionDuration);
            timeline.to(images[i], { opacity: 0, scale: 0.95, duration: transitionDuration }, nextItemStartTime - transitionDuration);
          
          // 6. (문제 해결) '마지막' 아이템의 'Out' 애니메이션을 '제거'
          } else {
            // (아무것도 하지 않음)
          }
        // --- ⬆️ (문제 1 해결) ⬆️ ---
      });
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