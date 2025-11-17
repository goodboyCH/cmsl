"use client";
import { useScrollytelling } from '@bsmnt/scrollytelling';
import { gsap } from 'gsap';
import React, { useLayoutEffect, useRef } from 'react';
import { SvgImageMorph } from '../../SvgImageMorph';
import { ScrollyText_UI } from '../../ui/ScrollyText_UI';

export function Section2_CoreCapabilites({ content }: { content: any }) {
  const { timeline } = useScrollytelling();
  const sectionRef = useRef<HTMLDivElement>(null); 

  // --- ⬇️ '새 악보' (2350%) 적용 ⬇️ ---
  const startTime = 0.5; 
  const endTime = 8.5; // (0.5 + 8.0)
  const sectionDuration = endTime - startTime; // 8.0 (800vh)
  const sectionHeight = `${sectionDuration * 100}vh`; // "800vh"
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

      // --- ⬇️ (문제 1 해결) ⬇️ ---
      // 제목이 10vh(0.1) 늦게 나타나고 20vh(0.2) 일찍 사라짐
      timeline.fromTo(title, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.1 }, startTime + 0.1);
      timeline.to(title, { opacity: 0, y: -20, duration: 0.1 }, endTime - 0.2);
      // --- ⬆️ (문제 1 해결) ⬆️ ---

      // 1. 아이템 1개당 스크롤 시간 (e.g., 8.0 / 4개 = 2.0 (200vh))
      const itemDuration = sectionDuration / items.length;
      // 2. '전환'에 사용할 스크롤 시간 (e.g., 2.0의 15% = 0.3 (30vh))
      const transitionDuration = itemDuration * 0.15; // 0.25 -> 0.3 (더 부드럽게)

      items.forEach((_, i: number) => {
        // 3. 이 아이템이 시작되는 '절대 시점' (0.5, 2.5, 4.5, 6.5)
        const itemStartTime = startTime + (i * itemDuration);

        // 4. 'In' 애니메이션: '전환 시간'(0.3) 동안 실행
        timeline.fromTo(textSections[i], 
          { opacity: 0, scale: 0.95, y: 30 }, 
          { opacity: 1, scale: 1, y: 0, duration: transitionDuration },
          itemStartTime // e.g., 0.5
        );
        timeline.fromTo(images[i], 
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: transitionDuration },
          itemStartTime
        );
        
        // --- ⬇️ (문제 2 해결) ⬇️ ---
        // 5. 'Out' 애니메이션: (마지막 아이템이 *아니라면*)
        if (i < items.length - 1) {
          const nextItemStartTime = itemStartTime + itemDuration;
          
          timeline.to(textSections[i], 
            { opacity: 0, scale: 0.95, y: -30, duration: transitionDuration },
            nextItemStartTime - transitionDuration // e.g., 2.5 - 0.3 = 2.2
          );
          timeline.to(displacementFilter, { attr: { scale: 150 }, duration: transitionDuration }, nextItemStartTime - transitionDuration);
          timeline.to(images[i], { autoAlpha: 0, duration: transitionDuration }, '<');
          timeline.to(displacementFilter, { attr: { scale: 0 }, duration: 0 }, nextItemStartTime);
        
        // 6. (문제 2 해결) '마지막' 아이템의 'Out' 애니메이션을 '제거'
        } else {
          // (아무것도 하지 않음 - 마지막 아이템은 6.5 ~ 8.5 (200vh) 내내 보임)
        }
        // --- ⬆️ (문제 2 해결) ⬆️ ---
      });
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