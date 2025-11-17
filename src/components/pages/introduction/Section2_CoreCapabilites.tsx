"use client";
import { useScrollytelling } from '@bsmnt/scrollytelling';
import { gsap } from 'gsap';
import React, { useLayoutEffect, useRef } from 'react';
import { SvgImageMorph } from '../../SvgImageMorph';
import { ScrollyText_UI } from '../../ui/ScrollyText_UI';

export function Section2_CoreCapabilites({ content }: { content: any }) {
  const { timeline } = useScrollytelling();
  const sectionRef = useRef<HTMLDivElement>(null); 

  const startTime = 0.05;
  const endTime = 0.30;
  const sectionDuration = endTime - startTime;
  const sectionHeight = `${sectionDuration * 1000}vh`;

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

      // --- ⬇️ 수정된 부분 ⬇️ ---

      // 1. (문제 2 해결) 아이템 1개에 할당된 '진행도'
      const itemDuration = sectionDuration / items.length;

      // 2. 아이템들을 '순차적으로' 실행할 로컬 타임라인
      const itemsTL = gsap.timeline();
      
      itemsTL.set(textSections[0], { opacity: 1, scale: 1, y: 0 });
      itemsTL.set(images[0], { autoAlpha: 1 });

      items.forEach((_, i: number) => {
        if (i === 0) return;

        // 3. 텍스트 전환 (duration을 '진행도' 비례로 수정)
        itemsTL
          .to(textSections[i - 1], { opacity: 0, scale: 0.95, y: -30, duration: itemDuration * 0.4 }, `item-${i}`)
          .fromTo(textSections[i], { opacity: 0, scale: 0.95, y: 30 }, 
                { opacity: 1, scale: 1, y: 0, duration: itemDuration * 0.4 }, `<`);
        
        // 4. 이미지 모핑 등록 (duration을 '진행도' 비례로 수정)
        itemsTL
          .to(displacementFilter, { attr: { scale: 150 }, duration: itemDuration * 0.5 }, `item-${i}`)
          .to(images[i - 1], { autoAlpha: 0, duration: itemDuration * 0.5 }, '<')
          .to(images[i], { autoAlpha: 1, duration: itemDuration * 0.5 }, '<')
          .to(displacementFilter, { attr: { scale: 0 }, duration: itemDuration * 0.5 });
      });

      // 5. 이 로컬 타임라인을 '2개 인수'로 마스터 타임라인에 '등록'
      //    (itemsTL의 총 duration은 'sectionDuration'과 거의 같아짐)
      timeline.add(itemsTL, startTime);
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