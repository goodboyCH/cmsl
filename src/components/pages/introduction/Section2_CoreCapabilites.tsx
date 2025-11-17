"use client";
import { useScrollytelling } from '@bsmnt/scrollytelling';
import { gsap } from 'gsap';
import React, { useLayoutEffect, useRef } from 'react';
import { SvgImageMorph } from '../../SvgImageMorph';
import { ScrollyText_UI } from '../../ui/ScrollyText_UI';

export function Section2_CoreCapabilites({ content }: { content: any }) {
  const { timeline } = useScrollytelling();
  const sectionRef = useRef<HTMLDivElement>(null); 

  // --- ⬇️ '새 악보' (2600%) 적용 ⬇️ ---
  const startTime = 0.10; // 10%
  const endTime = 0.90; // 90% (10% + 80%)
  const sectionDuration = endTime - startTime; // 80% (0.80)
  const sectionHeight = `${sectionDuration * 1000}vh`; // "800vh"
  // --- ⬆️ '새 악보' 적용 ⬆️ ---

  const items = content.items || [];
  const imageList = items.map((item: any) => item.imageUrl);

  useLayoutEffect(() => {
    if (!timeline || !sectionRef.current || items.length === 0) return;

    const ctx = gsap.context(() => {
      const title = sectionRef.current?.querySelector('h2');
      const textSections = gsap.utils.toArray<HTMLElement>('.core-cap-text', sectionRef.current);
      const images = gsap.utils.toArray<SVGImageElement>('.core-cap-image', sectionRef.current);
      const displacementFilter = sectionRef.current?.querySelector('#displacement-filter feDisplacementMap');
      
      if (!title || textSections.length === 0 || images.length === 0 || !displacementFilter) return;

      // (제목 애니메이션은 동일)
      timeline.fromTo(title, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.01 }, startTime);
      timeline.to(title, { opacity: 0, y: -20, duration: 0.01 }, endTime - 0.01);

      // --- ⬇️ (문제 1, 2) GSAP 로직 전면 수정 ⬇️ ---

      // 1. 아이템 1개당 스크롤 시간 (e.g., 80% / 4개 = 20%)
      const itemDuration = sectionDuration / items.length;
      // 2. '전환'에 사용할 스크롤 시간 (e.g., 20%의 25% = 5%)
      const transitionDuration = itemDuration * 0.25;

      items.forEach((_, i: number) => {
        // 3. 이 아이템이 시작되는 '절대 시점' (10%, 30%, 50%, 70%)
        const itemStartTime = startTime + (i * itemDuration);

        // 4. 'In' 애니메이션: '전환 시간'(5%) 동안 실행
        timeline.fromTo(textSections[i], 
          { opacity: 0, scale: 0.95, y: 30 }, 
          { opacity: 1, scale: 1, y: 0, duration: transitionDuration },
          itemStartTime // e.g., 10%
        );
        timeline.fromTo(images[i], 
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: transitionDuration },
          itemStartTime
        );
        
        // 5. 'Out' 애니메이션: (마지막 아이템이 아니라면) 
        //    다음 아이템이 시작되기 '직전'에 '전환 시간'(5%) 동안 실행
        if (i < items.length - 1) {
          const nextItemStartTime = itemStartTime + itemDuration;
          
          timeline.to(textSections[i], 
            { opacity: 0, scale: 0.95, y: -30, duration: transitionDuration },
            nextItemStartTime - transitionDuration // e.g., 30% - 5% = 25%
          );
          // (이미지는 '우글' 효과를 위해 다음 아이템과 겹치게 함)
          timeline.to(displacementFilter, { attr: { scale: 150 }, duration: transitionDuration }, nextItemStartTime - transitionDuration);
          timeline.to(images[i], { autoAlpha: 0, duration: transitionDuration }, '<');
          timeline.to(displacementFilter, { attr: { scale: 0 }, duration: 0 }, nextItemStartTime); // 다음 아이템 시작 시 필터 리셋
        }
      });
      // --- ⬆️ GSAP 로직 수정 완료 ⬆️ ---

    }, sectionRef.current); 
    return () => ctx.revert();
  }, [timeline, items, startTime, sectionDuration, endTime]);

  return (
    // (JSX는 변경 없음)
    <div ref={sectionRef} className="relative" style={{ height: sectionHeight }}>
      <div className="sticky top-0 h-screen">
        <h2 className="absolute top-16 left-1/2 -translate-x-1/2 text-3xl font-bold text-primary z-20 opacity-0">
          {content.title}
        </h2>
        <SvgImageMorph imageUrls={imageList} imageClassName="core-cap-image" />
        <div className="absolute inset-0 z-10">
          {items.map((item: any, index: number) => (
            <ScrollyText_UI
              key={index}
              item={item}
              className={`core-cap-text`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}