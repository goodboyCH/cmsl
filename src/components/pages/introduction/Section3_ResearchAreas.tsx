"use client";
import { useScrollytelling } from '@bsmnt/scrollytelling';
import { gsap } from 'gsap';
import React, { useLayoutEffect, useRef } from 'react';

// '소품'(Dumb UI) 컴포넌트 임포트 (동일)
import { SvgImageMorph } from '../../SvgImageMorph';
import { ScrollyText_UI } from '../../ui/ScrollyText_UI';

// Supabase의 'research' 객체를 받음
export function Section3_ResearchAreas({ content }: { content: any }) {
  const { timeline } = useScrollytelling();
  const sectionRef = useRef<HTMLDivElement>(null); // 'Scope' 문제 해결용 ref

  // '악보' 시점
  const startTime = 0.30; // 30%
  const endTime = 0.60; // 60%
  const sectionDuration = endTime - startTime; // 30% (0.30)
  const sectionHeight = `${sectionDuration * 1000}vh`; // "300vh"

  const items = content.items || [];
  const imageList = items.map((item: any) => item.imageUrl);

  // Level 2 'Hook' 접근 방식
  useLayoutEffect(() => {
    if (!timeline || !sectionRef.current || items.length === 0) return;

    const ctx = gsap.context(() => {
      // 'Scope' 내부에서 고유한 클래스 이름으로 GSAP 대상들을 찾음
      const textSections = gsap.utils.toArray<HTMLElement>('.research-text', sectionRef.current);
      const images = gsap.utils.toArray<SVGImageElement>('.research-image', sectionRef.current);
      const displacementFilter = sectionRef.current?.querySelector('#displacement-filter feDisplacementMap');
      
      if (textSections.length === 0 || images.length === 0 || !displacementFilter) return;

      // 첫 번째 항목은 'startTime' (30%)에 보이도록 등록
      timeline.set(textSections[0], { opacity: 1, scale: 1, y: 0 }, startTime);
      timeline.set(images[0], { autoAlpha: 1 }, startTime);

      // --- ⬇️ 수정된 부분 (Section2와 동일한 로직 적용) ⬇️ ---

      // 1. (신규) 아이템 1개에 할당된 '진행도'
      const itemDuration = sectionDuration / items.length;

      items.forEach((_, i: number) => {
        if (i === 0) return; 

        // 2. 각 아이템의 '절대' 시작 시점
        const itemStartTime = startTime + (i * itemDuration);
        
        // 3. 텍스트 전환 (duration을 '진행도' 비례로 수정)
        const textTL = gsap.timeline();
        textTL
          .to(textSections[i - 1], { opacity: 0, scale: 0.95, y: -30, duration: itemDuration * 0.4 })
          .fromTo(textSections[i], { opacity: 0, scale: 0.95, y: 30 }, 
                { opacity: 1, scale: 1, y: 0, duration: itemDuration * 0.4 }, 0);
        
        // 4. 이미지 모핑 (duration을 '진행도' 비례로 수정)
        const morphTL = gsap.timeline();
        morphTL
          .to(displacementFilter, { attr: { scale: 150 }, duration: itemDuration * 0.5 }) // itemDuration의 50%
          .to(images[i - 1], { autoAlpha: 0 }, '<')
          .to(images[i], { autoAlpha: 1 }, '<')
          .to(displacementFilter, { attr: { scale: 0 }, duration: itemDuration * 0.5 });
          
        // 5. 마스터 타임라인에 '절대 시점'으로 등록 (초 빼기 제거)
        timeline.add(textTL, itemStartTime);
        timeline.add(morphTL, itemStartTime);
        // --- ⬆️ 수정된 부분 ⬆️ ---
      });
    }, sectionRef.current); // <-- 'Scope' 적용

    return () => ctx.revert();
  }, [timeline, items, startTime, sectionDuration]); // <-- 의존성 배열

  return (
    // 핀(pin) 효과: '악보' 30%~60% 동안 화면에 고정
    <div ref={sectionRef} className="relative" style={{ height: sectionHeight }}>
      {/* '소품'(Visuals)들만 'sticky'를 사용해 화면에 고정 */}
      <div className="sticky top-0 h-screen">
        <h2 className="absolute top-16 left-1/2 -translate-x-1/2 text-3xl font-bold text-primary z-20">
          {content.title}
        </h2>

        {/* '소품' 렌더링: '배우'가 찾을 수 있도록 고유한 클래스 이름 전달 */}
        <SvgImageMorph imageUrls={imageList} imageClassName="research-image" />

        {/* '소품' 렌더링: 텍스트 UI */}
        <div className="absolute inset-0 z-10">
          {items.map((item: any, index: number) => (
            <ScrollyText_UI
              key={index}
              item={item}
              className={`research-text`} // 고유한 클래스
            />
          ))}
        </div>
      </div>
    </div>
  );
}