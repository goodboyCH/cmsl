"use client";
import { useScrollytelling } from '@bsmnt/scrollytelling';
import { gsap } from 'gsap';
import React, { useLayoutEffect, useRef } from 'react';
import { ScrollyText_UI } from '../../ui/ScrollyText_UI';

export function Section3_ResearchAreas({ content }: { content: any }) {
  const { timeline } = useScrollytelling();
  const sectionRef = useRef<HTMLDivElement>(null);

  const startTime = 0.40; // 30% -> 40%
  const endTime = 0.70; // 60% -> 70%
  const sectionDuration = endTime - startTime; // 30% (0.30)
  const sectionHeight = `${sectionDuration * 1000}vh`; // "300vh" (동일)

  const items = content.items || [];
  const imageList = items.map((item: any) => item.imageUrl);

  useLayoutEffect(() => {
    if (!timeline || !sectionRef.current || items.length === 0) return;

    const ctx = gsap.context(() => {
      const title = sectionRef.current?.querySelector('h2');
      const textSections = gsap.utils.toArray<HTMLElement>('.research-text', sectionRef.current);
      const images = gsap.utils.toArray<HTMLImageElement>('.research-image', sectionRef.current);
      
      if (!title || textSections.length === 0 || images.length === 0) return;

      // (제목 애니메이션 추가)
      timeline.fromTo(title, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.01 }, startTime);
      timeline.to(title, { opacity: 0, y: -20, duration: 0.01 }, endTime - 0.01);

      // (아이템 1개에 할당된 '진행도' - 이 로직은 이미 올바름)
      const itemDuration = sectionDuration / items.length;
      
      const itemsTL = gsap.timeline(); 
      itemsTL.set(textSections[0], { opacity: 1, scale: 1, y: 0 });
      itemsTL.set(images[0], { opacity: 1, scale: 1 });

      items.forEach((_, i: number) => {
        if (i === 0) return; 

        // (텍스트/이미지 전환 로직은 이미 'itemDuration' 비례로 올바르게 되어 있음)
        const textTL = gsap.timeline();
        textTL.to(textSections[i - 1], { opacity: 0, scale: 0.95, y: -30, duration: itemDuration * 0.4 }).fromTo(textSections[i], { opacity: 0, scale: 0.95, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: itemDuration * 0.4 }, 0);
        
        const morphTL = gsap.timeline(); // (이름은 morphTL이지만 실제론 교차 페이드)
        morphTL.to(images[i - 1], { opacity: 0, scale: 0.95, duration: itemDuration * 0.5 }).fromTo(images[i], { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: itemDuration * 0.5 }, '<');
        
        // (timeline.add 시점이 itemStartTime이었던 것을 로컬 타임라인으로 통합)
        itemsTL.add(textTL, `item-${i}`); // 로컬 타임라인에 라벨로 추가
        itemsTL.add(morphTL, `item-${i}`); // 로컬 타임라인에 라벨로 추가
      });

      // --- ⬇️ 수정된 부분 ⬇️ ---
      // 7. 이 '순수 시퀀스'를 30% 스크롤(sectionDuration) 동안 'scrub'
      timeline.add(itemsTL, startTime); // 3개 인수를 2개 인수로 수정
      // --- ⬆️ 수정된 부분 ⬆️ ---

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