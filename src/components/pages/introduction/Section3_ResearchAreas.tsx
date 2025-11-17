"use client";
import { useScrollytelling } from '@bsmnt/scrollytelling';
import { gsap } from 'gsap';
import React, { useLayoutEffect, useRef } from 'react';
import { ScrollyText_UI } from '../../ui/ScrollyText_UI';

export function Section3_ResearchAreas({ content }: { content: any }) {
  const { timeline } = useScrollytelling();
  const sectionRef = useRef<HTMLDivElement>(null);

  // --- ⬇️ '새 악보' (1500%) 적용 ⬇️ ---
  const startTime = 5.5; // 0.95 -> 5.5
  const endTime = 8.5; // 1.55 -> 8.5
  const sectionDuration = endTime - startTime; // 3.0 (300vh)
  const sectionHeight = `${sectionDuration * 100}vh`; // 1000 -> 100
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

      // (제목 애니메이션 - duration 0.1로 수정)
      timeline.fromTo(title, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.1 }, startTime);
      timeline.to(title, { opacity: 0, y: -20, duration: 0.1 }, endTime - 0.1);

      // --- ⬇️ (문제 1, 2) GSAP 로직 전면 수정 ⬇️ ---

      // 1. 아이템 1개당 스크롤 시간 (e.g., 3.0 / 3개 = 1.0 (100vh))
      const itemDuration = sectionDuration / items.length;
      // 2. '전환'에 사용할 스크롤 시간 (e.g., 1.0의 25% = 0.25 (25vh))
      const transitionDuration = itemDuration * 0.25;

      items.forEach((_, i: number) => {
        // 3. 이 아이템이 시작되는 '절대 시점' (5.5, 6.5, 7.5)
        const itemStartTime = startTime + (i * itemDuration);

        // 4. 'In' 애니메이션: '전환 시간'(0.25) 동안 실행
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
        
        // 5. 'Out' 애니메이션: (마지막 아이템이 *아니라면*)
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
        
        // 6. (문제 1 해결) '마지막' 아이템일 경우, 섹션 끝에서 사라짐
        } else {
          timeline.to(textSections[i],
            { opacity: 0, scale: 0.95, y: -30, duration: transitionDuration },
            endTime - transitionDuration // e.g., 8.5 - 0.25 = 8.25
          );
          timeline.to(images[i],
            { opacity: 0, scale: 0.95, duration: transitionDuration },
            endTime - transitionDuration
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